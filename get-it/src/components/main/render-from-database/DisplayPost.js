import React, { useState, useEffect, useContext } from "react";
import { db } from "../../../firebase";
import { doc, getDoc, serverTimestamp} from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import { updateLikes, deletePost } from "../../../logic/post";
import { addComment, updateCommentLikes, deleteComment, fetchCommentsFromCurrentPage } from "../../../logic/comment";
import { UserContext } from "../../../contexts/UserContext";
import { EditContext } from "../../../contexts/EditPostContext";
import { EditCommentContext } from "../../../contexts/EditCommentContext";
import { RefreshCommentsContext } from "../../../contexts/RefreshCommentsContext";


const DisplayPost = () => {
    const [post, setPost] = useState(null); // hold the post to be displayed
    const [commentData, setCommentData] = useState(null); // holds the commentData to be displayed
    const [count, setCount] = useState(0); // This state helps control the number of times firebase is called to get the post.
    const [commentCount, setCommentCount] = useState(0); // This state helps control the number of times firebase is called to get the comments.
    const [comment, setComment] = useState(""); // holds the string for the textarea input
    const [noClick, setNoClick] = useState(false); // When true, the disabled class is applied to like/dislike
    const [sortOption, setSortOption] = useState("new"); // Track sorting state
    const [isLoading, setIsLoading] = useState(false); // Track loading state
    const [activateComments, setActivate] = useState(false); // When the comments button is clicked, displays comments
    const {page, id} = useParams(); // get the page and post id from the url
    const navigate = useNavigate();
    const {user} = useContext(UserContext); // if the user is logged in
    const {setEdit} = useContext(EditContext); // Controls the edit form pop up on the post
    const {setEditComment} = useContext(EditCommentContext); // Controls the edit form pop up on the comment
    const {refreshComments, setRefreshComments} = useContext(RefreshCommentsContext); // so that useEffect can refresh when a new comment is made

    const handleGoBack = () => {
        navigate(`/${page}`);
    };

      const loadPost = async () => {
        const fetchPost = async () => {
          setIsLoading(true);
          try {
            const postRef = doc(db, `${page}Posts`, id);
            const docSnap = await getDoc(postRef);
            if (docSnap.exists()) {
              setPost({ id: docSnap.id, ...docSnap.data() });
            } else {
              console.log("No such post exists!");
            }
          } catch (error) {
            console.error("Error fetching post: ", error);
          }
        };

        if(count === 1) {
          console.log("Firebase called.");
          await fetchPost();
          setIsLoading(false);
          setCount(0);
        }
      }

      const handleCommentData = async () => {
        const fetchComments = async () => {
          try {
            const comments = await fetchCommentsFromCurrentPage(page, id, sortOption);
            setCommentData(comments);
          } catch (error) {
            console.error("Error fetching comments: ", error);
          }
        }
        if(commentCount === 1) {
          console.log("Firebase called.");
          await fetchComments();
          setCommentCount(0);
        }
      }

      useEffect(() => {
        if(commentCount !== 1)
          setCommentCount(1);
      }, [refreshComments])

      useEffect(() => {
        if(commentCount !== 1) 
          setCommentCount(1);
      }, [sortOption])
        
      // On load control the number of times firebase is called by altering setCount.
      useEffect(() => {
        if(count !== 1)
          setCount(1);
      }, []);
  
      useEffect(() => {
        loadPost();
      }, [count])

      useEffect(() => {
        if(activateComments)
          handleCommentData();
      }, [commentCount, activateComments])
    
      const formatTime = ({ seconds }) => {
        if (typeof seconds !== "number" || isNaN(seconds)) {
          return "Invalid Date";
        }
    
        // Convert seconds to milliseconds
        const milliseconds = seconds * 1000;
    
        // Create a Date object from milliseconds
        const dateObj = new Date(milliseconds);
    
        // Format the date
        const formattedDate = dateObj.toLocaleString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
          timeZone: "UTC",
        });
    
        return formattedDate;
      };

      const handleLike = async (id, likesNum, commentId) => {
        const type = "like";
        setNoClick(true);
        if(commentId) {
          const prevExistingLike = await updateCommentLikes(page, id, commentId, likesNum, type);
          if(prevExistingLike) {
            handleLocalizedCommentLike(commentId, likesNum, type, prevExistingLike);
          } else handleLocalizedNewCommentLike(commentId, likesNum, type);
        } else {
          const prevExistingLike = await updateLikes(page, id, likesNum, type);
          if(prevExistingLike) {
            handleLocalizedPostLike(id, likesNum, type, prevExistingLike);
          } else handleLocalizedNewPostLike(id, likesNum, type);
        }
        setNoClick(false);
      };
    
      const handleDislike = async (id, likesNum, commentid) => {
        const type = "dislike";
        setNoClick(true);
        if(commentid) {
          const prevExistingLike = await updateCommentLikes(page, id, commentid, likesNum, type);
          if(prevExistingLike) {
            handleLocalizedCommentLike(commentid, likesNum, type, prevExistingLike);
          } else handleLocalizedNewCommentLike(commentid, likesNum, type);
        } else {
          const prevExistingLike = await updateLikes(page, id, likesNum, type);
          // Update the local display without calling firestore.
        if(prevExistingLike) {
            handleLocalizedPostLike(id, likesNum, type, prevExistingLike);
          } else handleLocalizedNewPostLike(id, likesNum, type);
        }
        setNoClick(false);
      };

      const handleCommentChange = (str) => {
        setComment(str);
      }

      const handleAddComment = async (page, id, content) => {
        const time = serverTimestamp();
        await addComment(page, id, content, time);
        setComment("");
        setRefreshComments(!refreshComments);
      }

      // When the user likes a comment they have liked before.
      const handleLocalizedCommentLike = (id, likesNum, type, prevExistingLike) => {
        const updatedComments = commentData.map((comment) => {
          // Does post match the post that needs to be changed.
          if (comment.commentid === id) {
              // Did the user click the like or dislike button.
              if(type === "like") {
                // Was the user's previous choice a like or dislike.
                if(prevExistingLike === "like") {
                  // Liking a former like
                  return {
                    ...comment,
                    likes: likesNum - 1,
                  };
                  // Liking a former dislike
                } else {
                  return {
                    ...comment,
                    likes: likesNum + 2,
                  };
                }
            } else {
              // Disliking a former like
              if(prevExistingLike === "like") {
                return {
                  ...comment,
                  likes: likesNum - 2,
                };
              // Disliking a former dislike
              } else {
                return {
                  ...comment,
                  likes: likesNum + 1,
                };
              }
            }
          }
          // If no post found, return the previous item unaltered.
          return comment;
        });
        setCommentData(updatedComments);
      }

      // When the user likes a comment they have not liked before.
      const handleLocalizedNewCommentLike = (id, likesNum, type) => {
        const updatedComments = commentData.map((comment) => {
          if (comment.commentid === id) {
            if(type === "like") {
              // New like
                return {
                  ...comment,
                  likes: likesNum + 1,
              };
              // New dislike
            } else {
              return {
                ...comment,
                likes: likesNum - 1,
              };
            }
          }
          // If no post found, return the previous item unaltered.
          return comment;
        });
        setCommentData(updatedComments);
      }

      // When the user likes a post they have liked before.
      const handleLocalizedPostLike = (postId, likesNum, type, prevExistingLike) => {
        const updatedPost = { ...post };
        if (updatedPost.id === postId) {
          if (type === "like") {
            if (prevExistingLike === "like") {
              updatedPost.likes = likesNum - 1;
            } else {
              updatedPost.likes = likesNum + 2;
            }
          } else {
            if (prevExistingLike === "like") {
              updatedPost.likes = likesNum - 2;
            } else {
              updatedPost.likes = likesNum + 1;
            }
          }
        }
        setPost(updatedPost);
      };


      // When the user likes a post they have not liked before.
      const handleLocalizedNewPostLike = (postId, likesNum, type) => {
        const updatedPost = { ...post };
        if (updatedPost.id === postId) {
          if (type === "like") {
            updatedPost.likes = likesNum + 1;
          } else {
            updatedPost.likes = likesNum - 1;
          }
        }
        setPost(updatedPost);
      };

      const handleEdit = (commentId) => {
        if(commentId) {
          // Edit the comment.
          setEditComment(commentId);
        } else {
          // Edit the post.
          setEdit(id);
        }
      }

      const handleDelete = async (commentId) => {
        if(commentId) {
          // Delete the comment.
          const confirmation = window.confirm("Are you sure you want to delete?");
          if (confirmation) {
            await deleteComment(page, id, commentId);
            setRefreshComments(!refreshComments);
          }
        } else {
          // Delete the post.
          const confirmation = window.confirm("Are you sure you want to delete?");
          if (confirmation) {
            await deletePost(page, id);
            handleGoBack();
          }
        }
      }

      const handleCommentClick = () => {
        setActivate(true);
      }
    
      return (
        <div>
          { isLoading ? 
              <p>Loading...</p>
          : post ? (
            <div className="post-item">
              <h3 className="post-title">{post.title}</h3>
              <p className="post post-owner">Original poster: {post.nickname}</p>
              <p className="post post-time">Time of post in UTC: {formatTime(post.time)}</p>
              <p className="post post-content">{post.content}</p>
              <p className="post post-likes">
                <button
                className={`likebutton ${noClick ? "disabled" : !user ? "disabled" : ""}`}
                onClick={() => {
                    handleLike(id, post.likes);
                }}>Like</button>
                {post.likes}
                <button
                className={`dislikebutton ${noClick ? "disabled" : !user ? "disabled" : ""}`}
                onClick={() => { handleDislike(id, post.likes);}}
                >Dislike</button>
              </p>
              {user && user.email === post.owner ? 
                  <div className="post edit-delete">
                    <button className={`editbutton ${user.email === post.owner ? "" : "disabled"}`}
                    onClick={() => {
                      handleEdit();
                    }}>Edit</button>
                    <button className={`deletebutton ${user.email === post.owner ? "" : "disabled"}`}
                    onClick={() => {
                      handleDelete();
                    }}>Delete</button>
                </div>
              : ""}
              <button onClick={handleGoBack}>Go Back</button>
              {user && post.owner !== "" ? 
                <div className="post comment-area">
                    <textarea
                      className={`comment-textarea ${!user ? "disabled" : ""}`}
                      placeholder="Write your comment..."
                      onChange={(e) => handleCommentChange(e.target.value)}
                      value={comment}
                    ></textarea>
                    <button onClick={() => handleAddComment(page, id, comment)}>Add Comment</button>
                    {commentData ?
                    <div className="sort buttons">
                      <button onClick={() => setSortOption("top")}>Top</button>
                      <button onClick={() => setSortOption("new")}>New</button>
                      <button onClick={() => setSortOption("old")}>Old</button>
                    </div> :
                    <div onClick={() => {
                        handleCommentClick();
                      }}>Comments...
                    </div>}
                    {commentData ? commentData.map((comment, index) => (
                        <div key={index} className="post comment-content">
                          <h6>Posted by: {comment.nickname} at {formatTime(comment.time)}</h6>
                          {comment.content}
                          <button
                            className={`likebutton ${noClick ? "disabled" : !user ? "disabled" : ""}`}
                            onClick={() => {
                                handleLike(id, comment.likes, comment.commentid);
                            }}>Like
                          </button>
                            {comment.likes}
                          <button
                            className={`dislikebutton ${noClick ? "disabled" : !user ? "disabled" : ""}`}
                            onClick={() => {
                                handleDislike(id, comment.likes, comment.commentid);
                            }}>Dislike
                          </button>
                          {user && user.email === comment.owner ? 
                            <div className="edit-delete">
                              <button className={`editbutton ${user.email === comment.owner ? "" : "disabled"}`}
                              onClick={() => {
                                handleEdit(comment.commentid);
                              }}>Edit</button>
                              <button className={`deletebutton ${user.email === comment.owner ? "" : "disabled"}`}
                              onClick={() => {
                                handleDelete(comment.commentid);
                              }}>Delete</button>
                            </div>
                          : ""}
                          
                        </div>
                    )) : ""}
                </div>
              : 
              <div className="post non-user">
                {commentData ? 
                <div className="sort buttons">
                      <button onClick={() => setSortOption("top")}>Top</button>
                      <button onClick={() => setSortOption("new")}>New</button>
                      <button onClick={() => setSortOption("old")}>Old</button>
                  </div> : 
                <div onClick={() => {
                      handleCommentClick();
                    }}>Comments...
                  </div>}
                {commentData ? commentData.map((comment, index) => (
                        <div key={index} className="post comment-content">
                          <h6>Posted by: {comment.nickname} at {formatTime(comment.time)}</h6>
                          {comment.content}
                          <button
                            className={`likebutton ${noClick ? "disabled" : !user ? "disabled" : ""}`}
                            onClick={() => {
                                handleLike(id, comment.likes, comment.commentid);
                            }}>Like
                          </button>
                            {comment.likes}
                          <button
                            className={`dislikebutton ${noClick ? "disabled" : !user ? "disabled" : ""}`}
                            onClick={() => {
                                handleDislike(id, comment.likes, comment.commentid);
                            }}>Dislike
                          </button>
                        </div>
                    )) : ""}
              </div>            
              }
            </div>
          ) : (
            <p>Something's gone wrong...</p>
          )}
        </div>
      );
}

export default DisplayPost;
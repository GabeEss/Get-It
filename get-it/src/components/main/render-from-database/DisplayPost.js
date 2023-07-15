import React, { useState, useEffect } from "react";
import { auth, db } from "../../../firebase";
import { doc, getDoc, getDocs, collection, serverTimestamp } from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import { updateLikes } from "../../../logic/post";
import { addComment, updateCommentLikes } from "../../../logic/comment";
import { onAuthStateChanged } from "firebase/auth";


const DisplayPost = () => {
    const [post, setPost] = useState(null); // hold the post to be displayed
    const [commentData, setCommentData] = useState(null); // holds the commentData to be displayed
    const [count, setCount] = useState(0); // This state helps control the number of times firebase is called on load.
    const [newCommentRefresh, setRefreshComments] = useState(false); // so that useEffect can refresh when a new comment is made
    const [comment, setComment] = useState(""); // holds the string for the textarea input
    const [noClick, setNoClick] = useState(false); // When true, the disabled class is applied to like/dislike
    const { page, id } = useParams(); // get the page and post id from the url
    const navigate = useNavigate();
    const [user, setUser] = useState(null); // if the user is logged in

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is signed in
            setUser(user);
        } else {
            // User is signed out
            setUser(null);
        }
        });

        // Clean up the listener on unmount
        return () => {
            unsubscribe();
        };
    }, []);

    const handleGoBack = () => {
        navigate(`/${page}`);
    };

      const loadPost = async () => {
        const fetchPost = async () => {
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
          setCount(0);
        }
      }
        
  
      // On load control the number of times firebase is called by altering setCount.
      useEffect(() => {
        if(count !== 1)
          setCount(1);
      }, []);
  
      useEffect(() => {
        if(count !== 1)
          setCount(1);
      }, [newCommentRefresh])
  
      useEffect(() => {
        loadPost();
      }, [count])
    
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

      const handleLike = async (id, likesNum, commentid) => {
        const type = "like";
        setNoClick(true);
        if(commentid) {
          await updateCommentLikes(page, id, commentid, likesNum, type);
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
          await updateCommentLikes(page, id, commentid, likesNum, type);
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
        setRefreshComments(!newCommentRefresh);
      }

      const handleCommentData = async () => {
        const postRef = doc(db, `${page}Posts`, id);
        const commentsCollectionRef = collection(postRef, "comments");

        // Retrieve comments for the post
        const querySnapshot = await getDocs(commentsCollectionRef);

        // Add the comment id into the commentData state.
        const comments = querySnapshot.docs.map((doc) => 
        ({
          ...doc.data(),
          commentid: doc.id
        }));
        setCommentData(comments);
      }

      const handleLocalizedCommentLike = () => {

      }

      const handleLocalizedNewComment = () => {

      }

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
    
      return (
        <div>
          {post ? (
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
              <button onClick={handleGoBack}>Go Back</button>
              {user ? 
                <div className="post comment-area">
                    <textarea
                      className={`comment-textarea ${!user ? "disabled" : ""}`}
                      placeholder="Write your comment..."
                      onChange={(e) => handleCommentChange(e.target.value)}
                      value={comment}
                    ></textarea>
                    <button onClick={() => handleAddComment(page, id, comment)}>Add Comment</button>
                    {commentData ? "" : <div onClick={handleCommentData}>Comments...</div>}
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
                          <button>Edit Comment</button>
                          <button>Delete Comment</button>
                        </div>
                    )) : ""}
                </div>
              : 
              <div className="post non-user">
                {commentData ? "" : <div onClick={handleCommentData}>Comments...</div>}
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
            <p>Loading post...</p>
          )}
        </div>
      );

}

export default DisplayPost;
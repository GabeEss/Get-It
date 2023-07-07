import React, { useState, useEffect } from "react";
import { auth, db } from "../../../firebase";
import { doc, getDoc, getDocs, collection, serverTimestamp } from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import { addComment, updateCommentLikes, updateLikes } from "../../../logic/post";
import { onAuthStateChanged } from "firebase/auth";


const DisplayPost = () => {
    const [post, setPost] = useState(null);
    const [commentData, setCommentData] = useState(null);
    const [comment, setComment] = useState("");
    const [likeChange, setLikeChange] = useState(false); // So the display re-renders on like/dislike
    const [noClick, setNoClick] = useState(false); // When true, the disabled class is applied to like/dislike
    const { page, id } = useParams(); // get the page and post id from the url
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

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

    useEffect(() => {
        const fetchPost = async () => {
          try {
            const postRef = doc(db, `${page}Posts`, id);
            const docSnap = await getDoc(postRef);
            if (docSnap.exists()) {
              await setPost({ id: docSnap.id, ...docSnap.data() });
              handleCommentData();
            } else {
              console.log("No such post exists!");
            }
          } catch (error) {
            console.error("Error fetching post: ", error);
          }
        };
    
        fetchPost();
      }, [page, id, likeChange]);
    
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

      const handleLike = async (id, likesNum) => {
        setNoClick(true);
        await updateLikes(page, id, likesNum, "like");
        setLikeChange(!likeChange);
        setNoClick(false);
      };
    
      const handleDislike = async (id, likesNum) => {
        setNoClick(true);
        await updateLikes(page, id, likesNum, "dislike");
        setLikeChange(!likeChange);
        setNoClick(false);
      };

      const handleCommentChange = (str) => {
        setComment(str);
      }

      const handleAddComment = async (page, id, content) => {
        const time = serverTimestamp();
        await addComment(page, id, content, time);
        setComment("");
      }

      const handleCommentData = async () => {
        const postRef = doc(db, `${page}Posts`, id);
        const commentsCollectionRef = collection(postRef, "comments");

        // Retrieve comments for the post
        const querySnapshot = await getDocs(commentsCollectionRef);
        const comments = querySnapshot.docs.map((doc) => doc.data());
        setCommentData(comments);
      }

    
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
              <div className="post comment-area">
                  <textarea
                    className={`comment-textarea ${!user ? "disabled" : ""}`}
                    placeholder="Write your comment..."
                    onChange={(e) => handleCommentChange(e.target.value)}
                    value={comment}
                  ></textarea>
                  <button onClick={() => handleAddComment(page, id, comment)}>Add Comment</button>
                  {commentData ? commentData.map((comment, index) => (
                      <div key={index} className="post comment-content">
                        <h6>Posted by: {comment.nickname} at {formatTime(comment.time)}</h6>
                        {comment.content}
                        <button
                          className={`likebutton ${noClick ? "disabled" : !user ? "disabled" : ""}`}
                          onClick={() => {
                              // handleLike(id, comment.likes);
                          }}>Like</button>
                          {comment.likes}
                          <button
                          className={`dislikebutton ${noClick ? "disabled" : !user ? "disabled" : ""}`}
                          onClick={() => {
                              // handleDislike(id, comment.likes);
                          }}>Dislike</button>
                      </div>
                  )) : ""}
              </div>
            </div>
          ) : (
            <p>Loading post...</p>
          )}
        </div>
      );

}

export default DisplayPost;
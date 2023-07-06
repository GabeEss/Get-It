import React, { useState, useEffect } from "react";
import { db } from "../../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import { addComment, updateCommentLikes, updateLikes } from "../../../logic/post";


const DisplayPost = () => {
    const [post, setPost] = useState(null);
    const [likeChange, setLikeChange] = useState(false); // So the display re-renders on like/dislike
    const [noClick, setNoClick] = useState(false); // When true, disabled class is applied to like/dislike
    const { page, id } = useParams();
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(`/${page}`);
    };

    useEffect(() => {
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
                className={`likebutton ${noClick ? "disabled" : ""}`}
                onClick={() => {
                    handleLike(id, post.likes);
                }}>Like</button>
                {post.likes}
                <button
                className={`dislikebutton ${noClick ? "disabled" : ""}`}
                onClick={() => {
                    handleDislike(id, post.likes);
                }}>Dislike</button>
                </p>
              <button onClick={handleGoBack}>Go Back</button>
            </div>
          ) : (
            <p>Loading post...</p>
          )}
        </div>
      );

}

export default DisplayPost;
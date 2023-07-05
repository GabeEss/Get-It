import React, {useState, useEffect} from "react";
import { db } from "../../../firebase";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';
import { updateLikes } from "../../../logic/post";

const DisplayPosts = ({page}) => {
    const [posts, setPosts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
          try {
            const querySnapshot = await getDocs(collection(db, `${page}Posts`));
            const postData = querySnapshot.docs.map((doc) => ({
              ...doc.data(),
              id: doc.id,
            }));
            setPosts(postData);
          } catch (error) {
            console.error("Error fetching posts: ", error);
          }
        };
    
        fetchData();
      }, [page]);

      const formatTime = ({seconds}) => {
        if (typeof seconds !== "number" || isNaN(seconds)) {
          return "Invalid Date";
        }
      
        // Convert seconds to milliseconds
        const milliseconds = seconds * 1000;
      
        // Create a JavaScript Date object from milliseconds
        const dateObj = new Date(milliseconds);
      
        // Format the date object with the desired display format
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
   
    const handleClick = (title, id) => {
        navigate(`/${page}/${title}/${id}`);
    }
    
    const handleLike = () => {

    }

    const handleDislike = () => {

    }

    return(
        <div>
            {posts.length === 0 ? (
                <p>No posts available</p>
                ) : (
                    <ol className="post-list">
                    {posts.map((postItem) => (
                        <li className="post-item" key={postItem.id} 
                        onClick={() => handleClick(postItem.title, postItem.id)}>
                            <h3 className="post post-title">{postItem.title}</h3>
                            <p className="post post-name">Original poster: {postItem.nickname}</p>
                            <p className="post post-time">
                                Time of post in UTC: {formatTime(postItem.time)}
                            </p>
                            <p className="post post-likes">
                                <button className="likebutton" onClick={handleLike}>Like</button>
                                {postItem.likes}
                                <button className="dislikebutton" onClick={handleDislike}>Dislike</button>
                            </p>
                            <p className="post post-content">{postItem.content}</p>
                        </li>
                    ))}
                    </ol>
            )}
        </div>
    )
}

export default DisplayPosts;
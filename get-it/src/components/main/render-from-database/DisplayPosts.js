import React, {useState, useEffect} from "react";
import { db } from "../../../firebase";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';
import { updateLikes } from "../../../logic/post";

const DisplayPosts = ({page}) => {
    const [posts, setPosts] = useState([]);
    const [likeChange, setLikeChange] = useState(false);
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
      }, [page, likeChange]);

      const formatTime = ({seconds}) => {
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
   
    const handleClick = (title, id) => {
        navigate(`/${page}/${title}/${id}`);
    }

    // Need to make it so that if a user has liked a post and they click the like button,
    // they will unlike the post and push the like number down by 1.
    // If the user clicks the dislike button from the like button,
    // this should push the like number down by 2 and vice versa.
    // This logic will need to be worked out before going into the updateLikes function.
    // Will need to change the logic in post.js because right now, clicking on like/dislike
    // will change whether the user has liked the post to true/false. It might be
    // good to remove the post from the users likes if they unlike/undislike something.
    // If they like/dislike something it should be added to the collection where dislike
    // should make the liked value false and like should make the like value true. So
    // I can probably pass the the like value into the updateLikes function.


    const handleLike = (id, likesNum) => {
        updateLikes(page, id, likesNum, "like");
        setLikeChange(!likeChange);
      };
    
      const handleDislike = (id, likesNum) => {
        updateLikes(page, id, likesNum, "dislike");
        setLikeChange(!likeChange);
      };

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
                                <button className="likebutton" 
                                onClick={(e) => {
                                    e.stopPropagation(); // prevents accidentally navigating to the post page
                                    handleLike(postItem.id, postItem.likes);
                                }}>Like</button>
                                {postItem.likes}
                                <button className="dislikebutton"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDislike(postItem.id, postItem.likes);
                                }}>Dislike</button>
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
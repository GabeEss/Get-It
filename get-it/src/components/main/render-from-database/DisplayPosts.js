import React, {useState, useEffect, useCallback} from "react";
import { auth, db } from "../../../firebase";
import { collection, getDocs, query, limit, startAfter } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';
import { updateLikes } from "../../../logic/post";
import { onAuthStateChanged } from "firebase/auth";

const DisplayPosts = ({page, refreshPosts}) => {
    const [posts, setPosts] = useState([]);
    const [likeChange, setLikeChange] = useState(false);
    const [noClick, setNoClick] = useState(false); // When true, disabled class is applied to like/dislike
    const [lastPost, setLastPost] = useState(null); // Track the last post retrieved
    const [isLoading, setIsLoading] = useState(false); // Track loading state
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


    const loadPosts = useCallback(async () => {
      try {
        setIsLoading(true);
  
        // Construct the Firestore query for pagination
        let postsQuery = query(collection(db, `${page}Posts`));
  
        // If lastPost exists, set the query to start after it
        if (lastPost) {
          postsQuery = query(postsQuery, startAfter(lastPost));
        }
  
        // Limit the number of posts retrieved per page
        postsQuery = query(postsQuery, limit(10));
  
        const querySnapshot = await getDocs(postsQuery);
        const postData = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
  
        // Set the last post for pagination
        const lastVisiblePost = querySnapshot.docs[querySnapshot.docs.length - 1];
        setLastPost(lastVisiblePost);
  
        // Append or replace the posts based on the pagination
        if (lastPost) {
          setPosts((prevPosts) => [...prevPosts, ...postData]);
        } else {
          setPosts(postData);
        }
  
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching posts: ", error);
      }
    }, [lastPost, page]);


    // const loadPosts = () => {
    //   const fetchData = async () => {
    //     try {
    //       const querySnapshot = await getDocs(collection(db, `${page}Posts`));
    //       const postData = querySnapshot.docs.map((doc) => ({
    //         ...doc.data(),
    //         id: doc.id,
    //       }));
    //       setPosts(postData);
    //     } catch (error) {
    //       console.error("Error fetching posts: ", error);
    //     }
    //   };
  
    //   fetchData();
    // }

    // useEffect(() => {
    //     console.log("The posts displayed on this page have been refreshed.");
    //     // loadPosts();
    //   }, [page, likeChange, refreshPosts]);

      // Load initial posts
      useEffect(() => {
        loadPosts();
      }, [loadPosts]);

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

    const handleLike = async (id, likesNum) => {
        const type = "like";
        setNoClick(true);
        await updateLikes(page, id, likesNum, type);
        setLikeChange(!likeChange);
        setNoClick(false);
      };
    
      const handleDislike = async (id, likesNum) => {
        const type = "dislike";
        setNoClick(true);
        await updateLikes(page, id, likesNum, type);
        setLikeChange(!likeChange);
        setNoClick(false);
      };

    return(
        <div>
            {isLoading ? 
              <p>Loading...</p>
            : posts.length === 0 ? (
                <p>Be the first to write a post...</p>
                ) : (
                    <ol className="post-list">
                    {posts.map((postItem) => (
                        <li className="post-item" key={postItem.id}>
                            <h3 className="post post-title"
                            onClick={() => handleClick(postItem.title, postItem.id)}
                            >{postItem.title}</h3>
                            <h5 className="post post-name">Original poster: {postItem.nickname}</h5>
                            <h5 className="post post-time">
                                Time of post in UTC: {formatTime(postItem.time)}
                            </h5>
                            <p className="post post-content">{postItem.content}</p>
                            <p className="post post-likes">
                                <button className={`likebutton ${noClick ? "disabled" : !user ? "disabled" : ""}`}
                                onClick={() => {
                                    handleLike(postItem.id, postItem.likes);
                                }}>Like</button>
                                {postItem.likes}
                                <button className={`dislikebutton ${noClick ? "disabled" : !user ? "disabled" : ""}`}
                                onClick={() => {
                                    handleDislike(postItem.id, postItem.likes);
                                }}>Dislike</button>
                            </p>
                        </li>
                    ))}
                    </ol>
            )}
        </div>
    )
}

export default DisplayPosts;
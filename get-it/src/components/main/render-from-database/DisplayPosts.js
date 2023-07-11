import React, {useState, useEffect, useContext, useCallback} from "react";
import { auth, db } from "../../../firebase";
import { collection, getDoc, getDocs, doc, query, limit, startAfter } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';
import { updateLikes } from "../../../logic/post";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const DisplayPosts = ({page, refreshPosts}) => {
    const [posts, setPosts] = useState([]);
    const [count, setCount] = useState(0); // This state helps control the number of times firebase is called on load.
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



    // const loadPosts = useCallback(async () => {
    //   try {
    //     setIsLoading(true);
  
    //     // Construct the Firestore query for pagination
    //     let postsQuery = query(collection(db, `${page}Posts`));
  
    //     // If lastPost exists, set the query to start after it
    //     if (lastPost) {
    //       postsQuery = query(postsQuery, startAfter(lastPost));
    //     }
  
    //     // Limit the number of posts retrieved per page
    //     postsQuery = query(postsQuery, limit(10));
  
    //     const querySnapshot = await getDocs(postsQuery);
    //     const postData = querySnapshot.docs.map((doc) => ({
    //       ...doc.data(),
    //       id: doc.id,
    //     }));
  
    //     // Set the last post for pagination
    //     const lastVisiblePost = querySnapshot.docs[querySnapshot.docs.length - 1];
    //     setLastPost(lastVisiblePost);
  
    //     // Append or replace the posts based on the pagination
    //     if (lastPost) {
    //       setPosts((prevPosts) => [...prevPosts, ...postData]);
    //     } else {
    //       setPosts(postData);
    //     }
  
    //     setIsLoading(false);
    //   } catch (error) {
    //     console.error("Error fetching posts: ", error);
    //   }
    // }, [lastPost, page]);


    const loadPosts = async () => {
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
      
      if(count === 1) {
        console.log("Firebase called.");
        await fetchData();
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
    }, [refreshPosts])

    useEffect(() => {
      loadPosts();
    }, [count])

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

        const prevExistingLike = await updateLikes(page, id, likesNum, type);

        // Update the local display without calling firestore.
        if(prevExistingLike) {
          handleLocalizedUpdateLike(id, likesNum, type, prevExistingLike);
        } else handleLocalizedNewLike(id, likesNum, type);
        
        setNoClick(false);
      };
    
      const handleDislike = async (id, likesNum) => {
        const type = "dislike";

        setNoClick(true);

        const prevExistingLike = await updateLikes(page, id, likesNum, type);

        // Update the local display without calling firestore.
        if(prevExistingLike) {
          handleLocalizedUpdateLike(id, likesNum, type, prevExistingLike);
        } else handleLocalizedNewLike(id, likesNum, type);

        setNoClick(false);
      };

      const handleLocalizedUpdateLike = (id, likesNum, type, prevExistingLike) => {
          const updatedPosts = posts.map((postItem) => {
            // Does post match the post that needs to be changed.
            if (postItem.id === id) {
                // Did the user click the like or dislike button.
                if(type === "like") {
                  // Was the user's previous choice a like or dislike.
                  if(prevExistingLike === "like") {
                    // Liking a former like
                    return {
                      ...postItem,
                      likes: likesNum - 1,
                    };
                    // Liking a former dislike
                  } else {
                    return {
                      ...postItem,
                      likes: likesNum + 2,
                    };
                  }
              } else {
                // Disliking a former like
                if(prevExistingLike === "like") {
                  return {
                    ...postItem,
                    likes: likesNum - 2,
                  };
                // Disliking a former dislike
                } else {
                  return {
                    ...postItem,
                    likes: likesNum + 1,
                  };
                }
              }
            }
            // If no post found, return the previous item unaltered.
            return postItem;
          });

          setPosts(updatedPosts);
      }

      const handleLocalizedNewLike = (id, likesNum, type) => {
        const updatedPosts = posts.map((postItem) => {
          if (postItem.id === id) {
            if(type === "like") {
              // New like
                return {
                  ...postItem,
                  likes: likesNum + 1,
              };
              // New dislike
            } else {
              return {
                ...postItem,
                likes: likesNum - 1,
              };
            }
          }
          // If no post found, return the previous item unaltered.
          return postItem;
        });
        setPosts(updatedPosts);
      }

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
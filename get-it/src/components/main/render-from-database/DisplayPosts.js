import React, {useState, useEffect, useContext} from "react";
import { useNavigate } from 'react-router-dom';
import { updateLikes, deletePost, fetchPostsFromCurrentPage } from "../../../logic/post";
import { EditContext } from "../../../contexts/EditPostContext";
import { CurrentPageContext } from "../../../contexts/CurrentPageContext";
import { RefreshPostsContext } from "../../../contexts/RefreshPostsContext";
import { UserContext } from "../../../contexts/UserContext";
import { SearchContext } from "../../../contexts/SearchContext";

const DisplayPosts = () => {
    const [posts, setPosts] = useState([]);
    const [count, setCount] = useState(0); // This state helps control the number of times firebase is called on load.
    const [noClick, setNoClick] = useState(false); // When true, disabled class is applied to like/dislike
    const [isLoading, setIsLoading] = useState(false); // Track loading state
    const [sortOption, setSortOption] = useState("new"); // Track sorting state
    const navigate = useNavigate();
    const {user} = useContext(UserContext);
    const {setEdit} = useContext(EditContext); // Controls the edit form pop up
    const {currentPage} = useContext(CurrentPageContext);
    const {refreshPosts, setRefresh} = useContext(RefreshPostsContext);
    const {search, setSearchTerm} = useContext(SearchContext);

    const loadPosts = async () => {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          // Get the post data from firestore
          const postData = await fetchPostsFromCurrentPage(sortOption, currentPage);

          // If search exists, filter the postData.
          const filteredPosts = search ? postData.filter((post) =>
            post.title.toLowerCase().includes(search.toLowerCase())
          ) : postData;

          setPosts(filteredPosts);
        } catch (error) {
             console.error("Error fetching posts: ", error);
        } finally {
          setIsLoading(false);
        }
      };
      
      if(count === 1) {
        console.log("Firebase called.");
        await fetchData();
        setIsLoading(false);
        setCount(0);
      }
    }

    // On initial load, control the number of times firebase is called by altering setCount.
    useEffect(() => {
      if(count !== 1)
        setCount(1);
    }, []);

    // Refreshes the posts when a post is edited, created, or deleted.
    useEffect(() => {
      if(count !== 1)
        setCount(1);
    }, [refreshPosts])

    // Refreshes the posts when one of the sort buttons is clicked.
    useEffect(() => {
      if(count !== 1)
        setCount(1);
    }, [sortOption])

    // Refreshes the posts when the search button is clicked.
    useEffect(() => {
      if (count !== 1) {
        setCount(1);
      }
    }, [search]);

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
        navigate(`/${currentPage}/${title}/${id}`);
        setSearchTerm("");
    }

    const handleLike = async (id, likesNum) => {
        const type = "like";

        setNoClick(true);

        const prevExistingLike = await updateLikes(currentPage, id, likesNum, type);

        // Update the local display without calling firestore.
        if(prevExistingLike) {
          handleLocalizedUpdateLike(id, likesNum, type, prevExistingLike);
        } else handleLocalizedNewLike(id, likesNum, type);
        
        setNoClick(false);
      };
    
      const handleDislike = async (id, likesNum) => {
        const type = "dislike";

        setNoClick(true);

        const prevExistingLike = await updateLikes(currentPage, id, likesNum, type);

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

      const handleEdit = (id) => {
        setEdit(id);
      }

      const handleDelete = async (id) => {
        const confirmation = window.confirm("Are you sure you want to delete?");
        if (confirmation) {
          await deletePost(currentPage, id);
          setRefresh(!refreshPosts);
        }
      }

    return(
        <div>
            {isLoading ? 
              <p>Loading...</p>
            : posts.length === 0 ? (
                <p>Be the first to write a post...</p>
                ) : (
                <div>
                    <div className="sort buttons">
                      <button onClick={() => setSortOption("top")}>Top</button>
                      <button onClick={() => setSortOption("new")}>New</button>
                      <button onClick={() => setSortOption("old")}>Old</button>
                    </div>
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
                            {<p className="post post-content">{postItem.content}</p>}
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
                            {user && user.email === postItem.owner ? 
                                <div className="post post-owner">
                                <button className={`editbutton ${user.email === postItem.owner ? "" : "disabled"}`}
                                onClick={() => handleEdit(postItem.id)}>Edit</button>
                                <button className={`deletebutton ${user.email === postItem.owner ? "" : "disabled"}`}
                                onClick={() => handleDelete(postItem.id)}>Delete</button>
                              </div>
                            : ""}
                        </li>
                    ))}
                    </ol>
                  </div>
            )}
        </div>
    )
}

export default DisplayPosts;
import React, {useState, useEffect} from "react";
import { db } from "../../../firebase";
import { collection, getDocs } from "firebase/firestore";

const DisplayPosts = ({page}) => {
    const [posts, setPosts] = useState([]);

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

    return(
        <div>
            {posts.length === 0 ? (
                <p>No posts available</p>
                ) : (
                    <ol className="post-list">
                    {posts.map((postItem, index) => (
                        <li className="post-item" key={postItem.id}>
                        <h3 className="post-title">{postItem.title}</h3>
                        <p className="post-owner">Original poster: {postItem.owner}</p>
                        <p className="post-time">Time of post: {postItem.time}</p>
                        <p className="post-content">{postItem.content}</p>
                        </li>
                    ))}
                    </ol>
            )}
        </div>
    )
}

export default DisplayPosts;
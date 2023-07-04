import React, {useState, useEffect} from "react";
import { createPost, addComment, updateCommentLikes, updateLikes } from "../../../logic/post";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../../firebase.js";
import { collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore";

const BusinessDB = () => {
    const page = "business";
    const [newPost, setPost] = useState(false);
    const [posts, setPosts] = useState("");
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          setIsAuthenticated(user !== null);
        });
    
        return () => unsubscribe();
    }, []);

    const handleNewPostClick = () => {
        setPost(true);
    }

    const onClose = () => {
        setTitle("");
        setContent("");
        setPost(false);
    }

    const handleTitleChange = (event) => {
        setTitle(event.target.value);
    };

    const handleContentChange = (event) => {
        setContent(event.target.value);
    };

    const handleCreatePost = () => {
        const time = serverTimestamp();
        createPost(title, content, page, time);
    }

    const newPostForm = () => {
        return(
            <div className="newpost popup">
                <h2>New Post</h2>
                <form onSubmit={handleCreatePost}>
                    <input
                    type="text"
                    value={title}
                    onChange={handleTitleChange}
                    placeholder="Title..."
                    maxLength={200}
                    required
                    className="login-field"
                    />
                    <input
                    type="textarea"
                    value={content}
                    onChange={handleContentChange}
                    placeholder="Content..."
                    maxLength={1000}
                    required
                    className="login-field"
                    />
                    <button type="submit" className="submit-button">Submit</button>
                    <button onClick={onClose}>Close</button>
                </form>
            </div>
        )
    }

    const displayPosts = async () => {
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
        return(
            <div>
                <ol className="post-list">
                  {posts.map((postItem, index) => (
                    <li className="post-item" key={postItem.id}>
                      <h3 className="post-title">{postItem.title}</h3>
                      <p className="post-time">Time: {postItem.time}</p>
                      <p className="post-content">{postItem.content}</p>
                    </li>
                  ))}
                </ol>
            </div>
        )
    }

    return(
        <div>
            {isAuthenticated ? <button onClick={handleNewPostClick}>New Post</button> : null}
            {newPost ? newPostForm() : null}
            <div className="posts-container">
                {displayPosts()}
            </div>
        </div>
    )
}

export default BusinessDB;
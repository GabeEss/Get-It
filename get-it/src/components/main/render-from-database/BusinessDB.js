import React, {useState, useEffect} from "react";
import { createPost, addComment, updateCommentLikes, updateLikes } from "../../../logic/post";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase.js";

const BusinessDB = () => {
    const page = "business";
    const [newPost, setPost] = useState(false);
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
        setPost(false);
    }

    const handleTitleChange = (event) => {
        setTitle(event.target.value);
    };

    const handleContentChange = (event) => {
        setContent(event.target.value);
    };

    const handleCreatePost = () => {
        createPost(title, content, page);
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

    const displayPosts = () => {
        return(
            <div></div>
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
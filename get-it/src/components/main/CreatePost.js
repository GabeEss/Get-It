import React, {useState, useEffect, useContext} from "react";
import { createPost } from "../../logic/post";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { auth } from "../../firebase";
import { serverTimestamp } from "firebase/firestore";
import { CurrentPageContext } from "../../contexts/CurrentPageContext";
import DisplayPosts from "./render-from-database/DisplayPosts";

// When making a new page, you only need to change the function name and the page variable.
const CreatePost = () => {
    const {currentPage} = useContext(CurrentPageContext);
    const [newPost, setPost] = useState(false);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [refreshPosts, setRefresh] = useState(false);
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

    const handleCreatePost = async () => {
        const auth = getAuth();
        const user = auth.currentUser;
        const owner = user.email;
        const nickname = user.displayName;
        const time = serverTimestamp();
        
        if(user) {
            // This will add the post to a collection of all posts related to this page.
            const postID = await createPost(owner, title, content, currentPage, time, nickname);
            setRefresh(!refreshPosts);
        }
        onClose();
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

    return(
        <div>
            {isAuthenticated ? <button onClick={handleNewPostClick}>New Post</button> : null}
            {newPost ? newPostForm() : null}
            <DisplayPosts page={currentPage} refreshPosts={refreshPosts}/>
        </div>
    )
}

export default CreatePost;
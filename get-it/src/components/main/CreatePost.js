import React, {useState, useEffect, useContext} from "react";
import { createPost } from "../../logic/post";
import { getAuth } from "firebase/auth";
import { serverTimestamp } from "firebase/firestore";
import { CurrentPageContext } from "../../contexts/CurrentPageContext";
import { RefreshPostsContext } from "../../contexts/RefreshPostsContext";
import { CreatePostContext } from "../../contexts/CreatePostContext";

// When making a new page, you only need to change the function name and the page variable.
const CreatePost = () => {
    const {currentPage} = useContext(CurrentPageContext);
    const {refreshPosts, setRefresh} = useContext(RefreshPostsContext);
    const {newPost, setNewPost} = useContext(CreatePostContext);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    
    const onClose = () => {
        setTitle("");
        setContent("");
        setNewPost(false);
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
            await createPost(owner, title, content, currentPage, time, nickname);
            setRefresh(!refreshPosts);
        }
        onClose();
    }

    const newPostForm = () => {
        return(
            <div className="popup-container">
                <h2>New Post</h2>
                <form onSubmit={handleCreatePost}>
                    <input
                    type="text"
                    value={title}
                    onChange={handleTitleChange}
                    placeholder="Title..."
                    maxLength={50}
                    required
                    className="login-field"
                    />
                    <input
                    type="textarea"
                    value={content}
                    onChange={handleContentChange}
                    placeholder="Content..."
                    maxLength={200}
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
            {newPost ? newPostForm() : null}
        </div>
    )
}

export default CreatePost;
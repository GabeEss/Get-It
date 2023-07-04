import React, {useState, useEffect} from "react";
import { createPost, addComment, updateCommentLikes, updateLikes } from "../../../logic/post";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { db, auth } from "../../../firebase";
import { collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import DisplayPosts from "./DisplayPosts";

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
        const time = serverTimestamp();
        
        if(user) {
            const postID = await createPost(owner, title, content, page, time);
            // Create a reference to the user's subcollection
            const userPostsRef = collection(db, "users", owner, "posts");
            // Add the post to the user's subcollection
            await addDoc(userPostsRef, { postID });
        }
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
            <DisplayPosts page={page}/>
        </div>
    )
}

export default BusinessDB;
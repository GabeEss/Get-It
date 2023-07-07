import React, {useState, useEffect} from "react";
import { createPost, updateLikes } from "../../../logic/post";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { db, auth } from "../../../firebase";
import { collection, getDoc, doc, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import DisplayPosts from "./DisplayPosts";

const BusinessDB = () => {
    const page = "business";
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
        setRefresh(!refreshPosts);
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
            const postID = await createPost(owner, title, content, page, time, nickname);

            const post = {
                title: title,
                content: content,
                page: page,
                time: time,
                nickname: nickname,
                postID: postID
            };

            // Create a reference to the user's subcollection
            const userPostsRef = collection(db, "users", owner, "posts");
        
            // Add the post to the user's subcollection, so they have a history of posts they make
            await addDoc(userPostsRef, { post });
            
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
            <DisplayPosts page={page} refreshPosts={refreshPosts}/>
        </div>
    )
}

export default BusinessDB;
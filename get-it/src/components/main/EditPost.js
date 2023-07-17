import React, {useState, useContext} from "react";
import { EditContext } from "../../contexts/EditPostContext";
import { CurrentPageContext } from "../../contexts/CurrentPageContext";
import { RefreshPostsContext } from "../../contexts/RefreshPostsContext";
import { editPost } from "../../logic/post";
import { editComment } from "../../logic/comment";

const EditPost = () => {
    // If this form is open, the value within the edit prop should be the postId
    const {edit, setEdit} = useContext(EditContext); 
    const {currentPage} = useContext(CurrentPageContext);
    const {refreshPosts, setRefresh} = useContext(RefreshPostsContext);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const onClose = () => {
        setTitle("");
        setContent("");
        setEdit(null);
    }

    const handleTitleChange = (event) => {
        setTitle(event.target.value);
    };

    const handleContentChange = (event) => {
        setContent(event.target.value);
    };

    async function handleEditPost() {
        console.log(currentPage);
        if(edit) { 
            await editPost(currentPage, edit, title, content);
            setRefresh(!refreshPosts);
            onClose();
        }
    }

    return (
        <div className="editpost popup">
            <h2>Edit Post</h2>
            <form onSubmit={handleEditPost}>
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
      );
}

const EditComment = () => {
    // If this form is open, the value within the edit prop should be the commentId
    const {edit, setEdit} = useContext(EditContext); 

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const onClose = () => {
        setTitle("");
        setContent("");
        setEdit(null);
    }

    const handleTitleChange = (event) => {
        setTitle(event.target.value);
    };

    const handleContentChange = (event) => {
        setContent(event.target.value);
    };

    const handleEditComment = async () => {
        if(edit) { 
            
            onClose();
        }
    }

    return (
        <div className="editpost popup">
            <h2>Edit Comment</h2>
            <form onSubmit={handleEditComment}>
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
      );
}

export { EditPost, EditComment };
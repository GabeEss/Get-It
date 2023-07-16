import React, {useState, useContext} from "react";
import { EditContext } from "../../contexts/EditPostContext";
import { useParams } from "react-router-dom";

const EditPost = () => {
    // If this form is open, the value within the edit prop should be the postId
    const {edit, setEdit} = useContext(EditContext); 
    // Get the page from the url
    const {page} = useParams();
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

    const handleEditPost = () => {
        
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
    const {edit} = useContext(EditContext); 
    // Get the page and postId from the url
    const {page, id} = useParams();
}

export { EditPost, EditComment };
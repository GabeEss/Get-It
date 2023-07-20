import React, {useState, useContext} from "react";
import { EditDisplayNameContext } from "../../contexts/EditDisplayNameContext";
import { changeUserDisplayName } from "../../logic/user";

const EditDisplayName = () => {
    const [name, setName] = useState("");
    const {setDisplayName} = useContext(EditDisplayNameContext);

    const handleEditDisplayName = async () => {
        await changeUserDisplayName(name);
        onClose();
    }

    const handleNameChange = (e) => {
        setName(e.target.value);
    }

    const onClose = () => {
        setDisplayName(false);
    }

    return(
        <div className="editdisplayname popup">
            <h2>Edit Post</h2>
            <form onSubmit={handleEditDisplayName}>
                <input
                type="text"
                value={name}
                onChange={handleNameChange}
                placeholder="Title..."
                maxLength={25}
                required
                className="login-field"
                />
                <button type="submit" className="submit-button">Submit</button>
                <button onClick={onClose}>Close</button>
            </form>
        </div>
    )
}

export default EditDisplayName;
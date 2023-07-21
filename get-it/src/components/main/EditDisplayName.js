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
        <div className="popup-container">
            <h2>Edit Display Name</h2>
            <form onSubmit={handleEditDisplayName}>
                <input
                type="text"
                value={name}
                onChange={handleNameChange}
                placeholder="Display name..."
                maxLength={25}
                required
                className="login-field"
                />
                <p>
                    Changing your display name will not change the name associated with previous posts.
                </p>
                <button type="submit" className="submit-button">Submit</button>
                <button onClick={onClose}>Close</button>
            </form>
        </div>
    )
}

export default EditDisplayName;
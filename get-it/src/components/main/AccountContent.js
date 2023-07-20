import React, {useEffect, useContext} from "react";
import { useNavigate } from 'react-router-dom';
import { auth } from "../../firebase";
import { UserContext } from "../../contexts/UserContext";
import { ResetPasswordContext } from "../../contexts/ResetPasswordContext.js";
import { EditDisplayNameContext } from "../../contexts/EditDisplayNameContext";
import { onAuthStateChanged } from "firebase/auth";

const AccountContent = () => {
    const navigate = useNavigate();
    const {user, setUser} = useContext(UserContext);
    const {setReset} = useContext(ResetPasswordContext);
    const {setDisplayName} = useContext(EditDisplayNameContext);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is signed in
            setUser(user);
        } else {
            // User is signed out
            setUser(null);
        }
        });

        // Clean up the listener on unmount
        return () => {
            unsubscribe();
        };
    }, []);

    const handleGoHome = () => {
        navigate("/");
    }

    const handleEditDisplay = () => {
        setDisplayName(true);
    }

    const handleChangePassword = () => {
        setReset(true);
    }

    const handleDelete = () => {

    }

    const handleLightDark = () => {

    }

    return(
        <div>
            {user ? 
                <div className="account-container">
                    <div className="user-info">
                        <h2>Account Information</h2>
                        <div className="account-info">
                            <div>Display Name: {`${user.displayName}`}</div>
                            <div>Email: {`${user.email}`}</div>
                        </div>
                    </div>
                    <div className="account-options">
                        <h2>Account Options</h2>
                        <div className="account-buttons">
                            <button onClick={handleLightDark}>Change to Light/Dark Mode UI</button>
                            <button onClick={handleEditDisplay}>Edit Display Name</button>
                            <button onClick={handleChangePassword}>Change Password</button>
                            <button onClick={handleDelete}>Delete Account</button>
                        </div>
                    </div>
                    <button onClick={handleGoHome}>Back to home...</button>
                </div>
            : <button onClick={handleGoHome}>Back to home...</button>}
        </div>
    )
}

export default AccountContent;
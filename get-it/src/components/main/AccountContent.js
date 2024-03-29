import "../../css/AccountContent.css";
import React, {useEffect, useContext} from "react";
import { useNavigate } from 'react-router-dom';
import { auth } from "../../firebase";
import { UserContext } from "../../contexts/UserContext";
import { ResetPasswordContext } from "../../contexts/ResetPasswordContext.js";
import { EditDisplayNameContext } from "../../contexts/EditDisplayNameContext";
import { LightDarkContext } from "../../contexts/LightDarkContext";
import { onAuthStateChanged } from "firebase/auth";
import { deleteUserOperation } from "../../logic/user";

const AccountContent = () => {
    const navigate = useNavigate();
    const {user, setUser} = useContext(UserContext);
    const {setReset} = useContext(ResetPasswordContext);
    const {setDisplayName} = useContext(EditDisplayNameContext);
    const {lightDark, setLightDark} = useContext(LightDarkContext);

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

    const handleDelete = async () => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete your account? This will retroactively remove your name from all posts and comments."
        )

        if(confirmDelete) {
            await deleteUserOperation();
            handleGoHome();
        }
    }

    const handleLightDark = () => {
        setLightDark(!lightDark);
    }

    return(
        <div>
            {user ? 
                <div className="account-container">
                    <div className="user-info container">
                        <h2>Account Information</h2>
                        <div className="account-info">
                            <div>Display Name: {`${user.displayName}`}</div>
                            <div>Email: {`${user.email}`}</div>
                        </div>
                    </div>
                    <div className="account-options container">
                        <h2>Account Options</h2>
                        <div className="account-buttons">
                            <button onClick={handleLightDark}>Change to Light/Dark Mode UI</button>
                            <button onClick={handleEditDisplay}>Edit Display Name</button>
                            <button onClick={handleChangePassword}>Change Password</button>
                            <button onClick={handleDelete}>Delete Account</button>
                        </div>
                    </div>
                    <div className="backtohome container"><button onClick={handleGoHome}>Back to home...</button></div>
                </div>
            : <button onClick={handleGoHome}>Back to home...</button>}
        </div>
    )
}

export default AccountContent;
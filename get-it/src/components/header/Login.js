import React, {useState, useEffect, useContext} from "react";
import { LoginContext } from "../../contexts/LoginScreenContext";
import { SignUpContext } from "../../contexts/SignUpScreenContext";
import { onAuthStateChanged } from "firebase/auth";
import {auth} from "../../firebase.js";
import SignOut from "../main/SignOutContent";

const Login = () => {
    const {setLogin} = useContext(LoginContext);
    const {setSignUp} = useContext(SignUpContext);
    const [user, setUser] = useState(null);

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

    const handleLoginClick = () => {
        setSignUp(false);
        setLogin(true);
    }

    const handleSignUpClick = () => {
        setLogin(false);
        setSignUp(true);
    }

    return(
        <div className="login-container">
            {!user && (
                <>
                <button id="login" onClick={handleLoginClick}>
                    Log-in
                </button>
                <br />
                <button id="signup" onClick={handleSignUpClick}>
                    Sign-up
                </button>
                </>
            )}
            {user && (
                <>
                <button id="user">User</button>
                <br />
                <SignOut/>
                </>
            )}
        </div>
    )
}

export default Login;
import usericon from "../../assets/images/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpeg";
import React, {useEffect, useContext} from "react";
import { useNavigate } from 'react-router-dom';
import { LoginContext } from "../../contexts/LoginScreenContext";
import { SignUpContext } from "../../contexts/SignUpScreenContext";
import { ResetPasswordContext } from "../../contexts/ResetPasswordContext";
import { UserContext } from "../../contexts/UserContext";
import { LightDarkContext } from "../../contexts/LightDarkContext";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase.js";
import SignOut from "../main/SignOutContent";

const Login = () => {
    const {setLogin} = useContext(LoginContext);
    const {setSignUp} = useContext(SignUpContext);
    const {setReset} = useContext(ResetPasswordContext);
    const {user, setUser} = useContext(UserContext);
    const {lightDark} = useContext(LightDarkContext);
    const navigate = useNavigate();

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
        setReset(false);
        setLogin(true);
    }

    const handleSignUpClick = () => {
        setLogin(false);
        setReset(false);
        setSignUp(true);
    }

    const handleAccountPage = () => {
        setSignUp(false);
        setLogin(false);
        setSignUp(false);
        navigate('/account');
    }

    return(
        <>
        {!lightDark ?
            <div className="login-container">
                {!user && (
                    <>
                    <button id="login" className="light-mode" onClick={handleLoginClick}>
                        Log-in
                    </button>
                    <br />
                    <button id="signup" className="light-mode" onClick={handleSignUpClick}>
                        Sign-up
                    </button>
                    </>
                )}
                {user && (
                    <>
                    <button id="user" className="light-mode" onClick={handleAccountPage}>
                        <img className="usericon" src={usericon} alt="User"></img>
                    </button>
                    <br />
                    <SignOut/>
                    </>
                )}
            </div> : 
            <div className="login-container">
                {!user && (
                    <>
                    <button id="login" className="dark-mode" onClick={handleLoginClick}>
                        Log-in
                    </button>
                    <br />
                    <button id="signup" className="dark-mode" onClick={handleSignUpClick}>
                        Sign-up
                    </button>
                    </>
                )}
                {user && (
                    <>
                    <button id="user" className="dark-mode" onClick={handleAccountPage}>
                        <img className="usericon" src={usericon} alt="User"></img>
                    </button>
                    <br />
                    <SignOut/>
                    </>
                )}
            </div>
        }
        </>
    )
}

export default Login;
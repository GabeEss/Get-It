import React from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();

    const handleLoginClick = () => {
        
    }

    const handleSignUpClick = () => {
        navigate("");
    }

    return(
        <div className="login-container">
            <button id="login" onClick={handleLoginClick}>Log-in</button>
            <br></br>
            <button id="signup">Sign-up</button>
            <br></br>
            <button id="user">User</button>
        </div>
    )
}

export default Login;
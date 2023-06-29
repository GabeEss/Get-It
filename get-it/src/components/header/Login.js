import React, {useContext} from "react";
import { LoginContext } from "../../contexts/LoginScreenContext";
import { SignUpContext } from "../../contexts/SignUpScreenContext";

const Login = () => {
    const {setLogin} = useContext(LoginContext);
    const {setSignUp} = useContext(SignUpContext);

    const handleLoginClick = () => {
        setLogin(true);
    }

    const handleSignUpClick = () => {
        setSignUp(true);
    }

    return(
        <div className="login-container">
            <button id="login" onClick={handleLoginClick}>Log-in</button>
            <br></br>
            <button id="signup" onClick={handleSignUpClick}>Sign-up</button>
            <br></br>
            <button id="user">User</button>
        </div>
    )
}

export default Login;
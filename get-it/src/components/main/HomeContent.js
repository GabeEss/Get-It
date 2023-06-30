import React, {useContext} from "react";
import { LoginContext } from "../../contexts/LoginScreenContext";
import { SignUpContext } from "../../contexts/SignUpScreenContext";
import { ResetPasswordContext } from "../../contexts/ResetPasswordContext";
import SignIn from "./LoginContent";
import SignUp from "./SignUpContent";
import PasswordReset from "./PasswordResetContent";

const HomeContent = () => {
    const {login} = useContext(LoginContext); // if user clicked login, show component
    const {signup} = useContext(SignUpContext); // if user clicked signup, show component
    const {reset} = useContext(ResetPasswordContext); // if user clicked reset password, show component

    return(
        <div className="home-main">
            {login ? (
                <SignIn />
            ) : signup ? (
                <SignUp />
            ) : reset ? (
                <PasswordReset/>
            ) : (<div className="hidden"></div>)}
        </div>
    )
}

export default HomeContent;
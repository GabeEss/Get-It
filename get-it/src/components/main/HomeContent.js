import React, {useContext} from "react";
import { LoginContext } from "../../contexts/LoginScreenContext";
import { SignUpContext } from "../../contexts/SignUpScreenContext";
import SignIn from "./LoginContent";
import SignUp from "./SignUpContent";

const HomeContent = () => {
    const {login} = useContext(LoginContext); // if user clicked login button, show the login component
    const {signup} = useContext(SignUpContext); // if user clicked signup button, show the sign up component

    return(
        <div className="home-main">
            {login ? (
                <SignIn />
            ) : signup ? (
                <SignUp />
            ) : (<div className="hidden"></div>)}
        </div>
    )
}

export default HomeContent;
import React, {useState, useEffect, useContext} from "react";
import { LoginContext } from "../../contexts/LoginScreenContext";
import { SignUpContext } from "../../contexts/SignUpScreenContext";
import { ResetPasswordContext } from "../../contexts/ResetPasswordContext";
import SignIn from "./LoginContent";
import SignUp from "./SignUpContent";
import PasswordReset from "./PasswordResetContent";
import BusinessDB from "./render-from-database/BusinessDB";
import GamingDB from "./render-from-database/GamingDB";
import HomeDB from "./render-from-database/HomeDB";
import TelevisionDB from "./render-from-database/TelevisionDB";
import DisplayPost from "./render-from-database/DisplayPost";

const HomeContent = () => {
    const {login} = useContext(LoginContext); // if user clicked login, show component
    const {signup} = useContext(SignUpContext); // if user clicked signup, show component
    const {reset} = useContext(ResetPasswordContext); // if user clicked reset password, show component
    const [currentPage, setCurrentPage] = useState("home");

    // Sets the current page
    useEffect(() => {
        const getCurrentPage = () => {
            const container = document.querySelector(".homepage");
            if (container) {
                return container.getAttribute("data-page");
            }
            return "home";
            };
        
            const page = getCurrentPage();
            setCurrentPage(page);
      }, []);

    const renderContent = () => {
        switch (currentPage) {
            case "business":
                return <BusinessDB />;
            case "gaming":
                return <GamingDB />;
            case "television":
                return <TelevisionDB />;
            case "post":
                return <DisplayPost/>
            case "home":
                return <HomeDB/>
            default:
                return <HomeDB/>;
        }
    };

    return(
        <div className="home-main">
            <div className="user-entry-container">
                {login ? (
                    <SignIn />
                ) : signup ? (
                    <SignUp />
                ) : reset ? (
                    <PasswordReset/>
                ) : (<div className="hidden"></div>)}
            </div>
            <div className="content-container">
                {renderContent()}
            </div>
        </div>
    )
}

export default HomeContent;
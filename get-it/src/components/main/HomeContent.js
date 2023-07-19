import React, {useEffect, useContext} from "react";
import { LoginContext } from "../../contexts/LoginScreenContext";
import { SignUpContext } from "../../contexts/SignUpScreenContext";
import { ResetPasswordContext } from "../../contexts/ResetPasswordContext";
import { EditContext } from "../../contexts/EditPostContext";
import { CurrentPageContext } from "../../contexts/CurrentPageContext";
import { EditCommentContext } from "../../contexts/EditCommentContext";
import { RecentContext } from "../../contexts/RecentContext";
import SignIn from "./LoginContent";
import SignUp from "./SignUpContent";
import PasswordReset from "./PasswordResetContent";
import { EditPost, EditComment } from "./EditPost";
import HomeDB from "./render-from-database/HomeDB";
import DisplayPost from "./render-from-database/DisplayPost";
import CreatePost from "./CreatePost";

const HomeContent = () => {
    const {login} = useContext(LoginContext); // if user clicked login, show component
    const {signup} = useContext(SignUpContext); // if user clicked signup, show component
    const {reset} = useContext(ResetPasswordContext); // if user clicked reset password, show component
    const {edit} = useContext(EditContext); // if user clicked on the edit post or edit comment button
    const {editComment} = useContext(EditCommentContext);
    const {currentPage, setCurrentPage} = useContext(CurrentPageContext);

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
                return <CreatePost/>
            case "gaming":
                return <CreatePost/>
            case "television":
                return <CreatePost/>
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
                ) : edit ? ( 
                    <EditPost/> 
                ) : editComment ? (
                    <EditComment/>
                ) : (<div className="hidden"></div>)}
            </div>
            <div className="content-container">
                {renderContent()}
            </div>
        </div>
    )
}

export default HomeContent;
import "../../css/HomeContent.css";
import React, {useEffect, useContext} from "react";
import { LoginContext } from "../../contexts/LoginScreenContext";
import { SignUpContext } from "../../contexts/SignUpScreenContext";
import { ResetPasswordContext } from "../../contexts/ResetPasswordContext";
import { EditContext } from "../../contexts/EditPostContext";
import { CurrentPageContext } from "../../contexts/CurrentPageContext";
import { EditCommentContext } from "../../contexts/EditCommentContext";
import { EditDisplayNameContext } from "../../contexts/EditDisplayNameContext";
import { CreatePostContext } from "../../contexts/CreatePostContext";
import { LightDarkContext } from "../../contexts/LightDarkContext.js";
import SignIn from "./LoginContent";
import SignUp from "./SignUpContent";
import PasswordReset from "./PasswordResetContent";
import { EditPost, EditComment } from "./EditPost";
import DisplayPost from "./render-from-database/DisplayPost";
import CreatePost from "./CreatePost";
import DisplayPosts from "./render-from-database/DisplayPosts";
import AccountContent from "./AccountContent";
import EditDisplayName from "./EditDisplayName";

const HomeContent = () => {
    const {login} = useContext(LoginContext); // if user clicked login, show component
    const {signup} = useContext(SignUpContext); // if user clicked signup, show component
    const {reset} = useContext(ResetPasswordContext); // if user clicked reset password, show component
    const {edit} = useContext(EditContext); // if user clicked on the edit post or edit comment button
    const {editComment} = useContext(EditCommentContext);
    const {editDisplayName} = useContext(EditDisplayNameContext);
    const {newPost} = useContext(CreatePostContext);
    const {currentPage, setCurrentPage} = useContext(CurrentPageContext);
    const {lightDark} = useContext(LightDarkContext);

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

    // Render the posts from the different pages.
    const renderContent = () => {
        switch (currentPage) {
            case "business":
                return <DisplayPosts/>
            case "gaming":
                return <DisplayPosts/>
            case "television":
                return <DisplayPosts/>
            case "home":
                return <DisplayPosts/>
            case "post":
                return <DisplayPost/>
            case "account":
                return <AccountContent/>
            default:
                return <CreatePost/>;
        }
    };

    // Conditionally render the popup forms in light or dark mode.
    return(
        <div className="home-main">
            <div className="user-entry-container">
                {login ? (
                     <>
                     {!lightDark ? 
                         <div className="popup light-mode">
                             <SignIn />
                         </div> :
                         <div className="popup dark-mode">
                             <SignIn />
                         </div>
                     }
                     </>
                ) : signup ? (
                    <>
                    {!lightDark ? 
                        <div className="popup light-mode">
                            <SignUp />
                        </div> :
                        <div className="popup dark-mode">
                            <SignUp />
                        </div>
                    }
                    </>
                ) : reset ? (
                    <>
                    {!lightDark ? 
                        <div className="popup light-mode">
                            <PasswordReset />
                        </div> :
                        <div className="popup dark-mode">
                            <PasswordReset />
                        </div>
                    }
                    </>
                ) : edit ? ( 
                    <>
                    {!lightDark ? 
                        <div className="popup light-mode">
                            <EditPost />
                        </div> :
                        <div className="popup dark-mode">
                            <EditPost />
                        </div>
                    }
                    </>
                ) : editComment ? (
                    <>
                    {!lightDark ? 
                        <div className="popup light-mode">
                            <EditComment />
                        </div> :
                        <div className="popup dark-mode">
                            <EditComment />
                        </div>
                    }
                    </>
                ) : editDisplayName ? (
                    <>
                    {!lightDark ? 
                        <div className="popup light-mode">
                            <EditDisplayName />
                        </div> :
                        <div className="popup dark-mode">
                            <EditDisplayName />
                        </div>
                    }
                    </>
                ) : newPost ? (
                    <>
                    {!lightDark ? 
                        <div className="popup light-mode">
                            <CreatePost />
                        </div> :
                        <div className="popup dark-mode">
                            <CreatePost />
                        </div>
                    }
                    </>
                ) : (<div className="hidden"></div>)}
            </div>
            <div className="content-container">
                {renderContent()}
            </div>
        </div>
    )
}

export default HomeContent;
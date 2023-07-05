import Header from "../header/Header";
import React from "react";
import "../../css/HomePage.css";
import DisplayPost from "../main/render-from-database/DisplayPost";

const Postpage = () => {
    return(
        <div className="postpage light-mode" data-page="post">
            <Header/>
            <DisplayPost/>
        </div>
    )
}

export default Postpage;
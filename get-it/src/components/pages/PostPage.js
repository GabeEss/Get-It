import Header from "../header/Header";
import React from "react";
import "../../css/HomePage.css";
import HomeContent from "../main/HomeContent";

const Postpage = () => {
    return(
        <div className="homepage light-mode" data-page="post">
            <Header/>
            <HomeContent/>
        </div>
    )
}

export default Postpage;
import Header from "../header/Header";
import React from "react";
import Sidebar from "../sidebar/Sidebar";
import "../../css/HomePage.css";
import HomeContent from "../main/HomeContent";

const Homepage = () => {
    return(
        <div className="homepage light-mode">
            <Header/>
            <Sidebar/>
            <HomeContent/>
        </div>
    )
}

export default Homepage;
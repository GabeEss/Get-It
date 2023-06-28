import Header from "../header/Header";
import React from "react";
import Sidebar from "../sidebar/Sidebar";
import "../../css/HomePage.css";

const Homepage = () => {
    return(
        <div className="homepage light-mode">
            <Header/>
            <Sidebar/>
        </div>
    )
}

export default Homepage;
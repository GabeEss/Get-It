import React from "react";
import Searchbar from "./Searchbar";
import Login from "./Login";
import "../../css/Header.css";

const Header = () => {
    return(
        <div className="header container light-mode">
            <div className="logo-container">
                <div id="logo">logo</div>
                <div id="app-name">appname</div>
            </div>
            <Searchbar/>
            <Login/>
        </div>
    )
}

export default Header;
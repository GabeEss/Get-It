import React from "react";
import Searchbar from "./Searchbar";
import Login from "./Login";
import "../../css/Header.css";

const Header = () => {
    return(
        <div className="header">
            <div className="logo-container">
                <div id="logo">Logo</div>
                <div id="app-name">Application Name</div>
            </div>
            <Searchbar/>
            <Login/>
        </div>
    )
}

export default Header;
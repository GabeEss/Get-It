import React, { useContext } from "react";
import Searchbar from "./Searchbar";
import Login from "./Login";
import "../../css/Header.css";
import logo from "../../assets/images/orange-circle.png";
import { useNavigate } from 'react-router-dom';
import { LightDarkContext } from "../../contexts/LightDarkContext";

const Header = () => {
    const navigate = useNavigate();
    const {lightDark} = useContext(LightDarkContext);

    const handleGoHome = () => {
        navigate("/");
    }

    return(
        <> 
            {!lightDark ?
                <div className="header container light-mode">
                    <div className="logo-container" onClick={handleGoHome}>
                        <img className="logo" src={logo} alt=""></img>
                        <div id="app-name">Get It</div>
                    </div>
                    <Searchbar/>
                    <Login/>
                </div> :
                <div className="header container dark-mode">
                    <div className="logo-container" onClick={handleGoHome}>
                        <img className="logo" src={logo} alt=""></img>
                        <div id="app-name">Get It</div>
                    </div>
                    <Searchbar/>
                    <Login/>
                </div>
            }
        </>
    )
}

export default Header;
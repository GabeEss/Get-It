import React from "react";
import "../../css/HomePage.css";
import { useNavigate } from 'react-router-dom';

const Accountpage = () => {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate("/");
    }

    return(
        <div className="homepage light-mode" data-page="account">
            This is the account page.
            <button onClick={handleGoHome}>Back to home...</button>
        </div>
    )
}

export default Accountpage;
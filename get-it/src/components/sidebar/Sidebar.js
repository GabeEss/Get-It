import React from "react";
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
    const navigate = useNavigate();

    const handleGaming = () => {
        navigate('/television');
    }

    const handleTelevision = () => {
        navigate('/gaming');
    }

    const handleBusiness = () => {
        navigate('/business');
    }

    const handleHome = () => {
        navigate('/');
    }

    return(
        <div className="sidebar-container">
            <div className="feeds">
                <h3 className="sidebar-header">Feeds</h3>
                <div className="sidebar-topic" onClick={handleHome}>Home</div>
                <div className="sidebar-topic">Popular</div>
            </div>
            <div className="recent">
                <h3 className="sidebar-header">Recent</h3>
                <div className="sidebar-topic">Placeholder 1</div>
            </div>
            <div className="topics">
                <h3 className="sidebar-header">Topics</h3>
                <div className="sidebar-topic" onClick={handleGaming}>Gaming</div>
                <div className="sidebar-topic" onClick={handleBusiness}>Business</div>
                <div className="sidebar-topic" onClick={handleTelevision}>Television</div>
            </div>
        </div>
    )
}

export default Sidebar;
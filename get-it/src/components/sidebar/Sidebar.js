import React, {useContext} from "react";
import { useNavigate } from 'react-router-dom';
import { SearchContext } from "../../contexts/SearchContext";
import { RecentContext } from "../../contexts/RecentContext";

const Sidebar = () => {
    const navigate = useNavigate();
    const {setSearchTerm} = useContext(SearchContext);
    const {recent} = useContext(RecentContext);

    const handleGaming = () => {
        setSearchTerm("");
        navigate('/gaming');
    }

    const handleTelevision = () => {
        setSearchTerm("");
        navigate('/television');
    }

    const handleBusiness = () => {
        setSearchTerm("");
        navigate('/business');
    }

    const handleHome = () => {
        setSearchTerm("");
        navigate('/');
    }

    const capitalizeFirstLetter = (str) => {
        if(str !== "post")
            return str.charAt(0).toUpperCase() + str.slice(1);
        return str;
    };

    const handleRecentClick = () => {

    }

    return(
        <div className="sidebar-container">
            <div className="feeds">
                <h3 className="sidebar-header">Feeds</h3>
                <div className="sidebar-topic clickable" onClick={handleHome}>Home</div>
                <div className="sidebar-topic">Popular</div>
            </div>
            <div className="recent">
                <h3 className="sidebar-header">Recent</h3>
                <div className="sidebar-topic clickable" onClick={handleRecentClick}>
                    {capitalizeFirstLetter(recent)}
                </div>
            </div>
            <div className="topics">
                <h3 className="sidebar-header">Topics</h3>
                <div className="sidebar-topic clickable" onClick={handleGaming}>Gaming</div>
                <div className="sidebar-topic clickable" onClick={handleBusiness}>Business</div>
                <div className="sidebar-topic clickable" onClick={handleTelevision}>Television</div>
            </div>
        </div>
    )
}

export default Sidebar;
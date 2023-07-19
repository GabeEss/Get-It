import React, {useContext} from "react";
import { useNavigate } from 'react-router-dom';
import { SearchContext } from "../../contexts/SearchContext";
import { RecentContext } from "../../contexts/RecentContext";

const Sidebar = () => {
    const navigate = useNavigate();
    const {setSearchTerm} = useContext(SearchContext);
    const {prevPath} = useContext(RecentContext);

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

    const handleRecentClick = () => {
        navigate(`${prevPath}`);
    }

    const formatRecentDisplay = (path) => {
        const segments = path.split('/');
        
        if(path === "/") return "/home";

        // Check if the path contains at least two segments
        if (segments.length >= 3) {
            // Returns everything except the postId at the end of the path and also replaces %20 with spaces
            return segments[0] + '/' + segments[1] + '/' + segments[2].replace(/%20/g, ' ');
        } else {
            return path; // Return the path as it is if it contains fewer than three segments
        }
    }

    return(
        <div className="sidebar-container">
            <div className="feeds">
                <h3 className="sidebar-header">Feeds</h3>
                <div className="sidebar-topic clickable" onClick={handleHome}>Home</div>
            </div>
            <div className="recent">
                <h3 className="sidebar-header">Recent</h3>
                <div className="sidebar-topic clickable" onClick={handleRecentClick}>
                    {formatRecentDisplay(prevPath)}
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
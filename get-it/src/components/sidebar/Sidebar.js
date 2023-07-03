import React from "react";

const Sidebar = () => {
    return(
        <div className="sidebar-container">
            <div className="feeds">
                <h3 className="sidebar-header">Feeds</h3>
                <div className="sidebar-topic">Home</div>
                <div className="sidebar-topic">Popular</div>
            </div>
            <div className="recent">
                <h3 className="sidebar-header">Recent</h3>
                <div className="sidebar-topic">Placeholder 1</div>
            </div>
            <div className="topics">
                <h3 className="sidebar-header">Topics</h3>
                <div className="sidebar-topic">Gaming</div>
                <div className="sidebar-topic">Business</div>
                <div className="sidebar-topic">Television</div>
            </div>
        </div>
    )
}

export default Sidebar;
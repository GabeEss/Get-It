import Header from "../header/Header";
import React, {useContext} from "react";
import Sidebar from "../sidebar/Sidebar";
import HomeContent from "../main/HomeContent";
import { LightDarkContext } from "../../contexts/LightDarkContext";

const Televisionpage = () => {
    const {lightDark} = useContext(LightDarkContext);
    return(
        <>
            {!lightDark ? 
                <div className="homepage light-mode" data-page="television">
                    <Header/>
                    <Sidebar/>
                    <HomeContent/>
                </div> :
                <div className="homepage dark-mode" data-page="television">
                    <Header/>
                    <Sidebar/>
                    <HomeContent/>
                </div>
            }
        </>
    )
}

export default Televisionpage;
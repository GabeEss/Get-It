import Header from "../header/Header";
import React, {useContext} from "react";
import HomeContent from "../main/HomeContent";
import { LightDarkContext } from "../../contexts/LightDarkContext";

const Postpage = () => {
    const {lightDark} = useContext(LightDarkContext);
    return(
        <> 
        {!lightDark ? 
            <div className="homepage light-mode" data-page="post">
                <Header/>
                <HomeContent/>
            </div> :
            <div className="homepage dark-mode" data-page="post">
                <Header/>
                <HomeContent/>
            </div>
        }
        </>
    )
}

export default Postpage;
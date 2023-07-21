import React, {useContext} from "react";
import HomeContent from "../main/HomeContent";
import { LightDarkContext } from "../../contexts/LightDarkContext";

const Accountpage = () => {
    const {lightDark} = useContext(LightDarkContext);
    return(
        <>
            {!lightDark ?
                <div className="homepage light-mode" data-page="account">
                    <HomeContent/>
                </div> :
                <div className="homepage dark-mode" data-page="account">
                    <HomeContent/>
                </div>
            }
        </>
    )
}

export default Accountpage;
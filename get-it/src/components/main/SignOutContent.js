import React from "react";
import { signOut } from "firebase/auth";
import {auth} from "../../firebase.js";

const SignOut = () => {
    const handleSignOut = () => {
      signOut(auth)
        .then(() => {
          console.log("Sign-out successful");
        })
        .catch((error) => {
          console.error("Error signing out:", error);
        });
    };
  
    return (
      <button onClick={handleSignOut}>Sign Out</button>
    );
};

export default SignOut;
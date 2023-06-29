import React, {useState, useContext} from "react";
import { createUserWithEmailAndPassword, GoogleAuthProvider, 
    signInWithPopup, linkWithPopup } from "firebase/auth";
import {auth, provider} from "../../firebase.js";
import { SignUpContext } from "../../contexts/SignUpScreenContext.js";

// SIGN UP FORM

const SignUp = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState(false);
    const {setSignUp} = useContext(SignUpContext);

    const handleChange = (event) => {
        setUsername(event.target.value);
    };

    const handleChangePassword = (event) => {
        setPassword(event.target.value);
    };

    const handlePasswordConfirm = (event) => {
        if(event.target.value === password)
            setConfirm(true);
        else
            setConfirm(false);
    }

    const handleSubmitCreate = (event) => {
        event.preventDefault();
        if (confirm) {
          createUserWithEmailAndPassword(auth, username, password)
            .then((userCredential) => {
              const user = userCredential.user;
              console.log("Sign-up successful:", user);
              onClose();
            })
            .catch((error) => {
              console.error("Error signing up:", error);
            });
        }
      };

    const onClose = () => {
        setSignUp(false);
    }

    return(
        <div className="signupcontent">
            <h2>Sign Up</h2>
            <SignUpGoogle/>
            <form onSubmit={handleSubmitCreate}>
                <input
                type="email"
                value={username}
                onChange={handleChange}
                placeholder="Email"
                required
                className="login-field"
                />
                <input
                type="password"
                value={password}
                onChange={handleChangePassword}
                placeholder="Password"
                required
                className="login-field"
                />
                <input
                type="password"
                value={password}
                onChange={handlePasswordConfirm}
                placeholder="Confirm Password"
                required
                className="login-field"
                />
                <button type="submit" className="submit-button">Submit</button>
                <button onClick={onClose}>Close</button>
            </form>
        </div>
    )
}

// SIGN UP GOOGLE

const SignUpGoogle = () => {
    const handleSignUpWithGoogle = () => {
    signInWithPopup(auth, provider)
        .then((result) => {
        // const credential = GoogleAuthProvider.credentialFromResult(result);
        const user = result.user;
    
        // Link the Google account with the existing user account
        linkWithPopup(user, provider)
        .then((result) => {
            // Account linking successful
            console.log("Google account linked successfully:", result.user);
        })
        .catch((error) => {
            // Account linking failed
            console.error("Error linking Google account:", error);
        });
    })
    .catch((error) => {
        console.error("Error signing up with Google:", error);
    });
    };

    return(
    <button className="google" onClick={handleSignUpWithGoogle}>Sign up with Google</button>
    )
}
  

export default SignUp;
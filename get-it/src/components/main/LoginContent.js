import React, {useState, useContext} from "react";
import { signInWithEmailAndPassword, GoogleAuthProvider,
    signInWithPopup, linkWithPopup } from "firebase/auth";
import { LoginContext } from "../../contexts/LoginScreenContext.js";
import {auth, provider} from "../../firebase.js";

const SignIn = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const {setLogin} = useContext(LoginContext);

    const handleChange = (event) => {
        setUsername(event.target.value);
    };

    const handleChangePassword = (event) => {
        setPassword(event.target.value);
    };

    const handleSubmitLogin = (event) => {
        event.preventDefault();
        signInWithEmailAndPassword(auth, username, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log("Sign-in successful:", user);
        })
        .catch((error) => {
            console.error("Error signing in:", error);
        });
    };

    const onClose = () => {
        setLogin(false);
    }

    return(
        <div className="signincontent">
            <h2>Sign In</h2>
            <SignInGoogle/>
            <form onSubmit={handleSubmitLogin}>
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
                <button type="submit" className="submit-button">Submit</button>
                <button onClick={onClose}>Close</button>
            </form>
        </div>
    )
}

// SIGN IN GOOGLE

const SignInGoogle = () => {
    const handleSignInWithGoogle = () => {
        signInWithPopup(auth, provider)
          .then((result) => {
            // const credential = GoogleAuthProvider.credentialFromResult(result);
            const user = result.user;
            console.log("Google sign-in successful:", user);
          })
          .catch((error) => {
            console.error("Error signing in with Google:", error);
          });
      };

      return(
        <button className="google" onClick={handleSignInWithGoogle}>Sign in with Google</button>
      )
}

export default SignIn;
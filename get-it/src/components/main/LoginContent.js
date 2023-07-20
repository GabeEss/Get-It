import React, {useState, useContext} from "react";
import { signInWithEmailAndPassword, signInWithPopup, 
    GoogleAuthProvider, updateProfile } from "firebase/auth";
import { LoginContext } from "../../contexts/LoginScreenContext.js";
import { ResetPasswordContext } from "../../contexts/ResetPasswordContext.js";
import {auth, provider, db} from "../../firebase.js";
import { collection, addDoc } from "firebase/firestore";
import { searchUserByEmail } from "../../logic/user.js";

// LOGIN FORM

const SignIn = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const {setReset} = useContext(ResetPasswordContext);
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
          .then(async (userCredential) => {
            const user = userCredential.user;
            console.log("Sign-in successful.");
            if(await searchUserByEmail(username));
            else {
              console.log("Creating user document.");
              const email = username;
              const displayName = username; // The username can be the displayName until the user changes it manually
              await updateProfile(auth.currentUser, { displayName });
              // Add user details to the users collection
              const usersCollectionRef = collection(db, "users");
              await addDoc(usersCollectionRef, { email, displayName });
            }
            onClose();
          })
          .catch((error) => {
            // const errorCode = error.code;
            // const errorMessage = error.message;
            console.error("Error signing in:", error);
            setErrorMessage("Your username or password is incorrect.");
          });
      };

    const onClose = () => {
        setLogin(false);
    }

    const handlePasswordReset = () => {
        setReset(true);
        setLogin(false);
    }

    return(
        <div className="signincontent popup">
            <h2>Sign In</h2>
            <SignInGoogle setLogin={setLogin}/>
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
                <button onClick={handlePasswordReset}>Reset Password</button>
                <button onClick={onClose}>Close</button>
            </form>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
    )
}

// SIGN IN GOOGLE

const SignInGoogle = ({ setLogin }) => {
    // This signs the user in if they are using google, but it also can create a new user.
    const handleSignInWithGoogle = () => {
      signInWithPopup(auth, provider)
        .then(async (result) => {
          const credential = GoogleAuthProvider.credentialFromResult(result);
          // Check if sign in object has google credential
          if (credential) {
            // Extract email and display name from the Google user object
            const { email } = result.user;

            if(await searchUserByEmail(email));
            else {
              const { email, displayName } = result.user;
              console.log("Creating user document.");
              // Add user details to the users collection
              const usersCollectionRef = collection(db, "users");
              await addDoc(usersCollectionRef, { email, displayName });
            }

            console.log("Sign-in with Google successful.");
            setLogin(false);    
          } else {
            throw new Error("Google credential not available");
          }
        })
        .catch((error) => {
          console.error("Error signing up with Google:", error);
          setLogin(false);
        });
    };
  
    return (
      <button className="google" onClick={handleSignInWithGoogle}>Sign in with Google</button>
    )
  }

export default SignIn;
import React, {useState, useContext} from "react";
import { signInWithEmailAndPassword, signInWithPopup, 
    GoogleAuthProvider,  linkWithPopup } from "firebase/auth";
import { LoginContext } from "../../contexts/LoginScreenContext.js";
import { ResetPasswordContext } from "../../contexts/ResetPasswordContext.js";
import { collection, getDocs, query, where, addDoc } from "firebase/firestore";
import {auth, provider, db} from "../../firebase.js";

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
          .then((userCredential) => {
            const user = userCredential.user;
            console.log("Sign-in successful:", user);
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
    const createUserDocument = async (userData) => {
        try {
          const docRef = await addDoc(collection(db, "users"), userData);
          console.log("User document created with ID:", docRef.id);
        } catch (error) {
          console.error("Error storing user data:", error);
        }
      };

    // This signs the user in if they are using google, but it also can create a new user.
    const handleSignInWithGoogle = () => {
      signInWithPopup(auth, provider)
        .then(async (result) => {
          const user = result.user;
          const credential = GoogleAuthProvider.credentialFromResult(result);
          // Check if sign in object has google credential
          if (credential) {
                // Check if the user document already exists in Firestore
                const userQuery = query(collection(db, "users"), where("email", "==", user.email));
                const querySnapshot = await getDocs(userQuery);
  
                // If the snapshot isn't empty, then nothing happens, the user should be logged in already.
                if (querySnapshot.empty) {
                  // User document doesn't exist, create a new one
                  const userData = {
                    email: user.email,
                  };
                  await createUserDocument(userData);
                }
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
      <button className="google" onClick={handleSignInWithGoogle}>Sign up with Google</button>
    )
  }

export default SignIn;
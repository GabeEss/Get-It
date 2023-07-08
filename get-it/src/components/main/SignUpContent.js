import React, {useState, useContext} from "react";
import { createUserWithEmailAndPassword, GoogleAuthProvider, 
    signInWithPopup, fetchSignInMethodsForEmail,
    signInWithEmailAndPassword } from "firebase/auth";
import {auth, provider} from "../../firebase.js";
import { SignUpContext } from "../../contexts/SignUpScreenContext.js";
import { collection, getDocs, query, where, addDoc } from "firebase/firestore";
import { db } from "../../firebase.js";

// SIGN UP FORM

const SignUp = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [nickname, setNickname] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [confirm, setConfirm] = useState(false);
    const {setSignUp} = useContext(SignUpContext);

    const handleChange = (event) => {
        setUsername(event.target.value);
    };

    const handleChangePassword = (event) => {
        setPassword(event.target.value);
    };

    const handleChangeNickname = (event) => {
        setNickname(event.target.value);
    };

    const handlePasswordConfirm = (event) => {
        if(event.target.value === password)
            setConfirm(true);
        else
            setConfirm(false);
    }

    const createUserDocument = async (userData) => {
        try {
          const docRef = await addDoc(collection(db, "users"), userData);
          console.log("User document created with ID:", docRef.id);
        } catch (error) {
          console.error("Error storing user data:", error);
        }
      };

      const handleSubmitCreate = (event) => {
        event.preventDefault();
        if (confirm) {
          // Check if the user already has an account
          fetchSignInMethodsForEmail(auth, username)
            .then(async (signInMethods) => {
              if (signInMethods.length > 0) {
                // User already has an account, log them in
                signInWithEmailAndPassword(auth, username, password)
                  .then((userCredential) => {
                    const user = userCredential.user;
                    console.log("Sign-in successful:", user);
                    onClose();
                  })
                  .catch((error) => {
                    console.error("Error signing in:", error);
                  });
              } else {
                // User doesn't have an account, create a new one
                createUserWithEmailAndPassword(auth, username, password)
                  .then(async (userCredential) => {
                    const user = userCredential.user;
                    console.log("Sign-up successful:", user);
    
                    // Check if the user document already exists in Firestore
                    const userQuery = query(collection(db, "users"), where("email", "==", username));
                    const querySnapshot = await getDocs(userQuery);
    
                    if (querySnapshot.empty) {
                      // User document doesn't exist, create a new one
                      const userData = {
                        email: username,
                        nickname: user.displayName,
                      };
                      await createUserDocument(userData);
                    }
    
                    onClose();
                  })
                  .catch((error) => {
                    console.error("Error signing up:", error);
                    setErrorMessage("Error signing up. Your password should have at least 6 characters and a number.");
                  });
              }
            })
            .catch((error) => {
              console.error("Error checking email:", error);
              onClose();
            });
        }
      };

    const onClose = () => {
        setSignUp(false);
    }

    return(
        <div className="signupcontent popup">
            <h2>Sign Up</h2>
            <SignUpGoogle setSignUp={setSignUp}/>
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
                onChange={handlePasswordConfirm}
                placeholder="Confirm Password"
                required
                className="login-field"
                />
                <input
                type="text"
                value={nickname}
                onChange={handleChangeNickname}
                placeholder="Display Name"
                required
                className="login-field"
                />
                <button type="submit" className="submit-button">Submit</button>
                <button onClick={onClose}>Close</button>
            </form>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
    )
}

// SIGN UP GOOGLE

const SignUpGoogle = ({ setSignUp }) => {
    const createUserDocument = async (userData) => {
        try {
          const docRef = await addDoc(collection(db, "users"), userData);
          console.log("User document created with ID:", docRef.id);
        } catch (error) {
          console.error("Error storing user data:", error);
        }
      };

    const handleSignUpWithGoogle = () => {
      signInWithPopup(auth, provider)
        .then(async (result) => {
          const user = result.user;
          const credential = GoogleAuthProvider.credentialFromResult(result);
          // Check if sign in object has google credential
          if (credential) {
                // Check if the user document already exists in Firestore
                const userQuery = query(collection(db, "users"), where("email", "==", user.email));
                const querySnapshot = await getDocs(userQuery);
  
                if (querySnapshot.empty) {
                  // User document doesn't exist, create a new one
                  const userData = {
                    email: user.email,
                    nickname: user.displayName,
                  };
                  await createUserDocument(userData);
                }
                setSignUp(false);    
          } else {
            throw new Error("Google credential not available");
          }
        })
        .catch((error) => {
          console.error("Error signing up with Google:", error);
          setSignUp(false);
        });
    };
  
    return (
      <button className="google" onClick={handleSignUpWithGoogle}>Sign up with Google</button>
    )
  }
  

export default SignUp;
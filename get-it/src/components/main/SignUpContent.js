import React, {useState} from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword,
    GoogleAuthProvider, signInWithPopup, linkWithPopup, signOut } from "firebase/auth";
import {auth, provider} from "../../firebase.js";

// SIGN UP FORM

const SignUp = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState(false);

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
            })
            .catch((error) => {
              console.error("Error signing up:", error);
            });
        }
      };

    return(
        <div className="signupcontent">
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

// SIGN IN

const SignIn = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

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

    return(
        <div className="signincontent">
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

//  SIGN OUT

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
  

export {SignUp, SignIn, SignUpGoogle, SignInGoogle, SignOut};
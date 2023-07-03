import React, { useState, useContext } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth, db } from "../../firebase.js";
import { collection, getDocs, query, where } from "firebase/firestore";
import { ResetPasswordContext } from "../../contexts/ResetPasswordContext.js";

const PasswordReset = () => {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const {setReset} = useContext(ResetPasswordContext);

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleResetPasswordClick = async () => {
    const userQuery = query(collection(db, "users"), where("email", "==", email));
    const querySnapshot = await getDocs(userQuery);

    // If the snapshot isn't empty, the email address is not in the database.
    if (!querySnapshot.empty) {
    sendPasswordResetEmail(auth, email)
        .then(() => {
            console.log("Password reset email sent.");
            setErrorMessage("Password reset email sent.");
            setReset(false);
        })
        .catch((error) => {
            console.error("Error sending password reset email:", error);
            setErrorMessage("Error sending password reset email.");
        });
    } else {
        console.error("Invalid email address.");
        setErrorMessage("Invalid email address.");
    }
};

const onClose = () => {
    setReset(false);
}

  return (
    <div className="passwordreset popup">
      <input
        type="email"
        value={email}
        onChange={handleEmailChange}
        placeholder="Email"
        required
        className="login-field"
      />
      <button onClick={handleResetPasswordClick} className="password-reset">
        Reset Password
      </button>
      <button onClick={onClose}>Close</button>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
};

export default PasswordReset;
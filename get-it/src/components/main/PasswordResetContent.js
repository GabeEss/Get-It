import React, { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebase.js";

const PasswordReset = () => {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleResetPasswordClick = () => {
    // getUserByEmail(auth, email)
    //   .then((user) => {
    //     if (user) {
    //       sendPasswordResetEmail(auth, email)
    //         .then(() => {
    //           console.log("Password reset email sent.");
    //           setErrorMessage("Password reset email sent.");
    //         })
    //         .catch((error) => {
    //           console.error("Error sending password reset email:", error);
    //           setErrorMessage("Error sending password reset email.");
    //         });
    //     } else {
    //       console.error("Invalid email address.");
    //       setErrorMessage("Invalid email address.");
    //     }
    //   })
    //   .catch((error) => {
    //     console.error("Error getting user by email:", error);
    //     setErrorMessage("Error getting user by email.");
    //   });
  };

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
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
};

export default PasswordReset;
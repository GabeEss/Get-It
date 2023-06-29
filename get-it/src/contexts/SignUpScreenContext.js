import React, { createContext, useState } from 'react';

export const SignUpContext = createContext();

export const SignUpProvider = ({ children }) => {
    const [signup, setSignUp] = useState("");
  
  
    return (
      <SignUpContext.Provider value={{ signup, setSignUp }}>
        {children}
      </SignUpContext.Provider>
    );
  };
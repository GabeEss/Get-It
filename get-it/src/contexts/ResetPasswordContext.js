import React, { createContext, useState } from 'react';

export const ResetPasswordContext = createContext();

export const ResetPasswordProvider = ({ children }) => {
    const [reset, setReset] = useState(false);
  
    return (
      <ResetPasswordContext.Provider value={{ reset, setReset }}>
        {children}
      </ResetPasswordContext.Provider>
    );
  };
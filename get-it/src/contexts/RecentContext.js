import React, { createContext, useState } from 'react';

export const RecentContext = createContext();

export const RecentProvider = ({ children }) => {
    const [recent, setRecent] = useState("");
  
    return (
      <RecentContext.Provider value={{ recent, setRecent }}>
        {children}
      </RecentContext.Provider>
    );
  };
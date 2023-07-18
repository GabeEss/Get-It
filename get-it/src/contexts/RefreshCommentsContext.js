import React, { createContext, useState } from 'react';

export const RefreshCommentsContext = createContext();

export const RefreshCommentsProvider = ({ children }) => {
    const [refreshComments, setRefreshComments] = useState(false);
  
    return (
      <RefreshCommentsContext.Provider value={{ refreshComments, setRefreshComments }}>
        {children}
      </RefreshCommentsContext.Provider>
    );
  };
import React, { createContext, useState } from 'react';

export const RefreshPostsContext = createContext();

export const RefreshPostsProvider = ({ children }) => {
    const [refreshPosts, setRefresh] = useState(false);
  
    return (
      <RefreshPostsContext.Provider value={{ refreshPosts, setRefresh }}>
        {children}
      </RefreshPostsContext.Provider>
    );
  };
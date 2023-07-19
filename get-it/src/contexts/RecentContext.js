import React, { createContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const RecentContext = createContext();

export const RecentProvider = ({ children }) => {
    const [currentPath, setCurrentPath] = useState("/");
    const [prevPath, setPrev] = useState("/");
    const location = useLocation();

    useEffect(() => {
      
      // Update the previous path when it differs from the current path.
      if(currentPath !== location.pathname) setPrev(currentPath);
      
      // Update the current path whenever the location changes.
      setCurrentPath(location.pathname);
    }, [location.pathname]);

    return (
      <RecentContext.Provider value={{ prevPath }}>
        {children}
      </RecentContext.Provider>
    );
  };
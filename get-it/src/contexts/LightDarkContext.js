import React, { createContext, useState, useEffect } from 'react';

export const LightDarkContext = createContext();

export const LightDarkProvider = ({ children }) => {
     // Check if a preference for light/dark mode exists in local storage
    // If it does, use that value as the initial state; otherwise, use false (default: light mode)
    const storedPreference = localStorage.getItem('lightDark');
    const initialPreference = storedPreference ? JSON.parse(storedPreference) : false;

    const [lightDark, setLightDark] = useState(initialPreference);

    useEffect(() => {
        // Save the current light/dark mode preference to local storage whenever it changes
        localStorage.setItem('lightDark', JSON.stringify(lightDark));
    }, [lightDark]);

    return (
      <LightDarkContext.Provider value={{ lightDark, setLightDark }}>
        {children}
      </LightDarkContext.Provider>
    );
  };
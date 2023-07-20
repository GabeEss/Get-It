import React, { createContext, useState } from 'react';

// The EditDisplayNameContext controls when the form to edit the user's display name pops up.

export const EditDisplayNameContext = createContext();

export const EditDisplayNameProvider = ({ children }) => {
    const [editDisplayName, setDisplayName] = useState(false);
  
    return (
      <EditDisplayNameContext.Provider value={{ editDisplayName, setDisplayName }}>
        {children}
      </EditDisplayNameContext.Provider>
    );
  };
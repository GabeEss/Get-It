import React, { createContext, useState } from 'react';

// The EditContext controls when the edit post form pops up.

export const EditContext = createContext();

export const EditProvider = ({ children }) => {
    const [edit, setEdit] = useState(null);
  
    return (
      <EditContext.Provider value={{ edit, setEdit }}>
        {children}
      </EditContext.Provider>
    );
  };
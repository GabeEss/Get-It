import React, { createContext, useState } from 'react';

export const EditContext = createContext();

export const EditProvider = ({ children }) => {
    const [edit, setEdit] = useState(null);
  
    return (
      <EditContext.Provider value={{ edit, setEdit }}>
        {children}
      </EditContext.Provider>
    );
  };
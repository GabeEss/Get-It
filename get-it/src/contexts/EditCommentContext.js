import React, { createContext, useState } from 'react';

export const EditCommentContext = createContext();

export const EditCommentProvider = ({ children }) => {
    const [editComment, setEditComment] = useState(null);
  
    return (
      <EditCommentContext.Provider value={{ editComment, setEditComment }}>
        {children}
      </EditCommentContext.Provider>
    );
  };
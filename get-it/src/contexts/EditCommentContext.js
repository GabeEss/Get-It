import React, { createContext, useState } from 'react';

// The EditCommentContext controls when the edit comment form pops up.

export const EditCommentContext = createContext();

export const EditCommentProvider = ({ children }) => {
    const [editComment, setEditComment] = useState(null);
  
    return (
      <EditCommentContext.Provider value={{ editComment, setEditComment }}>
        {children}
      </EditCommentContext.Provider>
    );
  };
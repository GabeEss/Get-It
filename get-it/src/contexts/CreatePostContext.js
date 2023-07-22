import React, { createContext, useState } from 'react';

// The CreatePostContext controls when the edit post form pops up.

export const CreatePostContext = createContext();

export const CreatePostProvider = ({ children }) => {
    const [newPost, setNewPost] = useState(null);
  
    return (
      <CreatePostContext.Provider value={{ newPost, setNewPost }}>
        {children}
      </CreatePostContext.Provider>
    );
  };
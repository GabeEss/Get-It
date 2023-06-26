import React, { createContext, useState } from 'react';

export const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
    const [search, setSearch] = useState("");
  
    const setSearchTerm = (data) => {
      setSearch(data);
    };
  
    return (
      <SearchContext.Provider value={{ search, setSearchTerm }}>
        {children}
      </SearchContext.Provider>
    );
  };
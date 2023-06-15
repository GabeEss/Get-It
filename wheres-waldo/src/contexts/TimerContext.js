import React, { createContext, useState } from 'react';

export const TimerContext = createContext();

export const TimerProvider = ({children}) => {
    const [time, setTime] = useState(0);

    const initializeTimer = () => {
        
    }

    return(
        <TimerContext.Provider value={{time, initializeTimer}}>
            {children}
        </TimerContext.Provider>
    )
}
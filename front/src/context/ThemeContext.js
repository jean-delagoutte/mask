import React, {createContext, useState, useEffect} from "react";

const ThemeContext = createContext([{}, () => {}]);

const lightTheme = 'bp5';
const darkTheme = 'bp5-dark';

const getTheme = () => {
    const theme = localStorage.getItem("theme");
    if (!theme) {
      // Default theme is taken as dark-theme
      localStorage.setItem("theme", "dark");
      return "dark";
    } else {
      return theme;
    }
  };
  

const ThemeProvider = ({children}) => {
    const [theme, setTheme] = useState(getTheme() );
    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    useEffect(() => {
        const refreshTheme = () => {
            console.log('refreshing theme : '+theme);
        localStorage.setItem("theme", theme);
        }; 
        refreshTheme();
    }, [theme]);

    return (
        <ThemeContext.Provider value={{theme, setTheme, toggleTheme}}>
            {children}
        </ThemeContext.Provider>
    )
}

export {ThemeContext, ThemeProvider, lightTheme, darkTheme};
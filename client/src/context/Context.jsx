import { createContext, useContext, useEffect, useState } from "react";
export const ContextProvider = createContext(null);

export const Context = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const value = {
    tasks,
    setTasks,
  };

  return (
    <ContextProvider.Provider value={value}>
      {children}
    </ContextProvider.Provider>
  );
};

export const myContext = () => {
  const context = useContext(ContextProvider);
  if (!context) {
    throw new Error("useAuth must be used within an AuthenticationProvider");
  }
  return context;
};

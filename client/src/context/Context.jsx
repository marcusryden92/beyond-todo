import { createContext, useContext, useState } from "react";
export const ContextProvider = createContext(null);
import { getTasks } from "../services/useTasksApi";

export const Context = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [status, setStatus] = useState();

  async function fetchTasks() {
    getTasks(setTasks);
  }

  const value = {
    status,
    setStatus,
    tasks,
    setTasks,
    fetchTasks,
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

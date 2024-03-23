import { useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

export default function Main() {
  const param = useParams();
  const username = param.user;
  const [tasks, setTasks] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const todoInput = useRef();
  // fetch the user from database
  async function getUser() {
    const url = "http://localhost:3000/tasks";
    const res = await fetch(url, {
      method: "GET",
      withCredentials: true,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.ok) {
      const tasks = await res.json();
      setTasks(tasks);
    } else {
      console.error("HTTP error:", res.status);
    }
  }

  function addTask() {
    const newTask = todoInput.current.value.trim();
    if (newTask !== "") {
      if (editIndex !== null) {
        const updatedTask = [...tasks];
        updatedTask[editIndex] = newTask;
        setTasks(updatedTask);
        setEditIndex(null);
      } else {
        setTasks([...tasks, newTodo]);
      }
      todoInput.current.value = "";
    }
  }

  function removeTask(index) {
    const updatedTasks = [...tasks];
    updatedTasks.splice(index, 1);
    setTasks(updatedTasks);
    if (editIndex === index) {
      setEditIndex(null);
    }
  }

  function editTask(index) {
    todoInput.current.value = tasks[index];
    setEditIndex(index);
  }

  function logout() {
    // Implement your logout logic here
    console.log("Logged out");
  }

  useEffect(() => {
    getUser();
  }, []);

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg text-center shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">
        Hello {username}, you have {tasks.length}{" "}
        {tasks.length === 1 ? "task" : "tasks"}
      </h2>
      <div className="mb-4">
        <input
          type="text"
          className="w-full px-4 py-2 mt-2 bg-gray-200 rounded-lg focus:ring-violet-500 focus:border-violet-500"
          placeholder="Enter your todo"
          ref={todoInput}
        />
      </div>
      <button
        onClick={addTask}
        className="w-full py-2 mb-4 bg-pink-500 hover:bg-pink-400 text-white font-semibold rounded-lg shadow-lg"
      >
        {editIndex !== null ? "UPDATE TODO" : "ADD TODO"}
      </button>
      <ul className="text-left">
        {tasks.map((tasks, index) => (
          <li
            key={index}
            className="flex justify-between items-center py-2 border-b border-gray-200"
          >
            <span>{tasks.task}</span>
            <div>
              <button
                onClick={() => editTask(index)}
                className="text-blue-500 hover:text-blue-700 mr-2"
              >
                Edit
              </button>
              <button
                onClick={() => removeTask(index)}
                className="text-pink-500 hover:text-pink-700 mr-2"
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>
      <button
        onClick={logout}
        className="w-full py-2 bg-red-500 hover:bg-red-400 text-white font-semibold rounded-lg shadow-lg"
      >
        LOG OUT
      </button>
    </div>
  );
}

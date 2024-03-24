import { useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import {
  getTasks,
  deleteTask,
  editTask,
  addTask,
} from "../services/useTasksApi";

export default function Main() {
  const [tasks, setTasks] = useState([]);
  const param = useParams();
  const username = param.user;
  const [editIndex, setEditIndex] = useState(null);
  const taskInput = useRef();

  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    const tasks = await getTasks();
    setTasks(tasks);
    console.log(tasks);
  }

  function addLocalTask() {
    const newTask = taskInput.current.value.trim();
    addTask(newTask);
    if (newTask !== "") {
      if (editIndex !== null) {
        const updatedTask = [...tasks];
        updatedTask[editIndex] = newTask;
        setEditIndex(null);
      } else {
        setTasks((prevTasks) => [...prevTasks, newTask]);
      }
      taskInput.current.value = "";
    }
    fetchTasks();
  }

  function deleteLocalTask(index) {
    deleteTask(tasks[index]);
    setTasks((prevTasks) => {
      const updatedTasks = [...prevTasks];
      updatedTasks.splice(index, 1);
      return updatedTasks;
    });

    if (editIndex === index) {
      setEditIndex(null);
    }
    fetchTasks();
  }

  function editLocalTask(index) {
    taskInput.current.value = tasks[index];
    setEditIndex(index);
  }

  function logout() {
    // Implement your logout logic here
    console.log("Logged out");
  }

  return (
    <div className="max-w-md mx-auto bg-white text-black p-8 rounded-lg text-center shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">
        Hello {username}, you have {tasks.length}{" "}
        {tasks.length === 1 ? "task" : "tasks"}
      </h2>
      <div className="mb-4">
        <input
          type="text"
          className="w-full px-4 py-2 mt-2 bg-gray-200 rounded-lg focus:ring-violet-500 focus:border-violet-500"
          placeholder="Enter your todo"
          ref={taskInput}
        />
      </div>
      <button
        onClick={addLocalTask}
        className="w-full py-2 mb-4 bg-pink-500 hover:bg-pink-400 text-white font-semibold rounded-lg shadow-lg"
      >
        {editIndex !== null ? "UPDATE TODO" : "ADD TODO"}
      </button>
      <ul className="text-left">
        {tasks
          ? tasks.map((task, index) => (
              <li
                key={index}
                className="flex justify-between items-center py-2 border-b border-gray-200"
              >
                <span>{task.task}</span>
                <div>
                  <button
                    onClick={() => editLocalTask(index)}
                    className="text-blue-500 hover:text-blue-700 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteLocalTask(index)}
                    className="text-pink-500 hover:text-pink-700 mr-2"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))
          : ""}
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

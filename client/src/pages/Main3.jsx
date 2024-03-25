import { useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import {
  getTasks,
  deleteTask,
  editTask,
  addTask,
} from "../services/useTasksApi";
import "./Main3.css";

export default function Main() {
  const [tasks, setTasks] = useState([]);
  const param = useParams();
  const username = param.user;
  const [editIndex, setEditIndex] = useState(null);
  const taskInput = useRef();

  function addLocalTask() {
    const newTask = taskInput.current.value.trim();
    addTask(newTask);
    if (newTask !== "") {
      if (editIndex !== null) {
        const updatedTask = [...tasks];
        updatedTask[editIndex] = newTask;
        setEditIndex(null);
      } else {
        setTasks([newTask, ...tasks]); // Prepend new task to tasks array
      }
      taskInput.current.value = "";
    }
  }

  function deleteLocalTask(index) {
    const updatedTasks = [...tasks];
    updatedTasks.splice(index, 1);

    if (editIndex === index) {
      setEditIndex(null);
    }
  }

  function editLocalTask(index) {
    taskInput.current.value = tasks[index];
    setEditIndex(index);
  }

  function logout() {
    // Implement your logout logic here
    console.log("Logged out");
  }

  useEffect(() => {
    async function fetchTasks() {
      const tasks = await getTasks();
      setTasks(tasks);
    }
    fetchTasks();
  }, []);

  return (
    <>
      <div className="max-w-md mx-auto bg-white text-black p-8 rounded-lg text-center shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Hello {username},</h2>
        <div className="mb-4">
          <input
            type="text"
            className="w-full px-4 py-2 mt-2 bg-gray-200 rounded-lg focus:ring-violet-500 focus:border-violet-500"
            placeholder="enter your regret"
            ref={taskInput}
          />
        </div>

        <h2 className="text-2xl font-semibold mb-4">
          You have {tasks.length} {tasks.length === 1 ? "tear" : "tears"} left
          to cry
        </h2>
      </div>
      <div className="wrapper" onClick={addLocalTask}>
        <div class="eye">
          <div class="ceye">
            <span></span>
          </div>
          <div class="bball">
            <div class="mball"></div>
            <div class="sball"></div>
          </div>
        </div>
      </div>
      <ul className="max-w-md mx-auto text-lef">
        {tasks
          ? tasks.map((task, index) => (
              <li
                key={index}
                className={`tear flex justify-between items-center py-2 border-b border-gray-200 ${
                  index % 2 === 0 ? "ml-4" : "ml-10"
                }`}
              >
                <span>{task}</span>
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

      <div className="max-w-md mx-auto">
        <button
          onClick={logout}
          className=" w-full py-2 bg-red-500 hover:bg-red-400 text-white font-semibold rounded-lg shadow-lg"
        >
          LOG OUT
        </button>
      </div>
    </>
  );
}

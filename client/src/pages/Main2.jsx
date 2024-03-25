import { useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import {
  getTasks,
  deleteTask,
  editTask,
  addTask,
} from "../services/useTasksApi";
import toiletStart from "../images/toiletStart.png";
import toiletMiddle from "../images/toiletMiddle.png";
import toiletEnd from "../images/toiletEnd.png";

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
        setTasks([...tasks, newTask]);
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
    // Logout logic here
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
    <div className="flex flex-col items-center h-screen">
      <div
        className="max-w-md mx-auto bg-white text-black p-8 text-center bg-cover"
        style={{
          position: "sticky",
          top: "0",
          backgroundImage: `url(${toiletStart})`,
          backgroundSize: "100%",
          backgroundPosition: "top",
          backgroundRepeat: "no-repeat",
          minHeight: "32%",
          minWidth: "30%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
        }}
      >
        <div>
          <h2 className="text-2xl font-semibold mb-4">
            Hello {username}, you have {tasks.length}{" "}
            {tasks.length === 1 ? "task" : "tasks"}
          </h2>
        </div>
        <div className="mb-4">
          <input
            type="text"
            className="w-3/4 px-4 py-2 mt-2 bg-gray-200 rounded-lg focus:ring-violet-500 focus:border-violet-500"
            placeholder="Enter your todo"
            ref={taskInput}
          />
        </div>
        <button
          onClick={addLocalTask}
          className="w-2/4 py-2 mb-4 bg-green-500 hover:bg-green-400 text-white font-semibold rounded-lg shadow-lg"
        >
          {editIndex !== null ? "UPDATE TODO" : "ADD TODO"}
        </button>
      </div>

      {tasks.length > 0 && (
        <div className="max-w-md mx-auto bg-white text-black text-center bg-cover">
          <ul className="text-left">
            {tasks.map((task, index) => (
              <li
                key={index}
                className="flex justify-between items-center py-2 border-b border-gray-200"
                style={{
                  backgroundImage: `url(${toiletMiddle})`,
                  backgroundSize: "100%",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  maxWidth: "374px",
                }}
              >
                <span className="pl-40">{task}</span>
                <div className="pl-4 pr-5 space-x-3">
                  <button
                    onClick={() => editLocalTask(index)}
                    className="text-blue-500 hover:text-blue-700 mr-2"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => deleteLocalTask(index)}
                    className="text-pink-500 hover:text-pink-700 mr-2"
                  >
                    ❌
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div
        className="max-w-md mx-auto bg-white text-black p-8 text-center bg-cover"
        style={{
          top: "0",
          backgroundImage: `url(${toiletEnd})`,
          backgroundSize: "50%",
          backgroundPosition: "top",
          backgroundRepeat: "no-repeat",
          minWidth: "100%", //
          // minHeight: "50%",
        }}
      ></div>
      <button
        onClick={logout}
        className="max-w-md mx-auto w-full py-2 mb-4 bg-red-500 hover:bg-red-400 text-white font-semibold rounded-lg shadow-lg"
      >
        LOG OUT
      </button>
    </div>
  );
}

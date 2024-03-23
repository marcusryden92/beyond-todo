import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Main() {
  const param = useParams();
  const username = param.user;
  const [tasks, setTasks] = useState([]);

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

  useEffect(() => {
    getUser();
  }, []);

  return (
    <>
      <h1 className="text-2xl font-bold text-center mb-4">{username}</h1>
      <ul className="space-y-4">
        {tasks.map((task, index) => (
          <li key={index} className="border p-4 rounded shadow">
            {task.task}
          </li>
        ))}
      </ul>
    </>
  );
}

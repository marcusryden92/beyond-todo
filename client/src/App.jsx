import "./App.css";
import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Main from "./pages/Main2";

export default function App() {
  const [data, setData] = useState(null);

 /*  async function getData() {
    try {
      const response = await fetch("http://localhost:3000/todos");
      const json = await response.json();
      const data = JSON.stringify(json);
      setData(data);
    } catch (err) {
      console.error(err);
    }
  } */

  // useEffect(() => {
  //   getData();
  // }, []);

  async function createTask() {
    const updatedData = {
      task_id: 5,
      user_id: 4,
      text: "Buy dog",
    };

    try {
      const response = await fetch("http://localhost:3000/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });
      const json = await response.json();
      console.log("Data updated successfully:", json);
    } catch (err) {
      console.error("Error updating data:", err);
    }
  }


  // if data null - what happens then

  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Login />} />
        <Route path="/main/:user" element={<Main />} />
      </Routes>
    </BrowserRouter>
  );
}

import React from "react";
import { Link } from "react-router-dom";

export default function Login() {


    async function createUser() {

      
    const userData = {
      user_name: input.current,
      user_id: 2,
      password: input.current,
    };

    try {
      const response = await fetch("http://localhost:3000/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
      const json = await response.json();
      console.log("Data updated successfully:", json);
    } catch (err) {
      console.error("Error updating data:", err);
    }
  }


  return (
    <div>
      <Link to="/mainpage">
        <button className="bg-blue-200 border-2 border-black">
          Go to mainpage
        </button>
      </Link>

      <form className="bg-stone-500 flex flex-col gap-4 p-24">
        <input
          type="text"
          placeholder="name"
          className="border rounded-md max-w-[10rem] p-2"
        ></input>
        <input
          type="text"
          placeholder="password"
          className="border rounded-md max-w-[10rem] p-2"
        ></input>
        <div className="flex flex-col gap-4">
          <button
            type="submit"
            className="bg-pink-200 max-w-[5rem] rounded-md p-1 "
          >
            Login
          </button>
          <button
            type="submit"
            className="bg-pink-200 max-w-[5rem] rounded-md p-1 "
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
}

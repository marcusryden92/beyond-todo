import React from "react";
import { Link } from "react-router-dom";
import { useRef } from "react";

export default function Login() {
  const password = useRef();
  const username = useRef();

  async function createUser() {
    const userData = {
      newUsername: username.current.value,
      newPassword: password.current.value,
    };

    try {
      const response = await fetch("http://localhost:3000/register", {
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
    <div className="flex">
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
          </div>
        </form>
      </div>
      <div>
        <form className=" my-5 max-w-[800px] w-full mx-auto bg-white p-8 px-8 rounded-lg  text-center">
          <div className="items-center  flex flex-col py-2 text-black">
            <label>Username</label>
            <input
              className="w-1/2 rounded-lg bg-gray-200 mt-2 p-2 focus:border-violet-800 focus:bg-purple-200 focus:outline-none"
              type="text"
              ref={username}
            />
          </div>
          <div className="items-center flex flex-col py-2 text-black">
            <label>Password</label>
            <input
              className="w-1/2  p-2 rounded-lg bg-gray-200 mt-2  focus:border-violet-800 focus:bg-purple-200 focus:outline-none"
              type="password"
              ref={password}
            />
          </div>
          <div className="flex justify-between py-2">
            <p className="flex items-center">
              <input className="mr-2" type="checkbox" />
              Remember me
            </p>
            <Link to="#">
              <p>Forgot password</p>
            </Link>
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              createUser();
            }}
            className="hover:bg-pink-400 w-full my-5 py-2 bg-pink-500 shadow-lg shadow-pink-500/50 hover:shadow-pink-500/40 text-white font-semibold rounded-lg"
          >
            SIGN UP
          </button>
        </form>
      </div>
    </div>
  );
}

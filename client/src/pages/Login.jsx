import React from "react";
import { Link } from "react-router-dom";

export default function Login() {
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

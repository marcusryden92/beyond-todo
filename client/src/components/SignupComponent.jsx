import React, { useRef } from "react";
import { Link } from "react-router-dom";

export default function SignupComponent() {
  const password = useRef();
  const username = useRef();

  async function createUser() {
    const userData = {
      username: username.current.value,
      password: password.current.value,
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
    <div className="toSignup">
      <form className="max-w-md mx-auto bg-white p-8 rounded-lg text-center shadow-lg">
        <div className="mb-4">
          <label htmlFor="username" className="block text-gray-700">
            Username
          </label>
          <input
            id="username"
            type="text"
            className="w-full px-4 py-2 mt-2 bg-gray-200 rounded-lg focus:ring-violet-500 focus:border-violet-500"
            ref={username}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="w-full px-4 py-2 mt-2 bg-gray-200 rounded-lg focus:ring-violet-500 focus:border-violet-500"
            ref={password}
          />
        </div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <input type="checkbox" id="rememberMe" className="mr-2" />
            <label htmlFor="rememberMe" className="text-gray-700">
              Remember me
            </label>
          </div>
          <Link to="#" className="text-gray-700 hover:underline">
            Forgot password
          </Link>
        </div>
        <button
          onClick={(e) => {
            e.preventDefault();
            createUser();
          }}
          className="w-full py-2 mb-4 bg-pink-500 hover:bg-pink-400 text-white font-semibold rounded-lg shadow-lg"
        >
          SIGN UP
        </button>
        <p>
          Already a member?{" "}
          <Link to="/" className="text-pink-500 hover:underline">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}

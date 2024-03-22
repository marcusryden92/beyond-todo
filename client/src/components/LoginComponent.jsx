import React from "react";
import { Link } from "react-router-dom";

export default function LoginComponent() {
  return (
    <div className="toLogin">
      <Link to="/mainpage">
        <button className="bg-blue-200 border-2 border-black">
          Go to mainpage
        </button>
      </Link>

      <form className="max-w-md mx-auto bg-white p-8 rounded-lg text-center shadow-lg">
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700">
            Name
          </label>
          <input
            id="name"
            type="text"
            placeholder="Enter your name"
            className="w-full px-4 py-2 mt-2 bg-gray-200 rounded-lg focus:ring-pink-500 focus:border-pink-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700">
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            className="w-full px-4 py-2 mt-2 bg-gray-200 rounded-lg focus:ring-pink-500 focus:border-pink-500"
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
          type="submit"
          className="w-full py-2 mb-4 bg-pink-500 hover:bg-pink-400 text-white font-semibold rounded-lg shadow-lg"
        >
          Login
        </button>
        <p className="text-gray-700">
          Not a member?{" "}
          <Link to="/signup" className="text-pink-500 hover:underline">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}

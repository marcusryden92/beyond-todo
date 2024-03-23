import { useRef } from "react";
import { Link } from "react-router-dom";

export default function RegisterForm() {
  const registerPassword = useRef();
  const registerUsername = useRef();

  async function createUser() {
    const userData = {
      username: registerUsername.current.value,
      password: registerPassword.current.value,
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
    <form className="max-w-md mx-auto bg-white p-8 rounded-lg text-center shadow-lg">
      <div className="mb-4">
        <label htmlFor="username" className="block text-gray-700">
          Username
        </label>
        <input
          id="username"
          type="text"
          className="w-full px-4 py-2 mt-2 bg-gray-200 rounded-lg focus:ring-violet-500 focus:border-violet-500"
          ref={registerUsername}
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
          ref={registerPassword}
        />
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
  );
}

import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
  const loginPassword = useRef();
  const loginUsername = useRef();
  const [status, setStatus] = useState();
  const username = useRef();
  const navigate = useNavigate();

  async function checkSession() {
    const url = "http://localhost:3000/session";
    const res = await fetch(url, {
      method: "GET",
      withCredentials: true,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json(); // Parse response body as JSON
    console.log(res.status);
    setStatus(res.status);
    return { status: res.status, username: data.username }; // Return both status and username
  }

  useEffect(() => {
    async function checkAuth() {
      const sessionData = await checkSession(); // Get status and username from checkSession

      if (sessionData.status === 200) {
        // Redirect to main page with the retrieved username
        navigate(`/main/${sessionData.username}`);
      }

      console.log(sessionData.status);
    }

    checkAuth();
  }, []);

  async function handleLogin(e) {
    e.preventDefault();

    const userData = {
      username: loginUsername.current.value,
      password: loginPassword.current.value,
    };

    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        withCredentials: true,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
      const json = await response.json();
      console.log("Data updated successfully:", json);
      setStatus(response.status);
      navigate(`/main/${loginUsername.current.value}`);
    } catch (err) {
      console.error("Error updating data:", err);
    }
  }

  return (
    <>
      <form className="max-w-md mx-auto bg-white p-8 rounded-lg text-center shadow-lg">
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700">
            Name
          </label>
          <input
            ref={loginUsername}
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
            ref={loginPassword}
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
        </div>
        <button
          onClick={(e) => {
            handleLogin(e);
          }}
          type="submit"
          className="w-full py-2 mb-4 bg-pink-500 hover:bg-pink-400 text-white font-semibold rounded-lg shadow-lg"
        >
          Login
        </button>
      </form>
    </>
  );
}

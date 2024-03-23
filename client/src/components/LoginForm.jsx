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
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(res.status);
    setStatus(res.status);
    return res.status;
  }

  useEffect(() => {
    console.log("usEffect running");

    if (status === 200) {
      console.log("Successful login detected");
      navigate(`/main/${loginUsername.current.value}`);
      return;
    }

    async function checkAuth() {
      if ((await checkSession()) === 200) {
        navigate(`/main/${loginUsername.current.value}`);
      }
      console.log(await checkSession());
    }

    checkAuth();
  });

  async function login(e) {
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
    } catch (err) {
      console.error("Error updating data:", err);
    }
  }

  return (
    <form className="bg-stone-500 flex flex-col gap-4 p-24">
      <input
        type="text"
        placeholder="name"
        ref={loginUsername}
        className="border rounded-md max-w-[10rem] p-2"
      ></input>
      <input
        type="text"
        placeholder="password"
        className="border rounded-md max-w-[10rem] p-2"
        ref={loginPassword}
      ></input>
      <div className="flex flex-col gap-4">
        <button
          type="submit"
          onClick={(e) => login(e)}
          className="bg-pink-200 max-w-[5rem] rounded-md p-1 "
        >
          Login
        </button>
      </div>
    </form>
  );
}

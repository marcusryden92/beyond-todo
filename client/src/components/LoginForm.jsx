import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { handleLogin } from "../api/userApi";
import { myContext } from "../context/Context";
import { Link } from "react-router-dom";

import { validateSession } from "../services/validateSession";

export default function LoginForm() {
  const loginPassword = useRef();
  const loginUsername = useRef();

  const { setStatus, badCredentials, setBadCredentials } = myContext();

  const navigate = useNavigate();

  const [loggingIn, setLoggingIn] = useState(false);
  const [wakingUp, setWakingUp] = useState(false);

  async function onLogin(e) {
    setLoggingIn(true);
    setWakingUp(false);
    // Free-tier backends (Render) can take up to a minute to spin up from cold;
    // if the request is slow, reassure the user instead of looking frozen.
    const wakeTimer = setTimeout(() => setWakingUp(true), 4000);
    try {
      await handleLogin(
        e,
        loginUsername.current.value,
        loginPassword.current.value,
        setStatus,
        navigate,
        setBadCredentials,
      );
    } finally {
      clearTimeout(wakeTimer);
      setLoggingIn(false);
      setWakingUp(false);
    }
  }

  useEffect(() => {
    async function checkAuth() {
      const sessionData = await validateSession(setStatus); // Get status and username from validateSession

      if (sessionData.status === 200) {
        // Redirect to main page with the retrieved username
        navigate(`/main/${sessionData.username}`);
      }

      console.log(sessionData.status);
    }

    checkAuth();
  }, []);

  return (
    <div className=" w-full h-screen bg-bg pt-20">
      <form className="max-w-md mx-auto bg-bg p-8 rounded-lg text-center grid gap-4">
        <h1 className="block text-bug font-todo uppercase text-5xl mb-4">
          Log in
        </h1>
        <input
          ref={loginUsername}
          id="name"
          type="text"
          placeholder="Username"
          className="w-full p-2  bg-bg  border-bug border-solid border-b-4 "
        />
        <input
          ref={loginPassword}
          id="password"
          type="password"
          placeholder="Password"
          className="w-full p-2 bg-bg  border-bug border-solid border-b-4"
        />
        {badCredentials ? (
          <div className="text-red-500">Wrong username or password.</div>
        ) : null}
        <button
          onClick={onLogin}
          type="submit"
          disabled={loggingIn}
          className="w-full py-2 rounded-full font-semibold bg-bug hover:brightness-125 transition duration-200 text-text font-todo mt-8 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loggingIn ? "Logging in…" : "Log in"}
        </button>
        {wakingUp ? (
          <p className="text-bug text-sm">
            Waking up the server — this can take up to a minute on the free
            tier…
          </p>
        ) : null}
        <p className="text-bug">
          Not a member?{" "}
          <Link to="/signup" className="text-eyes hover:underline">
            Sign up!
          </Link>
        </p>
        <p className="text-sm opacity-50">
          By Maya Jerndahl Bonk, Milla Lindén, Marcus Rydén, Oskar Sollenberg,
          Oliver Redondo
        </p>
      </form>
    </div>
  );
}

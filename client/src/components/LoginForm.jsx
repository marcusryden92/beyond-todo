import { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { handleLogin } from "../services/handleLogin";
import { myContext } from "../context/Context";
import { Link } from "react-router-dom";

import { checkSession } from "../services/checkSession";

export default function LoginForm() {
  const loginPassword = useRef();
  const loginUsername = useRef();

  const { setStatus, badCredentials, setBadCredentials } = myContext();

  const navigate = useNavigate();

  useEffect(() => {
    async function checkAuth() {
      const sessionData = await checkSession(setStatus); // Get status and username from checkSession

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
          onClick={(e) => {
            handleLogin(
              e,
              loginUsername.current.value,
              loginPassword.current.value,
              setStatus,
              navigate,
              setBadCredentials
            );
          }}
          type="submit"
          className="w-full py-2 rounded-full font-semibold bg-bug hover:brightness-125 transition duration-200 text-text font-todo mt-8"
        >
          Log in
        </button>
        <p className="text-bug">
          Not a member?{" "}
          <Link to="/signup" className="text-eyes hover:underline">
            Sign up!
          </Link>
        </p>
      </form>
    </div>
  );
}

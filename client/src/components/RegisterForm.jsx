import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { handleLogin } from "../services/handleLogin";
import { myContext } from "../context/Context";
import { Link } from "react-router-dom";

import { handleCreateUser } from "../services/handleCreateUser";
import { validateCredentials } from "../services/validateCredentials";

export default function RegisterForm() {
  const registerPassword = useRef();
  const registerUsername = useRef();

  const { setStatus } = myContext();

  const [displayError, setDisplayError] = useState("");
  const navigate = useNavigate();

  function handleClickRegister(e) {
    if (
      validateCredentials(
        e,
        registerUsername.current.value,
        registerPassword.current.value,
        setDisplayError
      )
    ) {
      e.preventDefault();
      handleCreateUser(
        e,
        registerUsername.current.value,
        registerPassword.current.value,
        navigate,
        handleLogin,
        setStatus
      );
    }
  }

  return (
    <div className=" w-full h-screen bg-bg pt-20">
      <form className="max-w-md mx-auto bg-bg p-8 rounded-lg text-center grid gap-4">
        <h1 className="block text-bug font-todo uppercase text-5xl mb-4">
          sign up
        </h1>
        <input
          ref={registerUsername}
          id="name"
          type="text"
          placeholder="Username"
          className="w-full p-2  bg-bg  border-bug border-solid border-b-4 "
        />

        <input
          ref={registerPassword}
          id="password"
          type="password"
          placeholder="Password"
          className="w-full p-2 bg-bg  border-bug border-solid border-b-4"
        />
        {displayError === "short username" ? (
          <div className="text-red-500">
            Username needs to be at least 3 characters!
          </div>
        ) : null}
        {displayError === "short password" ? (
          <div className="text-red-500">
            Password needs to be at least 5 characters long!
          </div>
        ) : null}
        {displayError === "bad characters" ? (
          <div className="text-red-500">Username has weird characters!</div>
        ) : null}

        <button
          onClick={(e) => {
            handleClickRegister(e);
          }}
          type="submit"
          className="w-full py-2 rounded-full font-semibold bg-bug hover:brightness-125 transition duration-200 text-text font-todo mt-8"
        >
          Sign up
        </button>

        <p className="text-bug">
          Already a member?{" "}
          <Link to="/" className="text-eyes hover:underline">
            Log in!
          </Link>
        </p>
      </form>
    </div>
  );
}

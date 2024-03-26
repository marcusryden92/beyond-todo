import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { handleLogin } from "../services/handleLogin";
import { myContext } from "../context/Context";

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
        setStatus,
        setDisplayError
      );
    }
  }

  return (
    <form className="max-w-md mx-auto bg-white p-14 rounded-lg text-center shadow-lg">
      <div className="mb-4">
        <label htmlFor="username" className="block text-gray-700">
          Username
        </label>
        <input
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
          type="password"
          className="w-full px-4 py-2 mt-2 bg-gray-200 rounded-lg focus:ring-violet-500 focus:border-violet-500"
          ref={registerPassword}
        />
      </div>
      <div className="text-red-500">{displayError}</div>

      <button
        onClick={(e) => {
          handleClickRegister(e);
        }}
        className="w-full py-2 mt-10 mb-4 bg-pink-500 hover:bg-pink-400 text-white font-semibold rounded-lg shadow-lg"
      >
        SIGN UP
      </button>
      {/* <p>
        Already a member?{" "}
        <Link to="/" className="text-pink-500 hover:underline">
          Log in
        </Link>
      </p> */}
    </form>
  );
}

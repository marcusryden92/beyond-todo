import React from "react";
import { Link } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";

export default function Login() {
  return (
    <div className="flex">
      <div>
        <Link to="/main">
          <button className="bg-blue-200 border-2 border-black">
            Go to mainpage
          </button>
        </Link>
        <LoginForm />
        <RegisterForm />
      </div>
      <div></div>
    </div>
  );
}

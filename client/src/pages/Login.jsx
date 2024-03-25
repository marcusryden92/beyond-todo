import React from "react";
import { Link } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";

export default function Login() {
  return (
    <div className="flex justify-center">
      <div className="flex inline-block">
        <LoginForm />
        <RegisterForm />
      </div>
    </div>
  );
}

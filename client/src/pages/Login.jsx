import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";

export default function Login() {
  return (
    <div>
      {/* <Link to="/main">
          <button className="bg-blue-200 border-2 border-black">
            Go to mainpage
          </button>
        </Link> */}
      <Routes>
        <Route index element={<LoginForm />} />
        <Route path="/signup" element={<RegisterForm />} />
      </Routes>
    </div>
  );
}

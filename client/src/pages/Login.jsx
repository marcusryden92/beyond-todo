import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginComponent from "../components/LoginComponent";
import SignupComponent from "../components/SignupComponent";

export default function Login() {
  return (
    <div className="flex">
      <Routes>
        <Route index element={<LoginComponent />} />
        <Route path="/signup" element={<SignupComponent />} />
      </Routes>
    </div>
  );
}

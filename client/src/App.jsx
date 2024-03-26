import "./App.css";
import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Main from "./pages/Main";
import PrivateRoutes from "./context/PrivateRoutes.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Login />} />
        <Route element={<PrivateRoutes />}>
          <Route path="/main/:user" element={<Main />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

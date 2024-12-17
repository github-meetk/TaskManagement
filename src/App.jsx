import React from "react";

import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import VerifyEmail from "./pages/VerifyEmail";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/signup"
          element={
            // <OpenRoute>
            <Signup />
            // </OpenRoute>
          }
        />
        <Route
          path="/login"
          element={
            // <OpenRoute>
            <Login />
            // </OpenRoute>
          }
        />
        <Route
          path="/verify-email"
          element={
            // <OpenRoute>
            <VerifyEmail />
            // </OpenRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;

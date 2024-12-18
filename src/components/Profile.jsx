import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setToken, setUserData } from "../slices/authSlice";
import toast from "react-hot-toast";

const Profile = () => {
  const { userData, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <div className="p-8 bg-gray-100 min-h-screen flex flex-col items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <button
          onClick={() => navigate("/")}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-4 transition-colors duration-200"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back
        </button>
        <h1 className="text-3xl font-bold mb-4 text-center">User Profile</h1>
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center mb-4">
            <span className="text-2xl text-gray-600">
              {userData.firstName.charAt(0).toUpperCase()}
            </span>
          </div>
          <h2 className="text-2xl font-semibold mb-2">{userData.firstName}</h2>
          <p className="text-gray-500 mb-2">{userData.email}</p>
          {token && (
            <button
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("userData");
                dispatch(setToken(null));
                dispatch(setUserData(null));
                navigate("/login");
                toast.success("Logout successfully!!!");
              }}
              className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition duration-200 w-auto md:w-auto"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;

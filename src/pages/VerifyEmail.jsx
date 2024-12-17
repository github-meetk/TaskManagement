import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signupAPI } from "../services/taskService";
import { useSelector } from "react-redux";

const VerifyEmail = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const { signupData } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (!signupData) {
        alert("No signup data found. Please sign up again.");
        navigate("/signup");
        return;
      }

      // Call the signup API with form data and OTP
      await signupAPI({ ...signupData, otp });
      alert("Signup successful! Please log in.");
      navigate("/login");
    } catch (error) {
      console.error(error.response?.data?.message || "Error during signup");
      alert(error.response?.data?.message || "Failed to verify OTP");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-700 mb-6">
          Verify Your Email
        </h2>
        <p className="text-gray-600 text-center mb-4">
          Enter the OTP sent to your email address to complete the signup
          process.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-600 mb-2 text-sm">OTP</label>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg text-white font-medium ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 transition"
            }`}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
        <p className="text-gray-600 text-center mt-4">
          Didn't receive the OTP?{" "}
          <a href="/signup" className="text-blue-500 hover:underline">
            Retry
          </a>
        </p>
      </div>
    </div>
  );
};

export default VerifyEmail;

import { useEffect, useRef, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import {
  isLoggedIn,
  saveUserEmail,
  sendOtp,
  verifyOtp,
} from "../services/apiClient";
 
export default function OtpPage() {
  const navigate = useNavigate();
 
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputsRef = useRef([]);
 
  const [timer, setTimer] = useState(90); // 1 min 30 sec
  const [canResend, setCanResend] = useState(false);
 
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const email = location.state?.email;
  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    if (isLoggedIn()) {
      navigate(from, { replace: true });
    }
  }, [from, navigate]);
 
  useEffect(() => {
    if (timer <= 0) {
      setCanResend(true);
      return;
    }
 
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
 
    return () => clearInterval(interval);
  }, [timer]);
 
  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;
 
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
 
    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };
 
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
 
    const enteredOtp = otp.join("");
 
    if (enteredOtp.length !== 6) {
      setError("Please enter the 6-digit OTP.");
      return;
    }
 
    setError("");
    setLoading(true);

    try {
      await verifyOtp(email, enteredOtp);
      saveUserEmail(email);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };
 
  const handleResend = async () => {
    if (!canResend) return;

    setError("");

    try {
      await sendOtp(email);
      setTimer(90);
      setCanResend(false);
      setOtp(["", "", "", "", "", ""]);
      inputsRef.current[0]?.focus();
    } catch (err) {
      setError(err.message || "Failed to resend OTP");
    }
  };
 
  const formatTime = () => {
    const min = Math.floor(timer / 60);
    const sec = timer % 60;
    return `${min}:${sec.toString().padStart(2, "0")}`;
  };
 
  if (!email) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <Navbar />
 
      <div className="flex flex-1 items-center justify-center">
        <div className="bg-white p-8 rounded-md shadow-md w-[420px] text-center">
 
          <h2 className="text-xl font-semibold mb-2">
            Enter One-Time Code
          </h2>
 
          <p className="text-sm text-gray-600 mb-6">
            We sent a 6-digit code to <br />
            <span className="font-medium">{email}</span>
          </p>
 
          {/* OTP Inputs */}
          <div className="flex justify-center gap-3 mb-4">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputsRef.current[index] = el)}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-12 h-12 text-center border rounded-md text-lg focus:ring-2 focus:ring-blue-500"
              />
            ))}
          </div>
 
          {error && (
            <p className="text-red-500 text-sm mb-2">{error}</p>
          )}
 
          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
 
          {/* Resend */}
          <div className="mt-4 text-sm text-gray-600">
            {canResend ? (
              <button
                onClick={handleResend}
                className="text-blue-600 hover:underline"
              >
                Resend OTP
              </button>
            ) : (
              <span>Resend available in {formatTime()}</span>
            )}
          </div>
 
        </div>
      </div>
    </div>
  );
}
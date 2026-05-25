import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { isLoggedIn, sendOtp } from "../services/apiClient";

const ALLOWED_DOMAINS = ["@descartes.com"];

function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-md shadow-lg w-[400px] p-6 relative">
        <h3 className="text-lg font-semibold mb-3">{title}</h3>
        <div className="text-sm text-gray-600 mb-4">{children}</div>
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isLoggedIn()) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Domain validation
    const isValidDomain = ALLOWED_DOMAINS.some((domain) =>
      email.toLowerCase().endsWith(domain)
    );

    if (!email || !isValidDomain) {
      setError("Please enter a valid @descartes.com email address.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      // ← ACTUAL API CALL — backend se OTP bhejwa
      await sendOtp(email);

      // Success → OTP page pe jao
      navigate("/otp", { state: { email, from: location.state?.from } });

    } catch (err) {
      setError(err.message || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <Navbar />

      <div className="flex flex-1 items-center justify-center">
        <div className="bg-white p-8 rounded-md shadow-md w-[420px]">

          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Sign in to Descartes Jira History
          </h2>

          <div className="bg-yellow-100 text-yellow-800 text-sm p-3 rounded-md mb-5 flex items-start gap-2">
            <span>⚠️</span>
            <span>Login required to access Jira issues data.</span>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <label className="text-sm font-medium text-gray-700">
              Work Email
            </label>

            <input
              type="email"
              placeholder="mail@descartes.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {error && (
              <span className="text-red-500 text-sm">{error}</span>
            )}

            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 text-white py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? "Sending OTP..." : "Send one-time code"}
            </button>
          </form>

          <div className="mt-5 text-sm text-gray-600 text-center space-y-2">
            <p>
              Need access?{" "}
              <span
                onClick={() => setActiveModal("contact")}
                className="text-blue-600 cursor-pointer hover:underline"
              >
                Contact administrator
              </span>
            </p>
            <p>
              <span
                onClick={() => setActiveModal("help")}
                className="text-blue-600 cursor-pointer hover:underline"
              >
                Can't access your account?
              </span>
            </p>
          </div>

          <p className="text-xs text-gray-400 mt-4 text-center">
            Access is limited to authorized Descartes users.
          </p>
        </div>
      </div>

      {activeModal === "help" && (
        <Modal title="Help Center" onClose={() => setActiveModal(null)}>
          If you are unable to sign in, ensure you are using a valid company
          email or contact your administrator for assistance.
        </Modal>
      )}

      {activeModal === "contact" && (
        <Modal title="Contact Administrator" onClose={() => setActiveModal(null)}>
          Please reach out to your company administrator or IT support team for
          account access.
        </Modal>
      )}
    </div>
  );
}
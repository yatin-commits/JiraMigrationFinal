import { Link, useNavigate } from "react-router-dom";
import {
  getUserEmail,
  isLoggedIn,
  removeToken,
  removeUserEmail,
} from "../services/apiClient";

export default function Navbar() {
  const navigate = useNavigate();
  const loggedIn = isLoggedIn();
  const userEmail = getUserEmail();

  const handleLogout = () => {
    removeToken();
    removeUserEmail();
    navigate("/login", { replace: true });
  };

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-gradient-to-r from-blue-800 to-blue-900 text-white shadow-sm">
      <div className="mx-auto grid h-16 max-w-7xl grid-cols-3 items-center px-4 sm:px-6">
        <div className="justify-self-start" />
        <Link
          to="/"
          className="justify-self-center min-w-0 max-w-full px-1 sm:px-2 text-center font-semibold tracking-tight whitespace-nowrap text-[clamp(0.95rem,3.4vw,1.25rem)] sm:text-xl md:text-2xl lg:text-3xl 2xl:text-4xl hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30 rounded"
        >
          Descartes Jira History
        </Link>

        <div className="flex justify-self-end items-center gap-3">
          {loggedIn && (
            <>
              <span className="max-w-[180px] truncate text-xs sm:text-sm text-white/90">
                {userEmail || "Logged in"}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="text-xs sm:text-sm px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 transition-colors"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
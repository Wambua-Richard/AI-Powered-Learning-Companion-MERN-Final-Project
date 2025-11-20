import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="flex justify-between px-6 py-4 shadow-md bg-white">
      <Link to="/" className="font-bold text-xl">AI Learning Companion</Link>

      <div className="flex gap-4">
        {!user ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        ) : (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <button onClick={logout} className="text-red-600">Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}

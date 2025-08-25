import React from "react";
import { Bell, LogOut } from "lucide-react";
import "../CSS/Navbar.css";
import { useNavigate } from "react-router-dom";

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (typeof onLogout === "function") {
      onLogout();
    }
    navigate("/"); // Redirige al login
  };

  return (
    <header className="navbar">
      {/* Notificaciones */}
      <button className="navbar-icon">
        <Bell size={20} />
      </button>

      {/* Usuario */}
      <div className="navbar-user">
        <p className="navbar-username">{user.full_name}</p>
        <span className="navbar-role">{user.role}</span>
      </div>

      {/* Avatar */}
      <div className="navbar-avatar">{user.usuario[0].toUpperCase()}</div>

      {/* Logout */}
      <button className="navbar-icon" onClick={handleLogout}>
        <LogOut size={20} />
      </button>
    </header>
  );
};

export default Navbar;
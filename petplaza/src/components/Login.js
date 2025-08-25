import React, { useState } from "react";
import "../CSS/Login.css";
import logo from "../assets/logo.jpeg";

function Login({ onSubmit }) {
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!usuario.trim() || !contrasena.trim()) {
      setError("Por favor completa ambos campos.");
      return;
    }

    // Simulación de login sin backend
    if (usuario === "admin" && contrasena === "admin123") {
      alert(`Bienvenido, ${usuario}`);
      if (typeof onSubmit === "function") {
        onSubmit({ usuario, contrasena });
      }
    } else {
      setError("Usuario o contraseña incorrectos");
    }
  };

  return (
    <div className="login-bg">
      <div className="login-card">
        <div className="login-logo-wrapper">
          <img src={logo} alt="Logo PetPlaza" className="login-logo" />
        </div>
        <h1 className="login-title">PETPLAZA</h1>
        <p className="login-subtitle">HOSPIVET</p>

        <form onSubmit={handleSubmit} className="login-form">
          <label className="login-label">
            Usuario
            <input
              type="text"
              className="login-input"
              placeholder="Ingresa tu usuario"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              required
            />
          </label>

          <label className="login-label">
            Contraseña
            <input
              type="password"
              className="login-input"
              placeholder="Ingresa tu contraseña"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              required
            />
          </label>

          {error && <div className="login-error">{error}</div>}

          <button type="submit" className="login-button">
            Iniciar Sesión
          </button>
        </form>

        <div className="login-footer">
          <p>
            Usuario por defecto: <strong>admin</strong> <br />
            Contraseña: <strong>admin123</strong>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
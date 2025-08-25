import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (data) => {
    setUser({
      full_name: "Administrador PetPlaza",
      role: "admin",
      usuario: data.usuario,
    });
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <BrowserRouter>
      {!user ? (
        <Login onSubmit={handleLogin} />
      ) : (
        <Routes>
          <Route path="/*" element={<Dashboard user={user} onLogout={handleLogout} />} />
        </Routes>
      )}
    </BrowserRouter>
  );
}

export default App;
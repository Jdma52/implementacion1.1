import React from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Users from "./Users"; // Importa el componente Users (y otros futuros)

const Dashboard = ({ user, onLogout }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* Navbar arriba */}
      <Navbar user={user} onLogout={onLogout} />

      <div style={{ display: "flex", flex: 1 }}>
        <Sidebar user={user} />

        {/* Contenido dinámico */}
        <main style={{ marginLeft: "250px", padding: "2rem", flex: 1 }}>
          <Routes>
            <Route path="/Dashboard" element={<h1>Bienvenido al Dashboard</h1>} />
            <Route path="users" element={<Users user={user} />} />
            {/* Puedes agregar más rutas internas aquí */}
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

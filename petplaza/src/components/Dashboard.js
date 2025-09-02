import React, { useState} from "react";
import {
  Users,
  PawPrint,
  Calendar,
  Package,
  AlertTriangle,
  User,
} from "lucide-react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "../CSS/Dashboard.css";

const Dashboard = () => {
  // Datos simulados
  const [stats] = useState({
    owners: 25,
    pets: 42,
    appointments: 18,
    lowStock: 6,
  });

  const [recentAppointments] = useState([
    { id: 1, ownerName: "Carlos Pérez", date: "2025-09-02", time: "10:00 AM" },
    { id: 2, ownerName: "Ana López", date: "2025-09-01", time: "3:00 PM" },
    { id: 3, ownerName: "José Martínez", date: "2025-08-30", time: "11:30 AM" },
  ]);

  const [lowStockItems] = useState([
    { id: 1, name: "Vacuna Antirrábica", quantity: 3 },
    { id: 2, name: "Alimento Premium", quantity: 5 },
    { id: 3, name: "Desparasitante", quantity: 2 },
  ]);

  // Datos para gráficos
  const appointmentsData = [
    { month: "Ene", citas: 12 },
    { month: "Feb", citas: 18 },
    { month: "Mar", citas: 25 },
    { month: "Abr", citas: 20 },
    { month: "May", citas: 30 },
    { month: "Jun", citas: 22 },
  ];

  const petsData = [
    { name: "Perros", value: 25 },
    { name: "Gatos", value: 12 },
    { name: "Aves", value: 5 },
  ];

  const COLORS = ["#10b981", "#6366f1", "#f59e0b"];

  return (
    <div className="dashboard fade-in">
      {/* Encabezado */}
      <div className="dashboard-header">
        <h1>Bienvenido, Administrador PetPlaza</h1>
        <p>Resumen del sistema de gestión veterinaria</p>
      </div>

      {/* Tarjetas */}
      <div className="stats-grid">
        <div className="stats-card card-hover">
          <div>
            <p className="stats-number">{stats.owners}</p>
            <p className="stats-label">Dueños Registrados</p>
          </div>
          <div className="icon bg-blue-100">
            <Users className="h-6 w-6 text-blue-600" />
          </div>
        </div>

        <div className="stats-card card-hover">
          <div>
            <p className="stats-number">{stats.pets}</p>
            <p className="stats-label">Mascotas Registradas</p>
          </div>
          <div className="icon bg-emerald-100">
            <PawPrint className="h-6 w-6 text-emerald-600" />
          </div>
        </div>

        <div className="stats-card card-hover">
          <div>
            <p className="stats-number">{stats.appointments}</p>
            <p className="stats-label">Citas Programadas</p>
          </div>
          <div className="icon bg-purple-100">
            <Calendar className="h-6 w-6 text-purple-600" />
          </div>
        </div>

        <div className="stats-card card-hover">
          <div>
            <p className="stats-number">{stats.lowStock}</p>
            <p className="stats-label">Stock Bajo</p>
          </div>
          <div className="icon bg-red-100">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="charts-grid">
        <div className="card">
          <h2>Citas por Mes</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={appointmentsData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="citas" fill="#6366f1" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h2>Distribución de Mascotas</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={petsData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label
              >
                {petsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Listas */}
      <div className="lists-grid">
        <div className="card">
          <h2>Citas Recientes</h2>
          <ul>
            {recentAppointments.map((appointment) => (
              <li key={appointment.id} className="list-item">
                <User className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <p className="font-medium">{appointment.ownerName}</p>
                  <p className="text-sm">
                    {appointment.date} a las {appointment.time}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="card">
          <h2>Artículos con Stock Bajo</h2>
          <ul>
            {lowStockItems.map((item) => (
              <li key={item.id} className="list-item">
                <Package className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-red-500">
                    Stock: {item.quantity}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;  

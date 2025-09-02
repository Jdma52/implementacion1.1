import React from "react";
import "../CSS/Citas.css";

const citas = [
  { id: 1, paciente: "Juan Pérez", fecha: "2025-09-03", hora: "10:00 AM", servicio: "Consulta general" },
  { id: 2, paciente: "María López", fecha: "2025-09-03", hora: "11:00 AM", servicio: "Vacunación" },
  { id: 3, paciente: "Carlos Ramírez", fecha: "2025-09-04", hora: "09:30 AM", servicio: "Control de peso" },
];

const Citas = () => {
  return (
    <div className="citas-container">
      <h2>Próximas Citas</h2>
      <div className="citas-lista">
        {citas.map(cita => (
          <div key={cita.id} className="cita-card">
            <p><strong>Paciente:</strong> {cita.paciente}</p>
            <p><strong>Fecha:</strong> {cita.fecha}</p>
            <p><strong>Hora:</strong> {cita.hora}</p>
            <p><strong>Servicio:</strong> {cita.servicio}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Citas;

// src/components/MedicalRecords.js
import React, { useState, useRef } from "react";
import { Plus, Search, Edit, Trash2, FileDown } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "../CSS/MedicalRecords.css";

const MedicalRecords = () => {
  const [records, setRecords] = useState([
    {
      id: 1,
      owner: "Juan Pérez",
      pet: "Max",
      species: "Perro",
      date: "2025-08-23",
      vet: "Dra. María González (Cardióloga)",
      diagnosis: "",
      treatment: "No se requiere tratamiento",
      notes: "Mascota en excelente estado de salud",
      vaccinesAdministered: [],
      createdAt: new Date(),
      modifiedAt: null,
    },
  ]);

  const [selectedPet, setSelectedPet] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [confirmationMsg, setConfirmationMsg] = useState("");

  const [newRecord, setNewRecord] = useState({
    owner: "",
    pet: "",
    species: "",
    date: "",
    vet: "",
    diagnosis: "",
    treatment: "",
    notes: "",
    vaccinesAdministered: [],
    vaccinesField: "",
  });

  const pdfRef = useRef();

  const vets = [
    "Dra. María González (Cardióloga)",
    "Dr. Carlos López (Dermatólogo)",
    "Dra. Ana Torres (Cirujana)",
  ];

  const vaccines = ["Rabia", "Parvovirus", "Distemper", "Leptospirosis"];

  const filteredRecords = records.filter(
    (r) =>
      `${r.pet} (${r.species}) - ${r.owner}`
        .toLowerCase()
        .includes(selectedPet.toLowerCase()) &&
      (r.pet.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.owner.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "vaccinesField") {
      const dateTime = new Date().toLocaleString();
      const updatedVaccine = `${value} (${dateTime})`;

      setNewRecord((prev) => ({
        ...prev,
        vaccinesField: value,
        vaccinesAdministered: [...prev.vaccinesAdministered, updatedVaccine],
      }));
    } else {
      setNewRecord((prev) => ({ ...prev, [name]: value }));
    }
  };

  const showTemporaryMessage = (msg) => {
    setConfirmationMsg(msg);
    setTimeout(() => setConfirmationMsg(""), 6000);
  };

  const handleAddOrUpdateRecord = () => {
    if (!newRecord.pet || !newRecord.vet || !newRecord.date) {
      alert("Por favor completa los campos requeridos: Mascota, Doctor y Fecha.");
      return;
    }

    if (editingRecord) {
      const updated = {
        ...newRecord,
        id: editingRecord.id,
        createdAt: editingRecord.createdAt,
        modifiedAt: new Date(),
      };
      setRecords(records.map((r) => (r.id === editingRecord.id ? updated : r)));
      showTemporaryMessage(
        `Expediente modificado el ${new Date().toLocaleString()} por ${newRecord.vet}`
      );
    } else {
      const newEntry = {
        ...newRecord,
        id: Date.now(),
        createdAt: new Date(),
        modifiedAt: null,
      };
      setRecords([...records, newEntry]);
      showTemporaryMessage(
        `Expediente creado el ${new Date().toLocaleString()} por ${newRecord.vet}`
      );
    }

    setNewRecord({
      owner: "",
      pet: "",
      species: "",
      date: "",
      vet: "",
      diagnosis: "",
      treatment: "",
      notes: "",
      vaccinesAdministered: [],
      vaccinesField: "",
    });
    setEditingRecord(null);
    setShowModal(false);
    setImagePreview(null);
  };

  const handleEditRecord = (record) => {
    setEditingRecord(record);
    setNewRecord({ ...record, vaccinesField: "" });
    setShowModal(true);
  };

  const handleDeleteRecord = (recordId) => {
    const record = records.find((r) => r.id === recordId);
    showTemporaryMessage(`Expediente de ${record.pet} será eliminado`);
    setTimeout(() => {
      if (window.confirm("¿Deseas eliminar este expediente?")) {
        setRecords(records.filter((r) => r.id !== recordId));
      }
    }, 100);
  };

  const handleExportImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
      setTimeout(() => showTemporaryMessage("Imagen exportada correctamente"), 500);
    }
  };

  const handleExportPDF = async () => {
    const input = pdfRef.current;
    const canvas = await html2canvas(input);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const imgWidth = 190;
    const pageHeight = pdf.internal.pageSize.height;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 10;

    pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save("expedientes-clinicos.pdf");
  };

  return (
    <div className="medical-container" ref={pdfRef}>
      {confirmationMsg && (
        <div className="confirmation-modal">{confirmationMsg}</div>
      )}

      <div className="medical-header">
        <h1>Expedientes Clínicos</h1>
        <div style={{ display: "flex", gap: "10px" }}>
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={16} /> Nuevo Expediente
          </button>
        </div>
      </div>

      <div className="medical-filters">
        <select
          value={selectedPet}
          onChange={(e) => setSelectedPet(e.target.value)}
        >
          <option value="">Seleccionar mascota</option>
          {records.map((r) => (
            <option key={r.id} value={`${r.pet} (${r.species}) - ${r.owner}`}>
              {`${r.pet} (${r.species}) - ${r.owner}`}
            </option>
          ))}
        </select>

        <div className="search-box">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Buscar en expedientes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="records-cards">
        {filteredRecords.map((r) => (
          <div className="record-card" key={r.id}>
            <div className="record-header">
              <h3>Revisión general</h3>
              <span>
                Creado: {r.createdAt.toLocaleString()} <br />
                Modificado:{" "}
                {r.modifiedAt ? r.modifiedAt.toLocaleString() : "No modificado"}{" "}
                <br />
                Doctor: {r.vet}
              </span>
              <div className="card-buttons">
                <button className="btn-edit" onClick={() => handleEditRecord(r)}>
                  <Edit size={16} /> Editar
                </button>
                <button
                  className="btn-delete"
                  onClick={() => handleDeleteRecord(r.id)}
                >
                  <Trash2 size={16} /> Borrar
                </button>
                <button className="btn-pdf" onClick={handleExportPDF}>
                  <FileDown size={16} /> Exportar PDF
                </button>
              </div>
            </div>
            <div className="record-body">
              <div className="record-section">
                <h4>Diagnóstico</h4>
                <p>{r.diagnosis || "N/A"}</p>
              </div>
              <div className="record-section">
                <h4>Tratamiento</h4>
                <p>{r.treatment}</p>
              </div>
              <div className="record-section">
                <h4>Notas adicionales</h4>
                <p>{r.notes}</p>
              </div>
              <div className="record-section">
                <h4>Vacunas administradas</h4>
                {r.modifiedAt && (
                  <p className="modified-msg">
                    Este expediente ha sido modificado con anterioridad.
                  </p>
                )}
                <ul>
                  {r.vaccinesAdministered.map((v, idx) => (
                    <li key={idx}>{v}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}

        {filteredRecords.length === 0 && (
          <p className="empty-state">No se encontraron expedientes.</p>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{editingRecord ? "Editar" : "Nuevo"} Expediente Clínico</h2>
            </div>
            <div className="modal-body">
              <label>Mascota</label>
              <select
                name="pet"
                value={newRecord.pet}
                onChange={handleInputChange}
              >
                <option value="">Seleccionar mascota</option>
                {records.map((r) => (
                  <option key={r.id} value={r.pet}>
                    {r.pet} ({r.species}) - {r.owner}
                  </option>
                ))}
              </select>

              <label>Doctor</label>
              <select
                name="vet"
                value={newRecord.vet}
                onChange={handleInputChange}
              >
                <option value="">Seleccionar doctor</option>
                {vets.map((v, idx) => (
                  <option key={idx} value={v}>
                    {v}
                  </option>
                ))}
              </select>

              <label>Fecha</label>
              <input
                type="date"
                name="date"
                value={newRecord.date}
                onChange={handleInputChange}
              />

              <label>Diagnóstico</label>
              <input
                type="text"
                name="diagnosis"
                placeholder="Diagnóstico"
                value={newRecord.diagnosis}
                onChange={handleInputChange}
              />

              <label>Tratamiento</label>
              <textarea
                name="treatment"
                placeholder="Tratamiento"
                value={newRecord.treatment}
                onChange={handleInputChange}
              />

              <label>Notas adicionales</label>
              <textarea
                name="notes"
                placeholder="Notas adicionales"
                value={newRecord.notes}
                onChange={handleInputChange}
              />

              <label>Vacunas</label>
              <select
                name="vaccinesField"
                value={newRecord.vaccinesField || ""}
                onChange={handleInputChange}
              >
                <option value="">Seleccionar vacuna</option>
                {vaccines.map((v, idx) => (
                  <option key={idx} value={v}>
                    {v}
                  </option>
                ))}
              </select>

              <div className="modal-buttons unified-buttons">
                <button
                  className="btn-cancel"
                  onClick={() => {
                    setShowModal(false);
                    setEditingRecord(null);
                    setImagePreview(null);
                  }}
                >
                  Cancelar
                </button>

                <button
                  className="btn-primary"
                  onClick={handleAddOrUpdateRecord}
                >
                  Guardar
                </button>

                <label className="btn-export">
                  Importar Imagen
                  <input
                    type="file"
                    style={{ display: "none" }}
                    onChange={handleExportImage}
                  />
                </label>
              </div>

              {imagePreview && (
                <img src={imagePreview} alt="Preview" className="image-preview" />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicalRecords;

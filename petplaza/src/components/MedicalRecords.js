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
      gender: "Macho",
      breed: "Labrador",
      weight: "10 kg",
      color: "Marrón",
      bloodDonor: "Sí",
      ccToApply: "Ninguno",
      date: "2025-08-23",
      vet: "Dra. María González (Cardióloga)",
      diagnosis: "",
      treatment: "No se requiere tratamiento",
      notes: "Mascota en excelente estado de salud",
      vaccinesAdministered: [],
      images: [],
      createdAt: new Date(),
      modifiedAt: null,
    },
  ]);

  const [selectedPet, setSelectedPet] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [confirmationMsg, setConfirmationMsg] = useState("");

  const [imagePreview, setImagePreview] = useState([]);
  const [deleteImageModal, setDeleteImageModal] = useState(false);
  const [imageToDelete, setImageToDelete] = useState(null);

  // Imagen en pantalla completa
  const [fullScreenImage, setFullScreenImage] = useState(null);

  const [newRecord, setNewRecord] = useState({
    owner: "",
    pet: "",
    species: "",
    gender: "",
    breed: "",
    weight: "",
    color: "",
    bloodDonor: "",
    ccToApply: "",
    date: "",
    vet: "",
    diagnosis: "",
    treatment: "",
    notes: "",
    vaccinesAdministered: [],
    vaccinesField: "",
    images: [],
  });

  const pdfRef = useRef();

  const vets = [
    "Dra. María González (Cardióloga)",
    "Dr. Carlos López (Dermatólogo)",
    "Dra. Ana Torres (Cirujana)",
  ];

  const vaccines = ["Rabia", "Parvovirus", "Distemper", "Leptospirosis"];
  const speciesOptions = ["Perro", "Gato", "Ave", "Conejo", "Otro"];
  const genderOptions = ["Macho", "Hembra"];
  const bloodDonorOptions = ["Sí", "No"];

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
      gender: "",
      breed: "",
      weight: "",
      color: "",
      bloodDonor: "",
      ccToApply: "",
      date: "",
      vet: "",
      diagnosis: "",
      treatment: "",
      notes: "",
      vaccinesAdministered: [],
      vaccinesField: "",
      images: [],
    });
    setEditingRecord(null);
    setShowModal(false);
    setImagePreview([]);
  };

  const handleEditRecord = (record) => {
    setEditingRecord(record);
    setNewRecord({ ...record, vaccinesField: "" });
    setImagePreview(record.images || []);
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
    const files = e.target.files;
    if (files.length > 0) {
      const readers = Array.from(files).map(
        (file) =>
          new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.readAsDataURL(file);
          })
      );

      Promise.all(readers).then((images) => {
        setImagePreview((prev) => [...prev, ...images]);
        setNewRecord((prev) => ({ ...prev, images: [...prev.images, ...images] }));
        showTemporaryMessage("Imagen(es) Importada(s) Correctamente");
      });
    }
  };

  const handleDeleteImage = (recordId, img) => {
    setImageToDelete({ recordId, img });
    setDeleteImageModal(true);
  };

  const confirmDeleteImage = () => {
    if (imageToDelete) {
      const { recordId, img } = imageToDelete;
      if (recordId === "new") {
        setImagePreview((prev) => prev.filter((i) => i !== img));
        setNewRecord((prev) => ({
          ...prev,
          images: prev.images.filter((i) => i !== img),
        }));
      } else {
        setRecords((prev) =>
          prev.map((r) =>
            r.id === recordId
              ? { ...r, images: r.images.filter((i) => i !== img) }
              : r
          )
        );
      }
      showTemporaryMessage("Imagen Eliminada Correctamente");
    }
    setDeleteImageModal(false);
    setImageToDelete(null);
  };

  const handleExportPDF = async (record) => {
    const input = document.getElementById(`record-${record.id}`);
    input.classList.add("pdf-hidden");

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

    input.classList.remove("pdf-hidden");
    pdf.save(`expediente-${record.pet}.pdf`);
  };

  return (
    <div className="medical-container" ref={pdfRef}>
      {confirmationMsg && (
        <div className="confirmation-modal">{confirmationMsg}</div>
      )}

      {/* Imagen en pantalla completa */}
      {fullScreenImage && (
        <div
          className="image-modal-overlay active"
          onClick={() => setFullScreenImage(null)}
        >
          <img src={fullScreenImage} className="image-modal" alt="Full Preview" />
        </div>
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
          <div className="record-card" key={r.id} id={`record-${r.id}`}>
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
                <button
                  className="btn-export-pdf"
                  onClick={() => handleExportPDF(r)}
                >
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
              {r.images.length > 0 && (
                <div className="record-section">
                  <h4>Imágenes asociadas</h4>
                  <div className="image-gallery">
                    {r.images.map((img, idx) => (
                      <div key={idx} className="image-container">
                        <img
                          src={img}
                          alt="Expediente"
                          className="record-image"
                          onClick={() => setFullScreenImage(img)}
                        />
                        <button
                          className="delete-image-btn"
                          onClick={() => handleDeleteImage(r.id, img)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {filteredRecords.length === 0 && (
          <p className="empty-state">No se encontraron expedientes.</p>
        )}
      </div>

      {/* Modal de creación / edición */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{editingRecord ? "Editar" : "Nuevo"} Expediente Clínico</h2>
            </div>
            <div className="modal-body">
              <label>Dueño</label>
              <input
                type="text"
                name="owner"
                placeholder="Nombre del dueño"
                value={newRecord.owner}
                onChange={handleInputChange}
              />

              <label>Mascota</label>
              <input
                type="text"
                name="pet"
                placeholder="Nombre de la mascota"
                value={newRecord.pet}
                onChange={handleInputChange}
              />

              <label>Especie</label>
              <select
                name="species"
                value={newRecord.species}
                onChange={handleInputChange}
              >
                <option value="">Seleccionar especie</option>
                {speciesOptions.map((s, idx) => (
                  <option key={idx} value={s}>
                    {s}
                  </option>
                ))}
              </select>

              <label>Género</label>
              <select
                name="gender"
                value={newRecord.gender}
                onChange={handleInputChange}
              >
                <option value="">Seleccionar género</option>
                {genderOptions.map((g, idx) => (
                  <option key={idx} value={g}>
                    {g}
                  </option>
                ))}
              </select>

              <label>Raza</label>
              <input
                type="text"
                name="breed"
                placeholder="Raza de la mascota"
                value={newRecord.breed}
                onChange={handleInputChange}
              />

              <label>Peso</label>
              <input
                type="text"
                name="weight"
                placeholder="Peso de la mascota"
                value={newRecord.weight}
                onChange={handleInputChange}
              />

              <label>Color de Mascota</label>
              <input
                type="text"
                name="color"
                placeholder="Color de la mascota"
                value={newRecord.color}
                onChange={handleInputChange}
              />

              <label>Donante de Sangre</label>
              <select
                name="bloodDonor"
                value={newRecord.bloodDonor}
                onChange={handleInputChange}
              >
                <option value="">Seleccionar opción</option>
                {bloodDonorOptions.map((b, idx) => (
                  <option key={idx} value={b}>
                    {b}
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

              {/* Campo de Vacuna */}
              <label>Vacuna</label>
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

              {/* Campo de CC */}
              <label>CC a aplicar</label>
              <input
                type="text"
                name="ccToApply"
                placeholder="CC a aplicar"
                value={newRecord.ccToApply}
                onChange={handleInputChange}
              />

              <div className="modal-buttons unified-buttons">
                <button
                  className="btn-cancel"
                  onClick={() => {
                    setShowModal(false);
                    setEditingRecord(null);
                    setImagePreview([]);
                  }}
                >
                  Cancelar
                </button>

                <button className="btn-primary" onClick={handleAddOrUpdateRecord}>
                  Guardar
                </button>

                <label className="btn-export">
                  Importar Imagen
                  <input
                    type="file"
                    multiple
                    style={{ display: "none" }}
                    onChange={handleExportImage}
                  />
                </label>
              </div>

              {imagePreview.length > 0 && (
                <div className="image-gallery">
                  {imagePreview.map((img, idx) => (
                    <div key={idx} className="image-container">
                      <img
                        src={img}
                        alt="Preview"
                        className="image-preview"
                        onClick={() => setFullScreenImage(img)}
                      />
                      <button
                        className="delete-image-btn"
                        onClick={() => handleDeleteImage("new", img)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {deleteImageModal && (
        <div className="modal-overlay">
          <div className="delete-confirmation">
            <h3>¿Eliminar Imagen?</h3>
            <div>
              <button className="btn-accept" onClick={confirmDeleteImage}>
                Aceptar
              </button>
              <button
                className="btn-cancel-delete"
                onClick={() => setDeleteImageModal(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicalRecords;

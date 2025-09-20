// src/components/Inventory.js
import React, { useState } from "react";
import "../CSS/Inventory.css";

const sanitizeIntegerString = (str) => {
  if (typeof str !== "string") return str;
  return str.replace(/[^\d-]/g, "");
};

const sanitizeFloatString = (str) => {
  if (typeof str !== "string") return str;
  const cleaned = str.replace(/[^0-9.\-]/g, "");
  const parts = cleaned.split(".");
  if (parts.length <= 2) return cleaned;
  return parts.shift() + "." + parts.join("");
};

const Inventory = () => {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    category: "",
    quantity: "",
    price: "",
    minStock: "",
    provider: "",
    purchaseDate: "",
    expiryDate: "",
  });

  const totalProducts = items.length;
  const stockLow = items.filter((i) => Number(i.quantity) <= Number(i.minStock)).length;
  const expired = items.filter(
    (i) => i.expiryDate && new Date(i.expiryDate) < new Date()
  ).length;
  const totalValue = items.reduce(
    (sum, i) => sum + (parseFloat(i.price) || 0) * (Number(i.quantity) || 0),
    0
  );

  const filteredItems = items.filter((i) =>
    i.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const openNew = () => {
    setEditingId(null);
    setForm({
      name: "",
      category: "",
      quantity: "",
      price: "",
      minStock: "",
      provider: "",
      purchaseDate: "",
      expiryDate: "",
    });
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setForm({
      name: item.name ?? "",
      category: item.category ?? "",
      quantity:
        item.quantity !== undefined && item.quantity !== null
          ? String(item.quantity)
          : "",
      price: item.price != null ? String(item.price) : "",
      minStock:
        item.minStock !== undefined && item.minStock !== null
          ? String(item.minStock)
          : "",
      provider: item.provider ?? "",
      purchaseDate: item.purchaseDate ?? "",
      expiryDate: item.expiryDate ?? "",
    });
    setShowModal(true);
  };

  const handleCancel = () => {
    setShowModal(false);
    setEditingId(null);
    setForm({
      name: "",
      category: "",
      quantity: "",
      price: "",
      minStock: "",
      provider: "",
      purchaseDate: "",
      expiryDate: "",
    });
  };

  const handleSave = (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      alert("El nombre es obligatorio.");
      return;
    }
    if (!form.category.trim()) {
      alert("La categoría es obligatoria.");
      return;
    }

    const qStr = sanitizeIntegerString(String(form.quantity).trim());
    const pStr = sanitizeFloatString(String(form.price).trim());
    const msStr = sanitizeIntegerString(String(form.minStock).trim());

    const quantity = qStr === "" ? NaN : parseInt(qStr, 10);
    const price = pStr === "" ? "" : pStr; // 👉 guardar como string exacto
    const minStock = msStr === "" ? NaN : parseInt(msStr, 10);

    if (Number.isNaN(quantity) || price === "" || Number.isNaN(minStock)) {
      alert("Cantidad, precio y stock mínimo deben ser números válidos.");
      return;
    }

    const payload = {
      name: form.name.trim(),
      category: form.category.trim(),
      quantity,
      price, // 👉 string guardado tal cual
      minStock,
      provider: form.provider.trim() || "",
      purchaseDate: form.purchaseDate || "",
      expiryDate: form.expiryDate || "",
    };

    if (editingId) {
      setItems((prev) =>
        prev.map((it) => (it.id === editingId ? { ...it, ...payload } : it))
      );
      setEditingId(null);
    } else {
      const newItem = {
        id: Date.now() + Math.floor(Math.random() * 1000),
        ...payload,
      };
      setItems((prev) => [...prev, newItem]);
    }

    handleCancel();
  };

  const handleDelete = (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este producto?")) return;
    setItems((prev) => prev.filter((it) => it.id !== id));
    if (editingId === id) handleCancel();
  };

  return (
    <div className="inventory-container">
      <h2>Inventario</h2>
      <p className="subtitle">Gestión de medicamentos y productos médicos.</p>

      {/* Resumen */}
      <div className="summary-cards">
        <div className="card info">
          <span className="icon">📦</span>
          <div>
            <h3>{totalProducts}</h3>
            <p>Total de productos</p>
          </div>
        </div>

        <div className="card warning">
          <span className="icon">⚠️</span>
          <div>
            <h3>{stockLow}</h3>
            <p>Stock Bajo</p>
          </div>
        </div>

        <div className="card danger">
          <span className="icon">📅</span>
          <div>
            <h3>{expired}</h3>
            <p>Vencidos</p>
          </div>
        </div>

        <div className="card success">
          <span className="icon">💰</span>
          <div>
            <h3>L. {totalValue.toFixed(2)}</h3>
            <p>Valor total</p>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="toolbar">
        <input
          type="text"
          placeholder="Buscar productos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="inventory-btn add" onClick={openNew}>
          + Nuevo Producto
        </button>
      </div>

      {/* Tabla */}
      <table className="inventory-table">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Categoría</th>
            <th>Cantidad</th>
            <th>Precio Unidad</th>
            <th>Proveedor</th>
            <th>Vencimiento</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredItems.length === 0 ? (
            <tr>
              <td colSpan="8">No hay productos registrados</td>
            </tr>
          ) : (
            filteredItems.map((item) => {
              const isLow = Number(item.quantity) <= Number(item.minStock);
              const isExpired =
                item.expiryDate && new Date(item.expiryDate) < new Date();
              return (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.category}</td>
                  <td>{item.quantity}</td>
                  <td>L. {parseFloat(item.price || 0).toFixed(2)}</td>
                  <td>{item.provider || "—"}</td>
                  <td className={isExpired ? "expired" : ""}>
                    {item.expiryDate || "—"}
                  </td>
                  <td>
                    {isExpired ? (
                      <span className="status danger">Vencido</span>
                    ) : isLow ? (
                      <span className="status warning">Stock bajo</span>
                    ) : (
                      <span className="status success">Disponible</span>
                    )}
                  </td>
                  <td className="inventory-actions">
                    <button
                      className="inventory-btn edit"
                      onClick={() => handleEdit(item)}
                    >
                      ✏️
                    </button>
                    <button
                      className="inventory-btn delete"
                      onClick={() => handleDelete(item.id)}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{editingId ? "Editar producto" : "Registrar nuevo producto"}</h3>
            <form className="modal-form" onSubmit={handleSave}>
              <div className="form-row">
                <label>Nombre *</label>
                <input name="name" value={form.name} onChange={handleChange} />
              </div>
              <div className="form-row">
                <label>Categoría *</label>
                <input
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                />
              </div>
              <div className="form-row">
                <label>Cantidad *</label>
                <input
                  name="quantity"
                  type="number"
                  inputMode="numeric"
                  value={form.quantity}
                  onChange={handleChange}
                />
              </div>
              <div className="form-row">
                <label>Precio (Lps) *</label>
                <input
                  name="price"
                  type="text"
                  inputMode="decimal"
                  value={form.price}
                  onChange={handleChange}
                />
              </div>
              <div className="form-row">
                <label>Stock mínimo *</label>
                <input
                  name="minStock"
                  type="number"
                  inputMode="numeric"
                  value={form.minStock}
                  onChange={handleChange}
                />
              </div>
              <div className="form-row">
                <label>Proveedor</label>
                <input
                  name="provider"
                  value={form.provider}
                  onChange={handleChange}
                />
              </div>
              <div className="form-row">
                <label>Fecha de compra</label>
                <input
                  name="purchaseDate"
                  type="date"
                  value={form.purchaseDate}
                  onChange={handleChange}
                />
              </div>
              <div className="form-row">
                <label>Fecha de vencimiento</label>
                <input
                  name="expiryDate"
                  type="date"
                  value={form.expiryDate}
                  onChange={handleChange}
                />
              </div>

              <div className="modal-actions">
                <button type="submit" className="inventory-btn add">
                  {editingId ? "Actualizar" : "Guardar"}
                </button>
                <button
                  type="button"
                  className="inventory-btn delete"
                  onClick={handleCancel}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;

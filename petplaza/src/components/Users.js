import React, { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2, User, Mail, Shield, Eye, EyeOff, ShieldCheck, Stethoscope, FlaskConical, Package, Users as UsersIcon, } from "lucide-react";
import "../CSS/Users.css";

const Users = () => {
  const [users, setUsers] = useState([
    {
      id: 1,
      username: "admin",
      full_name: "Administrador PetPlaza",
      email: "admin@petplaza.com",
      role: "admin",
      is_active: true,
    },
    {
      id: 2,
      username: "veterinario1",
      full_name: "Dr. María Elena García",
      email: "vet1@petplaza.com",
      role: "veterinario",
      is_active: true,
    },
    {
      id: 3,
      username: "laboratorio1",
      full_name: "Ana Sofía Martínez",
      email: "lab1@petplaza.com",
      role: "laboratorio",
      is_active: true,
    },
    {
      id: 4,
      username: "farmacia1",
      full_name: "Carlos Roberto López",
      email: "farm1@petplaza.com",
      role: "farmacia",
      is_active: true,
    },
    {
      id: 5,
      username: "recepcion1",
      full_name: "Lucía Isabel Hernández",
      email: "recep1@petplaza.com",
      role: "recepcion",
      is_active: true,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    full_name: "",
    email: "",
    role: "",
    password: "",
  });

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isClosingConfirm, setIsClosingConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [confirmClass, setConfirmClass] = useState("");

  const roles = [
    {
      value: "admin",
      label: "Administradores",
      color: "#ef4444",
      icon: <ShieldCheck size={20} />,
    },
    {
      value: "veterinario",
      label: "Doctores",
      color: "#3b82f6",
      icon: <Stethoscope size={20} />,
    },
    {
      value: "laboratorio",
      label: "Laboratorio",
      color: "#8b5cf6",
      icon: <FlaskConical size={20} />,
    },
    {
      value: "farmacia",
      label: "Personal de Inventario",
      color: "#10b981",
      icon: <Package size={20} />,
    },
    {
      value: "recepcion",
      label: "Recepción",
      color: "#f97316",
      icon: <UsersIcon size={20} />,
    },
  ];

  /* ===== FUNCIONES MODAL PRINCIPAL ===== */
  const handleCloseModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowModal(false);
      setIsClosing(false);
      setEditingUser(null);
      setFormData({
        username: "",
        full_name: "",
        email: "",
        role: "",
        password: "",
      });
    }, 300);
  };

  useEffect(() => {
    if (showModal) {
      const timer = setTimeout(() => {
        document.querySelector(".modal")?.classList.add("open");
        document.querySelector(".modal-overlay")?.classList.add("open");
      }, 10);
      return () => clearTimeout(timer);
    }
  }, [showModal]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingUser) {
      setUsers(
        users.map((u) =>
          u.id === editingUser.id ? { ...u, ...formData } : u
        )
      );
    } else {
      setUsers([...users, { ...formData, id: Date.now(), is_active: true }]);
    }
    handleCloseModal();
  };

  const handleEdit = (userToEdit) => {
    setEditingUser(userToEdit);
    setFormData(userToEdit);
    setShowModal(true);
  };

  /* ===== FUNCIONES MODAL DE CONFIRMACIÓN ===== */
  useEffect(() => {
    if (showConfirmModal) {
      const timer = setTimeout(() => setConfirmClass("open"), 10);
      return () => clearTimeout(timer);
    } else {
      setConfirmClass("");
    }
  }, [showConfirmModal]);

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setShowConfirmModal(true);
  };

  const confirmDelete = () => {
    setUsers(users.filter((u) => u.id !== userToDelete.id));
    closeConfirmModal();
  };

  const cancelDelete = () => {
    closeConfirmModal();
  };

  const closeConfirmModal = () => {
    setIsClosingConfirm(true);
    setTimeout(() => {
      setShowConfirmModal(false);
      setIsClosingConfirm(false);
      setUserToDelete(null);
    }, 300);
  };

  const toggleStatus = (id) => {
    setUsers(
      users.map((u) =>
        u.id === id ? { ...u, is_active: !u.is_active } : u
      )
    );
  };

  const filteredUsers = users.filter(
    (u) =>
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleStyle = (role) => {
    const foundRole = roles.find((r) => r.value === role);
    return foundRole
      ? { backgroundColor: `${foundRole.color}20`, color: foundRole.color }
      : {};
  };

  return (
    <div className="users-container">
      {/* Header */}
      <div className="users-header">
        <div>
          <h1 className="users-title">
            <UsersIcon size={22} /> Gestión de Usuarios
          </h1>
          <p className="users-subtitle">
            Administrar roles y permisos del personal
          </p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} /> Nuevo Usuario
        </button>
      </div>

      {/* Estadísticas */}
      <div className="stats-grid">
        {roles.map((r) => (
          <div className="stats-card" key={r.value}>
            <div className="stats-icon" style={{ color: r.color }}>
              {r.icon}
            </div>
            <div>
              <p className="stats-number">
                {users.filter((u) => u.role === r.value).length}
              </p>
              <p className="stats-label">{r.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Buscador */}
      <div className="search-box">
        <Search className="search-icon" />
        <input
          type="text"
          placeholder="Buscar por nombre, usuario, email o rol"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Tabla */}
      <div className="table-wrapper">
        <table className="users-table">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Nombre Completo</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((u) => (
              <tr key={u.id}>
                <td>
                  <User size={16} style={{ marginRight: 6 }} /> @{u.username}
                </td>
                <td>{u.full_name}</td>
                <td>
                  <Mail size={16} style={{ marginRight: 6 }} /> {u.email}
                </td>
                <td>
                  <span
                    className="role-badge"
                    style={getRoleStyle(u.role)}
                  >
                    <Shield size={14} style={{ marginRight: 4 }} />{" "}
                    {roles.find((r) => r.value === u.role)?.label}
                  </span>
                </td>
                <td>
                  <button
                    className={`status-btn ${
                      u.is_active ? "active" : "inactive"
                    }`}
                    onClick={() => toggleStatus(u.id)}
                  >
                    {u.is_active ? "Activo" : "Inactivo"}
                  </button>
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="action-btn edit"
                      onClick={() => handleEdit(u)}
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      className="action-btn delete"
                      onClick={() => handleDeleteClick(u)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Nuevo/Editar */}
      {showModal && (
        <div
          className={`modal-overlay ${isClosing ? "closing" : ""}`}
        >
          <div className={`modal ${isClosing ? "closing" : ""}`}>
            <h2>{editingUser ? "Editar Usuario" : "Nuevo Usuario"}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nombre de Usuario</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  required
                  disabled={editingUser}
                />
              </div>
              <div className="form-group">
                <label>Nombre Completo</label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) =>
                    setFormData({ ...formData, full_name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Rol</label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  required
                >
                  <option value="">Seleccionar rol</option>
                  {roles.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group password-field">
                <label>Contraseña</label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required={!editingUser}
                  minLength="6"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
                </button>
              </div>
              <p className="password-hint">
                La contraseña debe tener al menos 6 caracteres
              </p>
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={handleCloseModal}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  {editingUser ? "Actualizar" : "Crear Usuario"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Confirmación Eliminar */}
      {showConfirmModal && (
        <div
          className={`modal-overlay ${
            isClosingConfirm ? "closing" : confirmClass
          }`}
        >
          <div
            className={`modal ${
              isClosingConfirm ? "closing" : confirmClass
            }`}
          >
            <h3>¿Deseas eliminar este usuario?</h3>
            <p style={{ textAlign: "center", marginBottom: "1rem" }}>
              {userToDelete?.full_name}
            </p>
            <div
              className="modal-actions"
              style={{ justifyContent: "center", gap: "1rem" }}
            >
              <button className="confirm-btn" onClick={confirmDelete}>
                Sí, Eliminar
              </button>
              <button className="cancel-btn" onClick={cancelDelete}>
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;

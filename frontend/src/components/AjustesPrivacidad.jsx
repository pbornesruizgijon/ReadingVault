import { useState } from "react";
// Asumimos que reutilizas el mismo CSS para mantener consistencia
// import "../styles/Ajustes.css";

export default function AjustesPrivacidad({ user }) {
  // Estado para controlar los selectores (lo ideal sería cargarlo de la DB)
  const [privacidad, setPrivacidad] = useState({
    perfil: "Público",
    libros: "Público",
    amigos: "Público",
    datosPersonales: "Privado", // Por defecto, datos sensibles privados
  });

  const handleChange = (e) => {
    setPrivacidad({
      ...privacidad,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://localhost:8080/api/usuarios/${user.idUsuario}/privacidad`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(privacidad), // Enviamos el objeto con los 4 ajustes
        },
      );

      if (response.ok) {
        const actualizado = await response.json();
        localStorage.setItem("usuario", JSON.stringify(actualizado));
        alert("Preferencias de privacidad actualizadas");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleBorrarCuenta = async () => {
    // Primera confirmación
    const confirmar = window.confirm(
      "¿ESTÁS SEGURO? Esta acción es irreversible y perderás todos tus libros, reseñas y seguidores.",
    );

    if (!confirmar) return;

    // Segunda confirmación (escribir palabra clave para evitar accidentes)
    const palabraClave = window.prompt("Para confirmar, escribe ELIMINAR:");

    if (palabraClave !== "ELIMINAR") {
      alert("La palabra clave no coincide. Acción cancelada.");
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://localhost:8080/api/usuarios/${user.idUsuario}/eliminar`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.ok) {
        alert("Tu cuenta ha sido eliminada. Lamentamos verte partir.");

        // 1. Limpiamos toda la sesión del navegador
        localStorage.clear();

        // 2. Redirigimos al inicio o registro
        window.location.href = "/";
      } else {
        const error = await response.text();
        alert("Error al eliminar la cuenta: " + error);
      }
    } catch (error) {
      console.error("Error de red:", error);
      alert("Error de conexión con el servidor.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="row g-4">
      {/* COLUMNA IZQUIERDA: CONFIGURACIÓN */}
      <div className="col-lg-8">
        <div className="ajustes-form-container h-100">
          <h4
            className="mb-2 fw-bold"
            style={{ fontFamily: "var(--font-titulos)" }}
          >
            Privacidad
          </h4>
          <p className="text-muted small mb-4">
            Controla quién puede ver tu actividad y datos en la comunidad.
          </p>

          <div className="row g-4">
            {/* 1. Mi Perfil */}
            <div className="col-12">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <label className="label-ajustes mb-0">
                  Visibilidad del perfil
                </label>
                <select
                  name="perfil"
                  className="form-select form-select-sm w-auto shadow-sm"
                  value={privacidad.perfil}
                  onChange={handleChange}
                  style={{ borderColor: "var(--accent)" }}
                >
                  <option>Público</option>
                  <option>Solo Amigos</option>
                  <option>Privado</option>
                </select>
              </div>
              <p className="small text-muted ps-1">
                Tu perfil de la comunidad incluye tu lista de amigos, los
                logros, las estanterías y los comentarios.
              </p>
            </div>

            {/* 2. Mis Libros */}
            <div className="col-12">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <label className="label-ajustes mb-0">
                  Mis libros y estanterías
                </label>
                <select
                  name="libros"
                  className="form-select form-select-sm w-auto shadow-sm"
                  value={privacidad.libros}
                  onChange={handleChange}
                  style={{ borderColor: "var(--accent)" }}
                >
                  <option>Público</option>
                  <option>Solo Amigos</option>
                  <option>Privado</option>
                </select>
              </div>
              <p className="small text-muted ps-1">
                Esta categoría incluye la lista de todos tus libros y tus
                estanterías de tu cuenta de ReadingVault.
              </p>
            </div>

            {/* 3. Lista de Amigos */}
            <div className="col-12">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <label className="label-ajustes mb-0">Lista de amigos</label>
                <select
                  name="amigos"
                  className="form-select form-select-sm w-auto shadow-sm"
                  value={privacidad.amigos}
                  onChange={handleChange}
                  style={{ borderColor: "var(--accent)" }}
                >
                  <option>Público</option>
                  <option>Solo Amigos</option>
                  <option>Privado</option>
                </select>
              </div>
              <p className="small text-muted ps-1">
                Esto controla quién puede ver tu lista de amigos en tu perfil.
              </p>
            </div>

            {/* 4. Datos Personales */}
            <div className="col-12">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <label className="label-ajustes mb-0">
                  Datos personales sensibles
                </label>
                <select
                  name="datosPersonales"
                  className="form-select form-select-sm w-auto shadow-sm"
                  value={privacidad.datosPersonales}
                  onChange={handleChange}
                  style={{ borderColor: "var(--accent)" }}
                >
                  <option>Público</option>
                  <option>Solo Amigos</option>
                  <option>Privado</option>
                </select>
              </div>
              <p className="small text-muted ps-1">
                Incluye tu nombre real, apellidos, ciudad y fecha de nacimiento
                completa.
              </p>
            </div>
          </div>

          <div className="text-center mt-5">
            <button type="submit" className="btn-vault px-5 py-2 shadow">
              Guardar preferencias de privacidad
            </button>
          </div>
        </div>
      </div>

      {/* COLUMNA DERECHA: INFO Y ZONA DE PELIGRO */}
      <div className="col-lg-4 text-center">
        <div className="perfil-card p-4 h-100 d-flex flex-column align-items-center justify-content-between">
          <div>
            <h5 className="sidebar-titulo-ajustes mb-3">Tu Cuenta</h5>
            <div
              className="foto-perfil-circulo mb-3 bg-light d-flex align-items-center justify-content-center shadow-sm mx-auto"
              style={{ width: "120px", height: "120px" }}
            >
              <i
                className="bi bi-shield-lock-fill text-muted"
                style={{ fontSize: "3rem" }}
              ></i>
            </div>
            <p className="small text-muted mt-3">
              Recuerda que estas configuraciones son reversibles en cualquier
              momento. ReadingVault se compromete a proteger tus datos.
            </p>
          </div>

          {/* Mover Borrar Cuenta aquí */}
          <div className="zona-peligro w-100">
            <p className="small text-muted">Gestión avanzada de la cuenta</p>
            <button
              type="button"
              className="btn btn-danger btn-sm w-100 shadow-sm fw-bold"
              onClick={handleBorrarCuenta}
            >
              <i className="bi bi-trash3-fill me-2"></i>
              Borrar mi cuenta definitivamente
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

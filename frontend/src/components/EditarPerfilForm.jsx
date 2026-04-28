import { useState, useEffect, useRef } from "react";
// No olvides importar el CSS si lo creas aparte
// import "../styles/Ajustes.css";

export default function EditarPerfilForm({ user }) {
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    nombre: "",
    apellidos: "",
    fechaNacimiento: "",
    localidad: "",
    biografia: "",
    nombreUsuario: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.nombre || "",
        apellidos: user.apellidos || "",
        fechaNacimiento: user.fechaNacimiento || "",
        localidad: user.localidad || "",
        biografia: user.biografia || "",
        nombreUsuario: user.nombreUsuario || "",
        email: user.email || "",
        password: "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Funcion para subir la foto
  const handleFotoChange = async (e) => {
    const archivo = e.target.files[0];
    if (!archivo) return;

    // Validar que sean solo imágenes
    if (!archivo.type.startsWith("image/")) {
      alert("Por favor, selecciona una imagen válida (jpg, png).");
      return;
    }

    const token = localStorage.getItem("token");

    //  Para enviar archivos usamos FormData
    const formDataFoto = new FormData();
    formDataFoto.append("foto", archivo); // El nombre "foto" debe coincidir con @RequestParam("foto") en Java

    try {
      const response = await fetch(
        `http://localhost:8080/api/usuarios/${user.idUsuario}/actualizar-foto`,
        {
          method: "POST", // Usamos POST para el multipart
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formDataFoto,
        },
      );

      if (response.ok) {
        const data = await response.json();

        // Actualizar el LocalStorage
        const userSesion = JSON.parse(localStorage.getItem("usuario"));
        userSesion.fotoPerfil = data.fotoPerfil;
        localStorage.setItem("usuario", JSON.stringify(userSesion));

        // Actualizar el estado local para que la foto cambie en la pantalla actual

        alert("¡Foto de perfil actualizada!");

        // Recargar para ver los cambios en todas partes
        window.location.reload();
      } else {
        alert("Error al subir la foto.");
      }
    } catch (error) {
      console.error("Error de red:", error);
    }
  };

  const handleEliminarFoto = async () => {
    if (
      !window.confirm(
        "¿Estás seguro de que quieres eliminar tu foto de perfil?",
      )
    )
      return;

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://localhost:8080/api/usuarios/${user.idUsuario}/eliminar-foto`,
        {
          method: "POST", 
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.ok) {
        const data = await response.json();

        // Actualizar el LocalStorage para que el resto de la web vea la imagen por defecto
        const userSesion = JSON.parse(localStorage.getItem("usuario"));
        userSesion.fotoPerfil = data.fotoPerfil;
        localStorage.setItem("usuario", JSON.stringify(userSesion));

        alert("Foto eliminada correctamente");

        // Recargar para refrescar la UI
        window.location.reload();
      } else {
        alert("No se pudo eliminar la foto.");
      }
    } catch (error) {
      console.error("Error de red:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const idUsuario = user.idUsuario; // Sacamos el ID del usuario actual

    try {
      const response = await fetch(
        `http://localhost:8080/api/usuarios/${idUsuario}/actualizar`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        },
      );

      if (response.ok) {
        const usuarioActualizado = await response.json();

        // Actualizamos el localStorage para que el resto de la web
        // vea los cambios sin tener que cerrar sesión.
        localStorage.setItem("usuario", JSON.stringify(usuarioActualizado));

        alert("¡Perfil actualizado con éxito!");

        // Redirigir al perfil para ver los cambios
        window.location.href = "/perfilUsuario";
      } else {
        const errorText = await response.text();
        alert("Error al actualizar: " + errorText);
      }
    } catch (error) {
      console.error("Error de red:", error);
      alert("No se pudo conectar con el servidor.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="row g-4">
      {/* COLUMNA IZQUIERDA */}
      <div className="col-lg-8">
        <div className="ajustes-form-container">
          <h4 className="mb-4 fw-bold">Datos Personales</h4>

          <div className="row g-3">
            <div className="col-md-6">
              <label className="label-ajustes">Nombre</label>
              <input
                type="text"
                name="nombre"
                className="form-control"
                value={formData.nombre}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <label className="label-ajustes">Apellidos</label>
              <input
                type="text"
                name="apellidos"
                className="form-control"
                value={formData.apellidos}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <label className="label-ajustes">Fecha de Nacimiento</label>
              <input
                type="date"
                name="fechaNacimiento"
                className="form-control"
                value={formData.fechaNacimiento}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <label className="label-ajustes">Ciudad/Localidad</label>
              <input
                type="text"
                name="localidad"
                className="form-control"
                value={formData.localidad}
                onChange={handleChange}
              />
            </div>
            <div className="col-12">
              <label className="label-ajustes">Sobre mí (Biografía)</label>
              <textarea
                name="biografia"
                className="form-control"
                rows="3"
                value={formData.biografia}
                onChange={handleChange}
              ></textarea>
            </div>

            <h4 className="mt-5 mb-3 fw-bold">Credenciales y Acceso</h4>
            <div className="col-md-6">
              <label className="label-ajustes">Nombre de usuario</label>
              <input
                type="text"
                name="nombreUsuario"
                className="form-control"
                value={formData.nombreUsuario}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <label className="label-ajustes">Correo Electrónico</label>
              <input
                type="email"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-12">
              <label className="label-ajustes">Nueva Contraseña</label>
              <input
                type="password"
                name="password"
                className="form-control"
                placeholder="Dejar en blanco para no cambiar"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="text-center mt-5">
            <button type="submit" className="btn-vault px-5 py-2 shadow">
              Guardar cambios
            </button>
          </div>
        </div>
      </div>

      {/* COLUMNA DERECHA */}
      <div className="col-lg-4 text-center">
        <div className="perfil-card p-4 h-100 d-flex flex-column align-items-center">
          <h5 className="sidebar-titulo-ajustes">Foto de Perfil</h5>

          {/* Input de archivo oculto */}
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFotoChange}
            accept="image/*"
          />
          <img
            src={
              user?.fotoPerfil ||
              "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }
            className="foto-perfil-circulo mb-3"
            alt="Perfil"
          />

          <div className="d-grid gap-2 w-100">
            <button
              type="button"
              className="btn btn-sm btn-outline-primary"
              onClick={() => fileInputRef.current.click()} // Simula clic en el input oculto
            >
              Cambiar Foto
            </button>
            <button type="button" className="btn btn-sm btn-outline-danger" onClick={handleEliminarFoto}>
              Eliminar Foto
            </button>
          </div>

          
        </div>
      </div>
    </form>
  );
}

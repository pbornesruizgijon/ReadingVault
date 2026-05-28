import { useState, useEffect, useRef } from "react";
import AvatarEditor from "react-avatar-editor";
import Swal from 'sweetalert2';
import "../assets/css/ajustes.css"; 

export default function EditarPerfilForm({ user }) {
  const fileInputRef = useRef(null);
  const editorRef = useRef(null);

  // --- ESTADOS ---
  const [mensaje, setMensaje] = useState({ texto: "", tipo: "" });
  const [cargandoSubida, setCargandoSubida] = useState(false);
  const [imagenOriginal, setImagenOriginal] = useState(null);
  const [zoom, setZoom] = useState(1.2);
  const [fotoPrevisualizacion, setFotoPrevisualizacion] = useState(null);

  const [formData, setFormData] = useState({
    nombre: "", apellidos: "", fechaNacimiento: "", localidad: "",
    biografia: "", nombreUsuario: "", email: "", password: "",
  });

  // Notificación tipo Toast
  const mostrarNotificacion = (texto, tipo) => {
    setMensaje({ texto, tipo });
    setTimeout(() => setMensaje({ texto: "", tipo: "" }), 3500);
  };

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
      setFotoPrevisualizacion(user.fotoPerfil);
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- GESTIÓN DE FOTO ---
  const handleFotoChange = (e) => {
    const archivo = e.target.files[0];
    if (!archivo) return;
    if (!archivo.type.startsWith("image/")) {
      mostrarNotificacion("Por favor, selecciona una imagen válida", "error");
      return;
    }
    setImagenOriginal(archivo);
    e.target.value = ""; 
  };

  const handleGuardarRecorte = async () => {
    if (editorRef.current) {
      setCargandoSubida(true);
      const canvas = editorRef.current.getImageScaledToCanvas();

      canvas.toBlob(async (blob) => {
        if (!blob) {
          setCargandoSubida(false);
          return;
        }

        const token = localStorage.getItem("token");
        const formDataFoto = new FormData();
        formDataFoto.append("foto", blob, "perfil.jpg"); 

        try {
          const response = await fetch(
            `http://localhost:8080/api/usuarios/${user.idUsuario}/actualizar-foto`,
            {
              method: "POST",
              headers: { Authorization: `Bearer ${token}` },
              body: formDataFoto,
            }
          );

          if (response.ok) {
            const data = await response.json();
            const userSesion = JSON.parse(localStorage.getItem("usuario"));
            userSesion.fotoPerfil = data.fotoPerfil;
            localStorage.setItem("usuario", JSON.stringify(userSesion));

            setFotoPrevisualizacion(data.fotoPerfil);
            setImagenOriginal(null);
            mostrarNotificacion("¡Foto de perfil actualizada con éxito!", "success");
          } else {
            mostrarNotificacion("Error al subir la foto al servidor", "error");
          }
        } catch (error) {
          mostrarNotificacion("Error de conexión con el servidor", "error");
        } finally {
          setCargandoSubida(false);
        }
      }, "image/jpeg", 0.8);
    }
  };

  const handleEliminarFoto = async () => {
    // Lanzamos el SweetAlert pidiendo confirmación
    const confirmacion = await Swal.fire({
      title: '¿Eliminar foto?',
      text: "¿Estás seguro de que quieres quitar tu foto de perfil?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33', 
      cancelButtonColor: '#4B5043', 
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      borderRadius: '15px'
    });

    // Si el usuario cierra el modal o le da a cancelar, cortamos la función aquí
    if (!confirmacion.isConfirmed) return;
    
    // Si ha dicho que sí, ejecutamos el borrado
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://localhost:8080/api/usuarios/${user.idUsuario}/eliminar-foto`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        const userSesion = JSON.parse(localStorage.getItem("usuario"));
        userSesion.fotoPerfil = data.fotoPerfil;
        localStorage.setItem("usuario", JSON.stringify(userSesion));
        setFotoPrevisualizacion(data.fotoPerfil);
        mostrarNotificacion("Foto de perfil eliminada", "success");
      }
    } catch (error) {
      mostrarNotificacion("No se pudo eliminar la foto", "error");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://localhost:8080/api/usuarios/${user.idUsuario}/actualizar`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("usuario", JSON.stringify(data));
        mostrarNotificacion("¡Datos actualizados correctamente!", "success");
      } else {
        mostrarNotificacion("Error al guardar los cambios", "error");
      }
    } catch (error) {
      mostrarNotificacion("Error de red al actualizar perfil", "error");
    }
  };

  const FOTO_DEFAULT = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  return (
    <>
      {/* SISTEMA DE NOTIFICACIÓN FLOTANTE */}
      {mensaje.texto && (
        <div className={`vault-toast vault-toast--${mensaje.tipo}`}>
          {mensaje.tipo === "success" ? <i className="bi bi-check-circle-fill me-2"></i> : <i className="bi bi-exclamation-triangle-fill me-2"></i>}
          {mensaje.texto}
        </div>
      )}

      <form onSubmit={handleSubmit} className="row g-4">
        {/* COLUMNA IZQUIERDA: DATOS */}
        <div className="col-lg-8">
          <div className="ajustes-form-container">
            <h4 className="mb-4 fw-bold">Datos Personales</h4>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="label-ajustes">Nombre</label>
                <input type="text" name="nombre" className="form-control" value={formData.nombre} onChange={handleChange} />
              </div>
              <div className="col-md-6">
                <label className="label-ajustes">Apellidos</label>
                <input type="text" name="apellidos" className="form-control" value={formData.apellidos} onChange={handleChange} />
              </div>
              <div className="col-md-6">
                <label className="label-ajustes">Fecha de Nacimiento</label>
                <input type="date" name="fechaNacimiento" className="form-control" value={formData.fechaNacimiento} onChange={handleChange} />
              </div>
              <div className="col-md-6">
                <label className="label-ajustes">Ciudad/Localidad</label>
                <input type="text" name="localidad" className="form-control" value={formData.localidad} onChange={handleChange} />
              </div>
              <div className="col-12">
                <label className="label-ajustes">Sobre mí (Biografía)</label>
                <textarea name="biografia" className="form-control" rows="3" value={formData.biografia} onChange={handleChange}></textarea>
              </div>

              <h4 className="mt-5 mb-3 fw-bold">Credenciales y Acceso</h4>
              <div className="col-md-6">
                <label className="label-ajustes">Nombre de usuario</label>
                <input type="text" name="nombreUsuario" className="form-control" value={formData.nombreUsuario} onChange={handleChange} />
              </div>
              <div className="col-md-6">
                <label className="label-ajustes">Correo Electrónico</label>
                <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} />
              </div>
              <div className="col-md-12">
                <label className="label-ajustes">Nueva Contraseña</label>
                <input type="password" name="password" className="form-control" placeholder="Dejar en blanco para no cambiar" value={formData.password} onChange={handleChange} />
              </div>
            </div>

            <div className="text-center mt-5">
              <button type="submit" className="btn-vault px-5 py-2 shadow">Guardar cambios</button>
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: FOTO */}
        <div className="col-lg-4 text-center">
          <div className="perfil-card p-4 h-100 d-flex flex-column align-items-center">
            <h5 className="sidebar-titulo-ajustes">Foto de Perfil</h5>
            <input type="file" ref={fileInputRef} style={{ display: "none" }} onChange={handleFotoChange} accept="image/*" />
            <img src={fotoPrevisualizacion || FOTO_DEFAULT} className="foto-perfil-circulo mb-3" alt="Perfil" style={{ objectFit: 'cover', width: '150px', height: '150px', borderRadius: '50%' }} />
            <div className="d-grid gap-2 w-100">
              <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => fileInputRef.current.click()}>Cambiar Foto</button>
              <button type="button" className="btn btn-sm btn-outline-danger" onClick={handleEliminarFoto}>Eliminar Foto</button>
            </div>
          </div>
        </div>
      </form>

      {/* MODAL DE RECORTE */}
      {imagenOriginal && (
        <div className="crop-modal-overlay">
          <div className="crop-modal-content">
            <h4 className="mb-2">Ajusta tu foto</h4>
            <div className="editor-wrapper d-inline-block border bg-light mb-3">
              <AvatarEditor ref={editorRef} image={imagenOriginal} width={200} height={200} border={50} borderRadius={100} scale={zoom} rotate={0} />
            </div>
            <div className="zoom-control d-flex align-items-center justify-content-center gap-2">
              <i className="bi bi-zoom-out"></i>
              <input type="range" min="1" max="3" step="0.01" value={zoom} onChange={(e) => setZoom(parseFloat(e.target.value))} style={{ width: '200px' }} />
              <i className="bi bi-zoom-in"></i>
            </div>
            <div className="mt-4 gap-2 d-flex justify-content-center">
              <button onClick={() => setImagenOriginal(null)} className="btn btn-outline-secondary" disabled={cargandoSubida}>Cancelar</button>
              <button onClick={handleGuardarRecorte} className="btn btn-primary" disabled={cargandoSubida}>
                {cargandoSubida ? "Subiendo..." : "Aplicar y Subir"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
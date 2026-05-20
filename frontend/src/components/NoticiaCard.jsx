import React, { useState } from "react";
import { Link } from "react-router-dom"; 
import Swal from "sweetalert2";

export default function NoticiaCard({ noticia, esAdmin, onNoticiaModificada }) {
  const libroAsociado = noticia.libro;
  const urlPortada = libroAsociado?.fotoPortada || libroAsociado?.portada;
  const token = localStorage.getItem("token");

  // --- ESTADOS PARA LA EDICIÓN INTERNA ---
  const [editando, setEditando] = useState(false);
  const [nuevoTitulo, setNuevoTitulo] = useState(noticia.titulo);
  const [nuevoContenido, setNuevoContenido] = useState(noticia.contenido);

  // Formateador de fecha nativo (AAAA-MM-DD -> DD/MM/AAAA)
  const formatearFecha = (fechaStr) => {
    if (!fechaStr) return "";
    const partes = fechaStr.split("-");
    return partes.length === 3 ? `${partes[2]}/${partes[1]}/${partes[0]}` : fechaStr;
  };

  // LÓGICA PARA ASIGNAR EL LIBRO ASOCIADO COMO LIBRO DEL AÑO FIJO
  const handleMarcarLibroAnio = (e) => {
    e.preventDefault(); // Evita que el click en el botón active el Link de redirección
    e.stopPropagation(); // Detiene la propagación del evento en el árbol de componentes

    fetch(`http://localhost:8080/api/libros/${libroAsociado.idLibro}/marcar-libro-anio`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` }
    }).then((res) => {
      if (res.ok) {
        Swal.fire({
          title: "¡Libro del Año fijado!",
          text: `"${libroAsociado.titulo}" se ha guardado de forma fija en la sección destacada.`,
          icon: "success",
          timer: 2000,
          showConfirmButton: false
        });
        // Refresca el feed de noticias y la columna derecha en Home.jsx
        if (onNoticiaModificada) onNoticiaModificada(); 
      } else {
        Swal.fire("Error", "No se pudo marcar el libro", "error");
      }
    }).catch((err) => console.error("Error al marcar libro del año:", err));
  };

  // Lógica para enviar el borrado lógico/físico al endpoint DELETE
  const handleEliminar = () => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#650D1B", 
      cancelButtonColor: "#4B5043",
      confirmButtonText: "Sí, borrar",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`http://localhost:8080/api/noticias/${noticia.idNoticia}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` }
        }).then((res) => {
          if (res.ok) {
            Swal.fire("¡Borrada!", "La noticia ha sido eliminada.", "success");
            if (onNoticiaModificada) onNoticiaModificada();
          }
        });
      }
    });
  };

  // Lógica para confirmar los cambios vía PUT
  const handleGuardarEdicion = (e) => {
    e.preventDefault();
    
    fetch(`http://localhost:8080/api/noticias/${noticia.idNoticia}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ titulo: nuevoTitulo, contenido: nuevoContenido })
    }).then((res) => {
      if (res.ok) {
        Swal.fire("¡Actualizada!", "La noticia se ha modificado correctamente.", "success");
        setEditando(false);
        if (onNoticiaModificada) onNoticiaModificada();
      }
    });
  };

  // --- MODO EDICIÓN ---
  if (editando) {
    return (
      <div className="noticia-card mb-4 shadow-sm p-3 bg-white rounded">
        <form onSubmit={handleGuardarEdicion}>
          <div className="mb-2">
            <label className="form-label small fw-bold">Editar Título</label>
            <input type="text" className="form-control form-control-sm" value={nuevoTitulo} onChange={(e) => setNuevoTitulo(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label className="form-label small fw-bold">Editar Contenido</label>
            <textarea className="form-control form-control-sm" rows="3" value={nuevoContenido} onChange={(e) => setNuevoContenido(e.target.value)} required />
          </div>
          <div className="d-flex gap-2 justify-content-end">
            <button type="button" className="btn btn-sm btn-secondary" onClick={() => setEditando(false)}>Cancelar</button>
            <button type="submit" className="btn btn-sm text-white" style={{ backgroundColor: "var(--color-verde-oscuro)" }}>Guardar Cambios</button>
          </div>
        </form>
      </div>
    );
  }

  // --- MODO VISTA ---
  return (
    <div className="noticia-card mb-4 shadow-sm p-3 bg-white rounded position-relative">
      
      {/* Botones flotantes de control de administración (Editar / Borrar Noticia) */}
      {esAdmin && (
        <div className="position-absolute top-0 end-0 mt-2 me-2 d-flex gap-1" style={{ zIndex: 10 }}>
          <button onClick={() => setEditando(true)} className="btn btn-sm btn-light text-primary border-0 shadow-sm" title="Editar noticia">
            <i className="bi bi-pencil-square"></i>
          </button>
          <button onClick={handleEliminar} className="btn btn-sm btn-light text-danger border-0 shadow-sm" title="Eliminar noticia">
            <i className="bi bi-trash"></i>
          </button>
        </div>
      )}

      {/* TÍTULO Y FECHA */}
      <div className="noticia-header mb-3 d-flex justify-content-between align-items-center pe-5">
        <h3 className="noticia-titulo-principal m-0">{noticia.titulo}</h3>
        {noticia.fecha && (
          <span className="text-muted small fw-bold flex-shrink-0">
            <i className="bi bi-calendar3 me-1"></i> {formatearFecha(noticia.fecha)}
          </span>
        )}
      </div>

      {/* LIBRO ASOCIADO */}
      {libroAsociado && (
        <div className="noticia-libro-vinculado mb-3 p-2 rounded d-flex align-items-center gap-3" style={{ backgroundColor: "rgba(155, 196, 188, 0.1)", border: "1px solid rgba(155, 196, 188, 0.25)" }}>
          <Link to={`/libro/${libroAsociado.isbn}`} className="d-flex align-items-center gap-3 text-decoration-none text-dark w-100 noticia-libro-enlace">
            {urlPortada ? (
              <img src={urlPortada} alt="" className="noticia-libro-img rounded shadow-sm" style={{ width: "50px", height: "75px", objectFit: "cover" }} />
            ) : (
              <div className="noticia-libro-img-placeholder bg-light d-flex align-items-center justify-content-center rounded" style={{ width: "50px", height: "75px" }}><i className="bi bi-book text-muted"></i></div>
            )}
            <div className="text-truncate flex-grow-1">
              <h5 className="m-0 noticia-libro-titulo text-truncate" style={{ fontSize: "0.95rem", fontWeight: "700" }}>{libroAsociado.titulo}</h5>
              <p className="m-0 text-muted small">por {libroAsociado.autor || "Autor desconocido"}</p>
            </div>

            {/* Icono de trofeo para cambiar el Libro del Año (Solo visible para el ADMIN) */}
            {esAdmin && (
              <button 
                onClick={handleMarcarLibroAnio} 
                className="btn btn-sm btn-outline-warning ms-auto border-0 p-2 d-flex align-items-center justify-content-center" 
                title="Coronar como Libro del Año"
                style={{ borderRadius: "50%", backgroundColor: "rgba(255, 193, 7, 0.1)" }}
              >
                <i className="bi bi-trophy-fill" style={{ fontSize: "1.1rem", color: "#ffc107" }}></i>
              </button>
            )}
          </Link>
        </div>
      )}

      {/* EL TEXTO O CUERPO DE LA NOTICIA */}
      <p className="noticia-contenido text-justify m-0" style={{ fontSize: "0.95rem", lineHeight: "150%" }}>
        {noticia.contenido}
      </p>

    </div>
  );
}
import React, { useState } from 'react';
import '../assets/css/crearGrupoModal.css';

const CrearGrupoModal = ({ show, onClose, onGrupoCreado }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    foto: null
  });

  // --- ESTADOS EXCLUSIVOS DEL MODAL PARA EL BUSCADOR DE LIBROS ---
  const [busquedaLibro, setBusquedaLibro] = useState('');
  const [resultadosLibros, setResultadosLibros] = useState([]);
  const [libroSeleccionado, setLibroSeleccionado] = useState(null);
  const [errorValidacion, setErrorValidacion] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Limpiamos el error si el usuario empieza a escribir
    if (errorValidacion) setErrorValidacion('');
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, foto: e.target.files[0] });
  };

  const handleBuscarLibro = async (e) => {
    const texto = e.target.value;
    setBusquedaLibro(texto);
    if (errorValidacion) setErrorValidacion(''); // Limpiamos errores al buscar

    if (texto.trim().length < 3) {
        setResultadosLibros([]);
        return;
    }

    const token = localStorage.getItem("token");
    try {
        const url = `http://localhost:8080/api/libros/buscar-exacto?q=${encodeURIComponent(texto.trim())}&pagina=1`;
        
        const response = await fetch(url, {
            headers: { "Authorization": `Bearer ${token}` }
        });    
        
        if (response.ok) {        
            const librosEncontrados = await response.json();
            setResultadosLibros(librosEncontrados);
        }
    } catch (error) {
        console.error("Error buscando en BD:", error);
    }
  };

  // Previene que la tecla Enter dentro del buscador envíe el formulario general
  const prevenirEnterEnBuscador = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  const seleccionarLibro = (libro) => {
    setLibroSeleccionado(libro);
    setBusquedaLibro(''); 
    setResultadosLibros([]); 
    setErrorValidacion(''); // Si elige un libro, quitamos el error
  };

  const quitarLibro = () => {
    setLibroSeleccionado(null);
  };

  // Función para cerrar y resetear el modal limpio
  const cerrarModal = () => {
    onClose();
    setFormData({ nombre: '', descripcion: '', foto: null });
    setLibroSeleccionado(null);
    setBusquedaLibro('');
    setResultadosLibros([]);
    setErrorValidacion('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Si el usuario no ha seleccionado un libro de la lista, mostramos el error integrado
    if (!libroSeleccionado || !libroSeleccionado.idLibro) {
        setErrorValidacion("Por favor, busca y selecciona un libro de la lista para continuar.");
        return;
    }

    const token = localStorage.getItem("token");
    const sesion = JSON.parse(localStorage.getItem("usuario"));

    const dataToSend = new FormData();
    dataToSend.append("nombre", formData.nombre);
    dataToSend.append("descripcion", formData.descripcion);
    dataToSend.append("idUsuario", sesion.idUsuario);
    dataToSend.append("idLibro", libroSeleccionado.idLibro);
    if (formData.foto) dataToSend.append("foto", formData.foto);

    try {
        const response = await fetch("http://localhost:8080/api/comunidades/crear", {
            method: "POST",
            headers: { "Authorization": `Bearer ${token}` },
            body: dataToSend
        });

        if (response.ok) {
            cerrarModal();
            if (onGrupoCreado) onGrupoCreado();
        } else {
            setErrorValidacion("Hubo un error al crear el grupo. Inténtalo de nuevo.");
        }
    } catch (error) {
        console.error("Error de conexión:", error);
        setErrorValidacion("Error de conexión con el servidor.");
    }
  };

  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-custom">
        <div className="modal-header-custom">
          <h3 className="modal-title-custom">Crear nuevo Club de Lectura</h3>
          <button type="button" className="btn-close-modal" onClick={cerrarModal}>
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body-custom">
          
          <div className="form-group mb-3">
            <label className="form-label fw-bold">Nombre del Grupo</label>
            <input 
              type="text" 
              className="form-control input-vault" 
              name="nombre"
              placeholder="Ej: Fantasía Épica BCN"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
          </div>

          {/* --- ZONA DEL BUSCADOR DE LIBROS --- */}
          <div className="form-group mb-3 position-relative">
            <label className="form-label fw-bold">Libro inicial</label>
            
            {!libroSeleccionado ? (
              <>
                <div className="input-group">
                  <span className="input-group-text bg-white"><i className="bi bi-search"></i></span>
                  <input 
                    type="text" 
                    className="form-control input-vault border-start-0" 
                    placeholder="Escribe el título para buscar..."
                    value={busquedaLibro}
                    onChange={handleBuscarLibro}
                    onKeyDown={prevenirEnterEnBuscador} // Evita el Enter
                  />
                </div>
                
                {resultadosLibros.length > 0 && (
                  <ul 
                    className="list-group position-absolute w-100 shadow-lg mt-1 bg-white" 
                    style={{ 
                      zIndex: 9999, 
                      maxHeight: '220px', 
                      overflowY: 'auto', 
                      borderRadius: '10px',
                      border: '1px solid #e0e0e0'
                    }}
                  >
                    {resultadosLibros.map((libro, idx) => (
                      <li 
                        key={libro.idLibro || libro.isbn || idx} 
                        className="list-group-item list-group-item-action d-flex align-items-center gap-3" 
                        onClick={() => seleccionarLibro(libro)}
                        style={{ 
                          cursor: 'pointer', 
                          backgroundColor: '#ffffff',
                          border: 'none',
                          borderBottom: '1px solid #f0f0f0',
                          padding: '10px 15px'
                        }}
                      >
                        <img 
                          src={libro.portada || libro.fotoPortada || "https://via.placeholder.com/40x60?text=Sin+Portada"} 
                          alt="Portada" 
                          style={{ 
                            width: '45px', 
                            height: '65px', 
                            objectFit: 'cover', 
                            borderRadius: '6px',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)' 
                          }} 
                        />
                        <div className="d-flex flex-column">
                           <span className="fw-bold text-dark">{libro.titulo}</span>
                           <span className="text-muted small">{libro.autor || "Autor Desconocido"}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            ) : (
              <div className="d-flex align-items-center justify-content-between p-2 border rounded" style={{ backgroundColor: '#f8f9fa', borderColor: 'var(--color-verde-oscuro)' }}>
                <div className="d-flex align-items-center gap-3">
                   <img 
                      src={libroSeleccionado.portada || libroSeleccionado.fotoPortada || "https://via.placeholder.com/40x60?text=Sin+Portada"} 
                      alt="Portada" 
                      style={{ width: '40px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} 
                   />
                   <span className="fw-bold text-dark">{libroSeleccionado.titulo}</span>
                </div>
                <button type="button" className="btn btn-sm btn-outline-danger" onClick={quitarLibro}>
                    <i className="bi bi-trash"></i>
                </button>
              </div>
            )}
          </div>

          <div className="form-group mb-3">
            <label className="form-label fw-bold">Descripción</label>
            <textarea 
              className="form-control input-vault" 
              name="descripcion"
              rows="3"
              placeholder="¿De qué trata este club? ¿Cada cuánto leéis?"
              value={formData.descripcion}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <div className="form-group mb-4">
            <label className="form-label fw-bold">Foto de portada (Opcional)</label>
            <input 
              type="file" 
              className="form-control input-vault" 
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>

          {/* --- BLOQUE DE ERROR VISUAL --- */}
          {errorValidacion && (
            <div className="alert alert-danger p-2 text-center small mb-3 border-0 rounded-3 shadow-sm">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              {errorValidacion}
            </div>
          )}

          <div className="modal-footer-custom">
            <button type="button" className="btn-cancelar" onClick={cerrarModal}>Cancelar</button>
            <button type="submit" className="btn-crear">Crear Grupo</button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default CrearGrupoModal;
import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Swal from 'sweetalert2';
import "../assets/css/listaAmigos.css";

export default function MiembrosGrupo() {
  const FOTO_DEFECTO = "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y";
  const { idGrupo } = useParams();

  const [miembros, setMiembros] = useState([]);
  const [grupoInfo, setGrupoInfo] = useState({ miembros: [] });
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);

  const sesion = JSON.parse(localStorage.getItem("usuario"));
  const token = localStorage.getItem("token");
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const soyAdminDelGrupo = grupoInfo?.miembros?.find(m => m.usuario.idUsuario === sesion.idUsuario)?.rol === "admin";
  const soyAdminGlobal = sesion.rol === "ADMIN" || sesion.rol === "admin";
  const tengoPermisosGestion = soyAdminDelGrupo || soyAdminGlobal;

  useEffect(() => {
    cargarDatosComunidad();
  }, [idGrupo]);

  const cargarDatosComunidad = async () => {
    setCargando(true);
    try {
      const res = await fetch(`http://localhost:8080/api/comunidades/${idGrupo}`, { headers });
      if (res.ok) {
        const data = await res.json();
        setGrupoInfo(data);
        setMiembros(data.miembros || []);
      }
    } catch (err) {
      console.error("Error cargando la comunidad", err);
    } finally {
      setCargando(false);
    }
  };

  const obtenerEstadoConexion = (ultimaConexion) => {
    if (!ultimaConexion) return { online: false, texto: "Desconectado" };
    const ultima = new Date(ultimaConexion);
    const ahora = new Date();
    const diferenciaMinutos = Math.floor((ahora - ultima) / (1000 * 60));

    if (diferenciaMinutos < 5) return { online: true, texto: "● En línea ahora" };
    if (ultima.toDateString() === ahora.toDateString()) return { online: false, texto: "Última conexión hoy" };

    const ayer = new Date();
    ayer.setDate(ahora.getDate() - 1);
    if (ultima.toDateString() === ayer.toDateString()) return { online: false, texto: "Última conexión ayer" };

    return {
      online: false,
      texto: `Última conexión el ${ultima.toLocaleDateString()}`,
    };
  };

  const handleExpulsar = (idUsuario, nombreUsuario) => {
    Swal.fire({
      title: `¿Expulsar a ${nombreUsuario}?`,
      text: "Ya no podrá participar en el muro del club.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#7c4d3a',
      confirmButtonText: 'Sí, expulsar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(`http://localhost:8080/api/comunidades/${idGrupo}/expulsar/${idUsuario}`, { method: "DELETE", headers });
          if (res.ok) {
            Swal.fire({ title: '¡Expulsado!', icon: 'success', timer: 1500, showConfirmButton: false });
            cargarDatosComunidad();
          }
        } catch (error) { console.error("Error al expulsar:", error); }
      }
    });
  };

  const handleCederAdmin = (idUsuario, nombreUsuario) => {
    Swal.fire({
      title: '¿Ceder administración?',
      text: `Convertirás a ${nombreUsuario} en el nuevo Admin.`,
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#7c4d3a',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Sí, ceder rol'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(`http://localhost:8080/api/comunidades/${idGrupo}/cambiar-admin/${idUsuario}`, { method: "PUT", headers });
          if (res.ok) {
            Swal.fire({ title: '¡Rol transferido!', icon: 'success', timer: 1500, showConfirmButton: false });
            cargarDatosComunidad();
          }
        } catch (error) { console.error("Error al ceder rol:", error); }
      }
    });
  };

  const miembrosFiltrados = miembros.filter((m) =>
    m?.usuario?.nombreUsuario?.toLowerCase().includes(busqueda.toLowerCase())
  );

  if (cargando) {
    return (
      <div className="loader-container d-flex flex-column justify-content-center align-items-center text-center w-100" style={{ minHeight: "80vh" }}>
        <div className="book">
          <div className="inner">
            <div className="left"></div>
            <div className="middle"></div>
            <div className="right"></div>
          </div>
          <ul>
            {[...Array(18)].map((_, i) => (
              <li key={i}></li>
            ))}
          </ul>
        </div>
        <h4 className="loader-texto mt-5 text-muted fw-bold">Cargando lista lectores...</h4>
      </div>
    );
  }

  return (
    <div className="tus-amigos-bg py-5">
      <div className="container-custom">
        <div className="row g-4">
          <div className="col-lg-3">
            <div className="social-sidebar">
              <h5 className="mb-4 text-truncate">{grupoInfo?.nombre}</h5>
              <button className="nav-social-link active w-100 text-start">
                <i className="bi bi-people-fill me-2"></i> Lectores activos: {miembros.length}
              </button>
              <Link to={`/comunidad/grupo/${idGrupo}`} className="btn btn-volver-perfil w-100 rounded-pill mt-4 btn-sm text-center">
                <i className="bi bi-arrow-left me-2"></i> Volver al grupo
              </Link>
            </div>
          </div>

          <div className="col-lg-9">
            <div className="search-amigos-container mb-4">
              <i className="bi bi-search search-amigos-icon"></i>
              <input type="text" className="search-amigos-input" placeholder="Buscar lector en la comunidad..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
            </div>

            <section>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h3>Miembros del Club</h3>
                <span className="badge-tu-resena">Total: {miembros.length}</span>
              </div>

              {miembrosFiltrados.length === 0 ? (
                <div className="detalle-card p-5 text-center bg-white rounded-4 border">
                  <p className="text-muted">No se han encontrado lectores.</p>
                </div>
              ) : (
                miembrosFiltrados.map((membro) => {
                  const esElMismo = membro.usuario.idUsuario === sesion.idUsuario;
                  const esAdminDelFila = membro.rol === "admin";
                  const estado = obtenerEstadoConexion(membro.usuario.ultimaConexion);

                  return (
                    <div key={membro.usuario.idUsuario} className="amigo-item-card d-flex align-items-center p-3 mb-3 bg-white rounded-4 shadow-sm">
                      <img src={membro.usuario.fotoPerfil || FOTO_DEFECTO} className="amigo-avatar me-3" alt="avatar" style={{ width: "50px", height: "50px", borderRadius: "50%", objectFit: "cover" }} />
                      <div className="flex-grow-1">
                        <div className="d-flex align-items-center gap-2">
                          <h5 className="mb-0 fw-bold">{membro.usuario.nombreUsuario}</h5>
                          {esAdminDelFila && <span className="badge bg-warning text-dark">Admin</span>}
                        </div>
                        <div className={`status-indicator small ${estado.online ? "status-online" : "status-offline"}`}>
                          <span>{estado.texto}</span>
                        </div>
                      </div>

                      <div className="d-flex gap-2">
                        {tengoPermisosGestion && !esElMismo && (
                            <>
                            {!esAdminDelFila && soyAdminDelGrupo && (
                                <button 
                                className="btn-gestion-comunidad btn-hacer-admin" 
                                onClick={() => handleCederAdmin(membro.usuario.idUsuario, membro.usuario.nombreUsuario)}
                                >
                                <i className="bi bi-shield-check me-1"></i> Admin
                                </button>
                            )}
                            <button 
                                className="btn-gestion-comunidad btn-expulsar" 
                                onClick={() => handleExpulsar(membro.usuario.idUsuario, membro.usuario.nombreUsuario)}
                            >
                                <i className="bi bi-person-x me-1"></i> Expulsar
                            </button>
                            </>
                        )}
                        <Link 
                            to={`/perfil/${membro.usuario.idUsuario}`} 
                            className="btn-gestion-comunidad btn-ver-perfil-listado"
                        >
                            Ver Perfil
                        </Link>
                      </div>
                    </div>
                  );
                })
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
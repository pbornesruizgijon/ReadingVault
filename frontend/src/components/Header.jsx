import { Link, useNavigate } from "react-router-dom";
import "../assets/css/header.css";

/**
 * Componente Navbar compacto y alineado.
 * Utiliza variables globales para colores y tipografía.
 */
export default function Header() {
  const navigate = useNavigate();
  
  // Comprobamos si hay un usuario en el localStorage
  const usuarioSesion = JSON.parse(localStorage.getItem("usuario"));
  const estaLogueado = !!usuarioSesion; // true si existe, false si no

  // Función para cerrar sesión
  const handleLogout = () => {
    localStorage.clear(); // Borra token y usuario
    navigate("/login");    // Redirige al login
    window.location.reload(); // Forzamos recarga para limpiar estados globales
  };

  const FOTO_DEFAULT = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  return (
    <nav className="navbar-custom">
      <div className="container d-flex justify-content-between align-items-center">
        {/* LOGO Y NOMBRE A LA IZQUIERDA */}
        <Link to="/" className="navbar-custom__brand">
          <div className="navbar-custom__logo-circle">
            <img
              src="/img/logo-vault.png"
              alt="Logo"
              className="navbar-custom__logo-img"
            />
          </div>
          <h3><span className="navbar-custom__brand--reading">Reading</span><span className="navbar-custom__brand--vault">Vault</span></h3>
        </Link>

        {/* MENÚ DE NAVEGACIÓN Y ACCESO */}
        <div className="navbar-custom__menu d-flex align-items-center gap-4">
          <Link to="/" className="navbar-custom__link">
            Home
          </Link>
          <Link to="/comunidad" className="navbar-custom__link">
            Comunidad
          </Link>
          <Link to="/buscador" className="navbar-custom__link">
            Explorar
          </Link>
          <Link to="/nosotros" className="navbar-custom__link">
            Nosotros
          </Link>

          <div className="navbar-custom__divider"></div>

          {/* LÓGICA CONDICIONAL: SI NO ESTÁ LOGUEADO */}
          {!estaLogueado ? (
            <>
              <Link to="/registro" className="navbar-custom__link">Registro</Link>
              <Link to="/login" className="navbar-custom__auth-btn">Log In</Link>
            </>
          ) : (
            /* LÓGICA CONDICIONAL: SI ESTÁ LOGUEADO */
            <div className="d-flex align-items-center gap-3">
              {/* Link al Perfil con su foto pequeña */}
              <Link to="/perfilUsuario" className="navbar-custom__link d-flex align-items-center gap-2">
                <img 
                  src={usuarioSesion.fotoPerfil || FOTO_DEFAULT} 
                  alt="Mi perfil" 
                  style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover' }} 
                />
                Mi perfil
              </Link>

              {/* Botón de Log Out */}
              <button 
                onClick={handleLogout} 
                className="navbar-custom__auth-btn"
                
              >
                Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

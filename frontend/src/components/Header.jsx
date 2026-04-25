import { Link } from "react-router-dom";
import "../assets/css/header.css";

/**
 * Componente Navbar compacto y alineado.
 * Utiliza variables globales para colores y tipografía.
 */
export default function Header() {
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

          <Link to="/registro" className="navbar-custom__link">
            Registro
          </Link>
          <Link to="/login" className="navbar-custom__auth-btn">
            Log In
          </Link>
        </div>
      </div>
    </nav>
  );
}

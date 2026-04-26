import { Link } from 'react-router-dom';
import '../assets/css/hero.css';

/**
 * Componente Hero alineado al carril central.
 * El fondo es infinito, pero el contenido respeta el container-custom.
 */
export default function Hero() {
  return (
    <section className="hero">
      
      {/* Carril central alineado con toda la web */}
      <div className="container-custom">
        <div className="hero__texto-bloque">
          <h1 className="hero__titulo">
            <span className="hero__titulo--verde">Reading</span> 
            <span className="hero__titulo--amarillo">Vault</span>
          </h1>
          
          <h3 className="hero__slogan">
            Tu refugio personal para cada libro que formará parte de tu viaje literario
          </h3>
          
          <Link to="/login" className="hero__boton">
            ENTRAR
          </Link>
        </div>
      </div>

      {/* Imagen decorativa fugada al borde derecho */}
      <div className="hero__img-wrap">
        <picture>
          <img 
            src="/img/libros-landing.jpg" 
            alt="Estantería de libros" 
            className="hero__img-element"
          />
        </picture>
      </div>

    </section>
  );
}
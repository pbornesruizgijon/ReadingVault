import { Link } from 'react-router-dom';
import '../assets/css/hero.css';

export default function Hero() {
  return (
    <section className="hero">
      
      {/* CAPA DE TEXTO CENTRADA DENTRO DEL MAX-WIDTH */}
      <div className="container hero__content"> 
        <div className="hero__texto-bloque">
          <h1 className="hero__titulo">
            Reading <span className="hero__titulo--amarillo">Vault</span>
          </h1>
          <h3 className="hero__slogan">
            Tu refugio personal para cada libro que formará parte de tu viaje literario
          </h3>
          <Link to="/login" className="hero__boton">
            ENTRAR
          </Link>
        </div>
      </div>

      {/* CAPA DE IMAGEN DECORATIVA (Con Clip-Path) */}
      <div className="hero__img-wrap">
        <picture>
            <img 
              src="/img/libros-landing.jpg" 
              alt="Estantería de libros literaria" 
              className="hero__img-element"
            />
        </picture>
      </div>

    </section>
  );
}
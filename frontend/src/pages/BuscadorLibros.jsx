import React, { useState } from "react";
import axios from "axios";
import LibroCard from "../components/LibroCard";
import SidebarGeneros from "../components/SidebarGeneros";
import "../assets/css/buscador.css";

const BuscadorLibros = () => {
  // --- ESTADOS ---
  const [libros, setLibros] = useState([]);
  const [textoBusqueda, setTextoBusqueda] = useState("");
  // Controla cuántos libros son visibles (6 libros = 2-3 líneas aprox)
  const [visible, setVisible] = useState(6);

  // --- LÓGICA DE BÚSQUEDA ---
  const ejecutarBusqueda = async (e) => {
    e.preventDefault();
    
    // Evita búsquedas vacías
    if (!textoBusqueda.trim()) return;

    try {
      const response = await axios.get(
        `http://localhost:8080/api/libros/buscar?q=${textoBusqueda.trim()}`,
      );
      setLibros(response.data);
      // Reiniciamos a 6 visibles cuando se hace una nueva búsqueda
      setVisible(6); 
    } catch (error) {
      console.error("Error al buscar:", error);
    }
  };

  // --- LÓGICA DE CARGA ---
  const mostrarMasLibros = () => {
    // Aumentamos de 6 en 6 (puedes cambiarlo a 9 si prefieres 3 líneas)
    setVisible((prevValue) => prevValue + 6);
  };

  const tusGeneros = ["Ficción", "Misterio", "Ciencia Ficción", "Romance"];
  const todosLosGeneros = ["Arte", "Autoayuda", "Biografía", "Ciencia ficción", "Clásicos", "Crimen", "Fantasía", "Historia", "Comedia", "Infantil", "Misterio", "Novela", "Paranormal", "Poesía", "Romance", "Suspense", "Terror", "Thriller"];

  return (
    <div className="buscador-page">
      <div className="container-custom">
        <div className="row">
          
          {/* Sidebar lateral */}
          <aside className="col-md-3">
            <SidebarGeneros
              tusGeneros={tusGeneros}
              todosLosGeneros={todosLosGeneros}
            />
          </aside>

          {/* Contenido principal */}
          <main className="col-md-9">
            
            {/* Barra de búsqueda */}
            <div className="search-bar">
              <form className="search-bar__form" onSubmit={ejecutarBusqueda}>
                <div className="search-bar__icon">
                  <i className="bi bi-search"></i>
                </div>
                <input
                  type="text"
                  className="search-bar__input"
                  placeholder="Busca por título, autor o género..."
                  value={textoBusqueda}
                  onChange={(e) => setTextoBusqueda(e.target.value)}
                  autoFocus
                />
                <button type="submit" className="search-bar__button">
                  Buscar
                </button>
              </form>
            </div>

            {/* Filtro de ordenación */}
            <div className="sort-section">
              <span className="me-2">Ordenar por:</span>
              <select className="sort-section__select">
                <option>Valoración</option>
                <option>Título</option>
              </select>
            </div>

            {/* Grid de resultados con límite 'visible' */}
            <div className="libros-grid">
              {libros.length > 0 ? (
                /* .slice(0, visible) corta el array para mostrar solo los permitidos */
                libros.slice(0, visible).map((libro, index) => (
                  <LibroCard key={index} libro={libro} />
                ))
              ) : (
                <p className="libros-grid__mensaje">
                  Usa el buscador para encontrar tus libros favoritos.
                </p>
              )}
            </div>

            {/* Botón Ver Más: Solo se muestra si hay más libros en el array que los visibles */}
            {libros.length > visible && (
              <div className="ver-mas-container">
                <button onClick={mostrarMasLibros} className="btn-ver-mas">
                  Ver más libros
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default BuscadorLibros;
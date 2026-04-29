import React, { useState } from 'react';
import '../assets/css/detalleLibro.css'; 

export default function DetalleLibro() {
  const [sinopsisExpandida, setSinopsisExpandida] = useState(false);
  const [detallesExpandidos, setDetallesExpandidos] = useState(false);

  // Datos simulados del libro
  const libro = {
    titulo: "Tumba de dioses",
    autor: "Jay Kristoff",
    portada: "https://images-na.ssl-images-amazon.com/images/I/81xU213XJ3L.jpg", 
    valoraciones: "71.847",
    resenas: "9.625",
    sinopsisCorta: "La gloria puedes quedártela. Yo estoy aquí por la sangre. En una tierra de tres soles que nunca dan paso a la oscuridad...",
    sinopsisLarga: "La gloria puedes quedártela. Yo estoy aquí por la sangre. En una tierra de tres soles que nunca dan paso a la oscuridad, Mia Corvere ha encontrado su lugar en la Iglesia Roja, la famosa escuela de asesinos. Tras superar las pruebas, se embarca en una nueva misión letal llena de traiciones y misterios oscuros.",
    generos: "Fantasía, Joven Adulto, Ficcion, Alta Fantasía",
    paginas: 728,
    publicacion: "5 de Septiembre de 2017",
  };

  // Array de reseñas simuladas
  const resenasData = [
    { id: 1, nombre: "Lucía", avatar: "https://randomuser.me/api/portraits/women/44.jpg", estrellas: 4, texto: "Con este también me ha costado seguir en algunas partes pero al final me atrapó. La ambientación inspirada en la antigua Roma, la relación nueva de Mía", liked: true },
    { id: 2, nombre: "Pedro", avatar: "https://randomuser.me/api/portraits/men/46.jpg", estrellas: 4, texto: "Con este también me ha costado seguir en algunas partes pero al final me atrapó. La ambientación inspirada en la antigua Roma, la relación nueva de Mía", liked: true },
    { id: 3, nombre: "Ángeles", avatar: "https://randomuser.me/api/portraits/women/68.jpg", estrellas: 4, texto: "Con este también me ha costado seguir en algunas partes pero al final me atrapó. La ambientación inspirada en la antigua Roma, la relación nueva de Mía", liked: false },
    { id: 4, nombre: "Adolfo", avatar: "https://randomuser.me/api/portraits/men/32.jpg", estrellas: 4, texto: "Con este también me ha costado seguir en algunas partes pero al final me atrapó. La ambientación inspirada en la antigua Roma, la relación nueva de Mía", liked: false },
  ];

  return (
    <>
      {/* SECCIÓN SUPERIOR: Info del libro */}
      <section className="detalle-top-bg py-5">
        <div className="container-custom">
          <div className="row">
            {/* Portada y botón leer */}
            <div className="col-md-4 col-lg-3 text-center mb-4">
              <img src={libro.portada} alt="Portada" className="detalle-portada shadow-lg mb-4" />
              <button className="btn-estado w-100 mb-4 d-flex justify-content-between px-4">
                Quiero leer <i className="bi bi-caret-down-fill"></i>
              </button>
              <div className="detalle-rating text-muted">
                <p className="mb-1">Valoración global</p>
                <div className="estrellas">
                  <i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star"></i>
                </div>
              </div>
            </div>

            {/* Datos del libro */}
            <div className="col-md-8 col-lg-9 d-flex flex-column gap-4">
              <div className="detalle-card p-4 text-center">
                <h1 className="detalle-titulo">{libro.titulo}</h1>
                <h3 className="detalle-autor mb-4">{libro.autor}</h3>
                <p className="detalle-stats mb-0">Valoraciones totales: {libro.valoraciones} | Reseñas: {libro.resenas}</p>
              </div>

              <div className="detalle-card p-4">
                <div className="mb-4">
                  <p className="detalle-texto mb-1">{sinopsisExpandida ? libro.sinopsisLarga : libro.sinopsisCorta}</p>
                  <button className="btn-mas" onClick={() => setSinopsisExpandida(!sinopsisExpandida)}>
                    {sinopsisExpandida ? "Menos ▲" : "Más ▼"}
                  </button>
                </div>
                <p className="detalle-texto mb-4"><strong>Géneros:</strong> {libro.generos}</p>
                <div>
                  <p className="detalle-texto mb-0"><strong>Detalles del libro:</strong></p>
                  <p className="detalle-texto mb-0">Páginas: {libro.paginas}</p>
                  <p className="detalle-texto mb-1">Primera publicación: {libro.publicacion}</p>
                  <button className="btn-mas" onClick={() => setDetallesExpandidos(!detallesExpandidos)}>
                    {detallesExpandidos ? "Menos ▲" : "Más ▼"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN INFERIOR: Reseñas */}
      <section className="detalle-reviews-bg py-5">
        <div className="container-custom" style={{ maxWidth: '800px' }}>
          <h2 className="text-center mb-5 detalle-titulo-seccion">Valoraciones y reseñas</h2>
          
          <div className="d-flex flex-column gap-4">
            {/* Mapeo de tarjetas de reseña */}
            {resenasData.map((resena) => (
              <div key={resena.id} className="review-card p-4">
                <div className="review-user text-center">
                  <img src={resena.avatar} alt={resena.nombre} className="review-avatar mb-2" />
                  <h5 className="mb-0">{resena.nombre}</h5>
                </div>
                
                <div className="review-content p-3 position-relative">
                  <div className="estrellas mb-2">
                    {[...Array(5)].map((_, i) => (
                      <i key={i} className={`bi ${i < resena.estrellas ? 'bi-star-fill' : 'bi-star'} me-1`}></i>
                    ))}
                  </div>
                  <p className="mb-3 text-muted">{resena.texto}</p>
                  <div className="review-like d-flex align-items-center gap-2">
                    <span className="text-muted small">Me gusta</span>
                    <i className={`bi ${resena.liked ? 'bi-heart-fill text-danger' : 'bi-heart'}`} style={{ cursor: 'pointer' }}></i>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-5">
            <button className="btn-ver-mas px-5 py-2">Ver más</button>
          </div>
        </div>
      </section>
    </>
  );
}
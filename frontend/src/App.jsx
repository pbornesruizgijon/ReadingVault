import React, { useEffect } from "react"; // React y hooks
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ScrollToTop from './components/ScrollToTop';
import BotonSubir from './components/BotonSubir'; // Botón visual subir
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

// Animaciones AOS
import AOS from 'aos';
import 'aos/dist/aos.css';

import "./App.css";

// Globales
import Header from "./components/Header";
import Footer from "./components/Footer";

// Páginas
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import BuscadorLibros from "./pages/BuscadorLibros";
import Home from './pages/Home';
import PerfilUsuario from "./pages/PerfilUsuario";
import AjustesCuenta from "./pages/AjustesCuenta";
import DetalleLibro from "./pages/DetalleLibro";

function App() {
  // Inicializa AOS
  useEffect(() => {
    AOS.init({
      duration: 1000, 
      once: true,
      easing: 'ease-in-out',
    });
  }, []);

  return (
    <Router>
      {/* Reseteo de scroll automático */}
      <ScrollToTop />
      
      <Header />

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/buscador" element={<BuscadorLibros />} />
          <Route path="/home" element={<Home />} />
          <Route path="/perfilUsuario" element={<PerfilUsuario />} />
          <Route path="/ajustesCuenta" element={<AjustesCuenta />} />
          <Route path="/detalle" element={<DetalleLibro />} />
        </Routes>
      </main>

      <Footer />

      {/* Botón flotante */}
      <BotonSubir />
    </Router>
  );
}

export default App;
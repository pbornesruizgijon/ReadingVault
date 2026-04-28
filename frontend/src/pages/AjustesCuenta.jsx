import { useState, useEffect } from "react"; // Añadido useEffect
import EditarPerfilForm from "../components/EditarPerfilForm";
import AjustesPrivacidad from "../components/AjustesPrivacidad"; 

export default function AjustesCuenta() {
  const [pestañaActiva, setPestañaActiva] = useState("perfil");
  const [usuario, setUsuario] = useState(null); // Estado para guardar los datos de la DB

  useEffect(() => {
    // 1. Sacamos los datos de la sesión para saber el ID
    const sesion = localStorage.getItem("usuario");
    
    if (sesion) {
      const userObj = JSON.parse(sesion);
      const token = localStorage.getItem("token");

      // 2. Llamamos al backend para traer los datos REALES y actualizados
      fetch(`http://localhost:8080/api/usuarios/${userObj.idUsuario}`, {
        headers: {
          'Authorization': `Bearer ${token}` 
        }
      })
      .then(res => res.json())
      .then(data => {
        setUsuario(data); // <--- Aquí guardamos los datos en el estado
      })
      .catch(err => console.error("Error cargando ajustes:", err));
    }
  }, []);

  // Si aún no han llegado los datos, mostramos un cargando
  if (!usuario) return <div className="container p-5">Cargando tus ajustes...</div>;

  return (
    <main className="container-custom py-5">
      <h1 className="mb-4" style={{ fontFamily: 'var(--font-titulos)' }}>Ajustes de la cuenta</h1>
      
      {/* Sistema de pestañas igual que lo tenías... */}
      <ul className="nav nav-tabs border-0 mb-4" role="tablist">
        <li className="nav-item">
          <button 
            className={`nav-link text-dark ${pestañaActiva === 'perfil' ? 'active fw-bold' : ''}`}
            style={{ border: 'none', backgroundColor: 'transparent', borderBottom: pestañaActiva === 'perfil' ? '2px solid var(--accent)' : 'none' }}
            onClick={() => setPestañaActiva("perfil")}
          >
            Perfil
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link text-dark ${pestañaActiva === 'cuenta' ? 'active fw-bold' : ''}`}
            style={{ border: 'none', backgroundColor: 'transparent', borderBottom: pestañaActiva === 'cuenta' ? '2px solid var(--accent)' : 'none' }}
            onClick={() => setPestañaActiva("cuenta")}
          >
            Cuenta
          </button>
        </li>
      </ul>

      {/* AQUÍ ESTÁ EL CAMBIO CLAVE: Pasar el objeto usuario al hijo */}
      <div className="perfil-card p-4">
        {pestañaActiva === "perfil" && <EditarPerfilForm user={usuario} />}
        {pestañaActiva === "cuenta" && <AjustesPrivacidad user={usuario} />}
      </div>
    </main>
  );
}
import { useState, useEffect } from "react";
import HeaderUsuario from "../sections/HeaderUsuario";
import ActividadUsuario from "../sections/ActividadUsuario";
import { SidebarUsuario } from "../components/SidebarUsuario";
import "../assets/css/perfil.css"

export default function PerfilUsuario() {
    const [usuario, setUsuario] = useState(null);

    useEffect(() => {
        const sesion = localStorage.getItem("usuario");
        const token = localStorage.getItem("token");
        
        // Si no hay rastro de sesión o token, fuera.
        if (!sesion || !token) {
            window.location.href = "/login";
            return;
        }

        const userObj = JSON.parse(sesion);

        // Peticion
        fetch(`http://localhost:8080/api/usuarios/${userObj.idUsuario}`, {
            headers: {
                'Authorization': `Bearer ${token}` 
            }
        })
        .then(res => {
            if (!res.ok) {
                // Si el servidor responde 401 o 403 (token inválido o expirado)
                if (res.status === 401 || res.status === 403) {
                    localStorage.clear(); // Limpiamos basura
                    window.location.href = "/login";
                }
                throw new Error("Error en la respuesta del servidor");
            }
            return res.json();
        })
        .then(data => setUsuario(data))
        .catch(err => {
            console.error("Error cargando perfil:", err);
            // Si algo falla críticamente, mejor volver al login que quedarse colgado
            window.location.href = "/login";
        });
    }, []);

    // Mientras el fetch está cargando (milisegundos), devolvemos null para no renderizar nada roto
    if (!usuario) return null;

    return (
        <main className="container-custom py-5">
            <div className="row g-4">
                <div className="col-lg-3">
                    <SidebarUsuario user={usuario} />
                </div>
                <div className="col-lg-9">
                    <HeaderUsuario user={usuario} />
                    <ActividadUsuario user={usuario} />
                </div>
            </div>
        </main>
    );
}
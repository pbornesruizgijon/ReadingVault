import { Link } from 'react-router-dom';

export default function HeaderUsuario({ user, sonAmigos }) {
  if (!user) return null;

  // 1. Obtener mi sesión para saber quién soy
  const miSesion = JSON.parse(localStorage.getItem("usuario"));
  const esMiPerfil = miSesion && miSesion.idUsuario === user.idUsuario;
  const esOtroUsuario = !esMiPerfil;

  // 2. Función de ayuda para calcular la edad
  const calcularEdad = (fechaNacimiento) => {
    if (!fechaNacimiento) return "??";
    const hoy = new Date();
    const cumple = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - cumple.getFullYear();
    const mes = hoy.getMonth() - cumple.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < cumple.getDate())) {
      edad--;
    }
    return edad;
  };

  // 3. Lógica central de Privacidad para Datos Personales
  // Retorna true si el dato debe mostrarse
  const puedeVerDatos = () => {
    if (esMiPerfil) return true; // Yo siempre veo mis datos
    if (user.privacidadDatos === "Público") return true;
    if (user.privacidadDatos === "Solo Amigos" && sonAmigos) return true;
    return false;
  };

  const formatearFecha = (fecha) => {
      if(!fecha) return "Recientemente";
      return new Date(fecha).toLocaleDateString();
  };

  return (
    <div className="perfil-card">
      <div className="d-flex justify-content-between align-items-start">
        <div>
          <div className="d-flex align-items-center gap-3 mb-2">
            <h1 style={{ fontSize: "2rem", margin: 0 }}>
              {/* El nombre de usuario suele ser público siempre */}
              {user.nombreUsuario}
            </h1>

            {esMiPerfil && (
              <Link
                to="/ajustesCuenta"
                className="btn btn-sm btn-outline-secondary py-0 px-2"
                style={{
                  borderRadius: "15px",
                  fontSize: "0.8rem",
                  height: "22px",
                }}
              >
                Ajustes de la cuenta
              </Link>
            )}
          </div>

          {/* DATOS PROTEGIDOS POR PRIVACIDAD */}
          {puedeVerDatos() ? (
            <>
              <p className="mb-1">
                <span className="dato-etiqueta">Edad:</span>
                {calcularEdad(user.fechaNacimiento)}
              </p>
              <p className="mb-1">
                <span className="dato-etiqueta">Localidad:</span>{" "}
                {user.localidad || "No especificada"}
              </p>
            </>
          ) : (
            <p className="small text-muted italic">
              <i className="bi bi-shield-lock me-1"></i>
              Información de perfil privada
            </p>
          )}

          <p className="mb-1">
            <span className="dato-etiqueta">Género favorito:</span>{" "}
            {user.genero?.nombre || "Misterio"}
          </p>
        </div>

        <div className="text-end">
          {esOtroUsuario ? (
            <p className="small text-muted">
              Última vez en línea: {formatearFecha(user.ultimaConexion)}
            </p>
          ) : (
            <p className="small text-success fw-bold">● En línea ahora</p>
          )}
          
          <div
            className="logro-box p-3"
            style={{
              backgroundColor: "var(--color-azul-footer)",
              borderRadius: "10px",
            }}
          >
            <h6 className="mb-1">Logro destacado</h6>
            <p className="small mb-0">⭐ 5 años de antigüedad</p>
          </div>
        </div>
      </div>

      {/* BIOGRAFÍA: También suele considerarse parte de los datos personales */}
      <div className="bio-block mt-4">
        {puedeVerDatos() ? (
          <>“{user.biografia || "Lector apasionado..."}”</>
        ) : (
          <span className="text-muted small">La biografía es privada.</span>
        )}
      </div>
    </div>
  );
}
import React from "react";
import { Link, useLocation } from "react-router-dom"; // Agregamos useLocation para obtener la ruta actual
import { useAuth } from "../context/authContext";

export function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();
  const location = useLocation(); // Obtenemos la ubicación actual de la página

  // Función para determinar si estamos en la página de registro de acceso
  const isRegistroAccesoPage = location.pathname === "/registro-acceso";

  return (
    <nav className="bg-zinc-700 my-3 flex justify-between py-5 px-10 rounded-lg relative">
      <ul className="flex gap-x-2 items-center">
        <h1 className="text-2xl font-bold">
          <Link to={isAuthenticated ? "/tasks" : "/"}>Administrador</Link>
        </h1>

        {isAuthenticated && (
          <>
            <li>
              <span className="text-white">Bienvenido {user ? user.username : 'Usuario'}</span>
            </li>
            <li>
              <Link to="/" onClick={() => logout()} className="text-white">
                <i className="fas fa-sign-out-alt mr-1"></i>
              </Link>
            </li>
          </>
        )}
      </ul>

      <ul className="flex gap-x-2 items-center">
        {isAuthenticated ? (
          <>
            <li>
              <Link to="/statistics" className="text-white">
                Estadísticas
              </Link>
            </li>
            <li>
              <Link to="/prices" className="text-white">
              Precios
              </Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login" className="text-white">
                <i className="fas fa-sign-in-alt mr-1"></i>Ingresar
              </Link>
            </li>
            <li>
              <Link to="/register" className="text-white">
                <i className="fas fa-user-plus mr-1"></i>Registrarse
              </Link>
            </li>
          </>
        )}
        {isAuthenticated && (
          <li>
            <Link
              to="/registro-acceso"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white"
            >
              Registro de Acceso
            </Link>
          </li>
        )}
      </ul>
      {/* Condición para mostrar los botones solo si no estamos en la página de registro de acceso */}
      {!isRegistroAccesoPage && isAuthenticated && (
        <div className="fixed bottom-5 right-5 flex flex-col items-end">
          <Link
            to="/checkout"
            className="text-white mb-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full shadow-lg"
          >
            Gestionar Caja
          </Link>
          <Link to="/add-task" className="text-white">
            <i className="fas fa-plus-circle text-4xl"></i>
          </Link>
        </div>
      )}
    </nav>
  );
}

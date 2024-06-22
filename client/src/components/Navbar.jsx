import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/authContext';

export function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();

  return (
    <nav className="bg-zinc-700 my-3 flex justify-between py-5 px-10 rounded-lg relative">
      <h1 className="text-2xl font-bold">
        <Link to={isAuthenticated ? '/tasks' : '/'}>Administrador</Link>
      </h1>
      <ul className="flex gap-x-2 items-center">
        {isAuthenticated ? (
          <>
            <li>
              <span className="text-white">Bienvenido {user.username}</span>
            </li>
            <li>
              <Link to="/" onClick={() => logout()} className="text-white">
                <i className="fas fa-sign-out-alt mr-1"></i>
              </Link>
            </li>
            <li>
              <Link to="/statistics" className="text-white">
                Estadísticas
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
        {/* Agrega el enlace para la página RegistroAccesoPage */}
        {isAuthenticated && (
          <li>
            <Link
              to="/registro-acceso"
              target="_blank" // Este atributo abre el enlace en una nueva ventana o pestaña
              rel="noopener noreferrer" // Es importante agregar rel="noopener noreferrer" para evitar riesgos de seguridad
              className="text-white"
            >
              Registro de Acceso
            </Link>
          </li>
        )}
      </ul>
      {isAuthenticated && (
        <div className="fixed bottom-5 right-5 flex items-center">
          <Link to="/add-task" className="text-white mr-4">
            <i className="fas fa-plus-circle text-4xl"></i>
          </Link>
        </div>
      )}
    </nav>
  );
}

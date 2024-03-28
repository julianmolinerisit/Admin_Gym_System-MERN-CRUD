import { Link } from "react-router-dom";

function HomePage() {
  return (
    <section className="bg-red-500 flex justify-center items-center">
      <header className="bg-zinc-800 p-10">
        <h1 className="text-5xl py-2 font-bold"> Sistema de gestión amigable </h1>
        <p className="text-md text-slate-400">
          ¡Gracias por adquirir nuestro sistema amigable de gestión para gimnasio! Estamos emocionados de tenerte como parte de nuestra comunidad de administradores. Con esta herramienta, simplificarás la gestión del gimnasio y brindarás una experiencia excepcional a tus usuarios.
        </p>

        <Link
          className="bg-zinc-500 text-white px-4 py-2 rounded-md mt-4 inline-block"
          to="/register"
        >
          Comenzar
        </Link>
      </header>
    </section>
  );
}

export default HomePage;

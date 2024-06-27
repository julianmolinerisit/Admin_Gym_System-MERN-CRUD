import React, { useState } from 'react';
import RegistroAcceso from '../components/RegistroAcceso'; // Asegúrate de la ruta y el nombre del archivo

const RegistroAccesoPage = () => {
  const [showCard, setShowCard] = useState(false); // Estado para controlar la visibilidad de la tarjeta

  return (
    <div>
      <RegistroAcceso setShowCard={setShowCard} /> {/* Pasamos la función setShowCard al componente hijo */}
      {showCard && (
        <div className="modal"> {/* Estilo CSS para el modal */}
          <div className="modal-content">
            {/* Contenido de la tarjeta */}
            <button onClick={() => setShowCard(false)}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistroAccesoPage;

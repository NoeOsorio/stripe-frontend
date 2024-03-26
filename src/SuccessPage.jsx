import React from "react";
import { Link } from "react-router-dom";
import "./SuccessPage.css"; // Asegúrate de crear este archivo CSS

function SuccessPage() {
  return (
    <div className="success-page">
      <div className="success-icon">✔️</div>
      <h2>Pago realizado con éxito</h2>
      <p>¡Gracias por tu compra!</p>
      <Link to="/">Volver a la página de inicio</Link>
    </div>
  );
}

export default SuccessPage;

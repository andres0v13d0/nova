import React from 'react';
import './ConocenosStyles.css';

const Conocenos = () => {
  return (
    <div className="conocenos-container">
      <h1 className="main-title">Únete al Juego</h1>
      <h2 className="subtitle">Tu PC Gamer hoy</h2>
      <p className="description">
        En NovaTech encontrarás todo lo que necesitas y nos aseguramos de que lleves la PC de tus sueños.
      </p>
      <div className="buttons">
        <a 
          href="https://www.google.com/maps/search/?api=1&query=Riobamba,+Ecuador" 
          className="button tienda" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          Visita la Tienda
        </a>
        <a 
          href="https://wa.me/593969993722" 
          className="button contacto" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          Escríbenos
        </a>
      </div>
      <div className="social-section">
        <h3 className="follow-us">Síguenos en nuestras Redes Sociales</h3>
        <div className="social-icons">
          <a href="https://www.facebook.com/novatech" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-facebook"></i>
          </a>
          <a href="https://www.instagram.com/novatech" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-instagram"></i>
          </a>
          <a href="https://www.tiktok.com/@novatech" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-tiktok"></i>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Conocenos;

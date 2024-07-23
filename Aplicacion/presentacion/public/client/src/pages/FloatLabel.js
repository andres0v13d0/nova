import React from 'react';
import './FloatLabel.css'; // Asegúrate de crear y ajustar el archivo CSS para este componente

const FloatLabel = ({ children, label }) => {
  return (
    <div className="float-label-container">
      {children}
      <label className="float-label">{label}</label>
    </div>
  );
};

export default FloatLabel;

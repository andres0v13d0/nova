import React, { useState } from 'react';
import './ChatModalStyles.css';

const ChatModal = ({ show, onClose }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes manejar el envío del mensaje
    console.log('Mensaje enviado:', message);
    setMessage(''); // Limpia el campo del mensaje después de enviar
  };

  if (!show) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="profile-info">
            <img src="/images/ia.jpg" alt="Profile" className="profile-image" />
            <div>
              <h2>Nova</h2>
              <p>Asistente Virtual</p>
            </div>
          </div>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal-body">
          <div className="chat-message">
            <img src="/images/ia.jpg" alt="Profile" className="message-image" />
            <div className="message-text">
              <p>Necesitas ayuda con periferico o componente, aqui estoy para ayudarte¡</p>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="chat-form">
            <input
              type="text"
              placeholder="Preguntar..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
            <button type="submit">Enviar</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatModal;

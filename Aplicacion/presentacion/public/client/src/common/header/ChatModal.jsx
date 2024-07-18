import React, { useState } from 'react';
import './ChatModalStyles.css';

const ChatModal = ({ show, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!message.trim()) return;

    const newMessage = { sender: 'user', text: message };
    setMessages([...messages, newMessage]);
    setMessage('');

    try {
      const response = await fetch('http://localhost:3200/asistente/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error('Error en la respuesta del servidor');
      }

      const botMessageText = await response.text();
      const botMessage = { sender: 'bot', text: botMessageText };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      const errorMessage = { sender: 'bot', text: 'Error al enviar mensaje, por favor intenta de nuevo.' };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    }
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
          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`chat-message ${msg.sender}`}>
                <img src="/images/ia.jpg" alt="Profile" className="message-image" />
                <div className="message-text">
                  <p>{msg.text}</p>
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={handleSendMessage} className="chat-form">
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

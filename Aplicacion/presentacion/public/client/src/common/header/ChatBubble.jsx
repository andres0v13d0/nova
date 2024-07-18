import React, { useState } from 'react';
import './ChatBubbleStyles.css';

const ChatBubble = ({ show, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const newMessage = { sender: 'user', text: input };
    setMessages([...messages, newMessage]);
    setInput('');

    try {
      const response = await fetch('http://localhost:3200/asistente/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
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

  const handleInputKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  if (!show) {
    return null;
  }

  return (
    <div className="chat-bubble-overlay" onClick={onClose}>
      <div className="chat-bubble-content" onClick={e => e.stopPropagation()}>
        <div className="chat-bubble-header">
          <span>NOVA: ¿Tienes alguna duda?</span>
          <button className="chat-bubble-close" onClick={onClose}>&times;</button>
        </div>
        <div className="chat-bubble-body">
          <div className="chat-bubble-messages">
            {messages.map((message, index) => (
              <div key={index} className={`chat-bubble-message ${message.sender}`}>
                {message.text}
              </div>
            ))}
          </div>
          <div className="chat-bubble-footer">
            <input
              type="text"
              placeholder="Escribe tu duda"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleInputKeyPress}
            />
            <button onClick={handleSendMessage}><i className="fa fa-paper-plane"></i></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBubble;

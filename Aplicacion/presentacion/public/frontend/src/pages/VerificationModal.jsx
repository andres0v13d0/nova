import React, { useState } from 'react';
import './LoginStyles.css';

const VerificationModal = ({ email, onClose, isForRegistration = true }) => {
  const [codigo, setCodigo] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleVerify = async (e) => {
    e.preventDefault();

    if (!isForRegistration && newPassword !== confirmNewPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      const url = isForRegistration
        ? 'http://localhost:3200/usuario/confirmar-registro'
        : 'http://localhost:3200/usuario/establecer-nueva-contrasena';

      const body = isForRegistration
        ? { correoelectronico: email, codigoConfirmacion: codigo }
        : { correoelectronico: email, codigo, nuevaContrasena: newPassword };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error('Error al confirmar la operación');
      }

      setMessage(isForRegistration ? 'Registro confirmado exitosamente.' : 'Contraseña actualizada exitosamente.');
      onClose();
    } catch (error) {
      setError('Error al confirmar la operación');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{isForRegistration ? 'Verificación de Código' : 'Recuperar Contraseña'}</h2>
        {error && <p className="error">{error}</p>}
        {message && <p className="message">{message}</p>}
        <form onSubmit={handleVerify}>
          <div className="form-group">
            <label htmlFor="codigo">Código de Verificación:</label>
            <input
              type="text"
              id="codigo"
              name="codigo"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              required
            />
          </div>
          {!isForRegistration && (
            <>
              <div className="form-group">
                <label htmlFor="newPassword">Nueva Contraseña:</label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="confirmNewPassword">Confirmar Nueva Contraseña:</label>
                <input
                  type="password"
                  id="confirmNewPassword"
                  name="confirmNewPassword"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  required
                />
              </div>
            </>
          )}
          <div className="button-group">
            <button type="submit" className="login-button">{isForRegistration ? 'Verificar' : 'Actualizar Contraseña'}</button>
            <button type="button" onClick={onClose} className="cancel-button">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerificationModal;

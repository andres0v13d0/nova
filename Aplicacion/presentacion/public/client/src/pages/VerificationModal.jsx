import React, { useState } from 'react';
import { InputOtp } from 'primereact/inputotp';
import { Button } from 'primereact/button';
import './ModalStyles.css';

const VerificationModal = ({ email, onClose, operation = 'registration', pedidoId = null }) => {
  const [codigo, setCodigo] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const customInput = ({events, props}) => {
    return (
      <>
        <input {...events} {...props} type="text" className="custom-otp-input-sample" />
        {props.id === 2 && <div className="px-3"><i className="pi pi-minus" /></div>}
      </>
    );
  };

  const handleVerify = async (e) => {
    e.preventDefault();

    if (operation === 'resetPassword' && newPassword !== confirmNewPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      const url = operation === 'registration'
        ? 'http://localhost:3200/usuario/confirmar-registro'
        : 'http://localhost:3200/usuario/establecer-nueva-contrasena';

      const body = operation === 'registration'
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

      setMessage(operation === 'registration' ? 'Registro confirmado exitosamente.' : 'Contraseña actualizada exitosamente.');
      onClose();
    } catch (error) {
      setError('Error al confirmar la operación');
    }
  };

  const handleFeedbackSubmit = async () => {
    const calificacion = document.getElementById('calificacion').value;
    const comentario = document.getElementById('comentario').value;

    try {
      const response = await fetch('http://localhost:3200/feedback/registrar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ pedidoid: pedidoId, calificacion, comentario, fecha: new Date() })
      });

      if (!response.ok) {
        throw new Error('Error al enviar la calificación');
      }

      alert('Feedback enviado exitosamente');
      onClose();
      window.location.href = '/';
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>
          {operation === 'registration' ? 'Verificación de Código' 
            : operation === 'resetPassword' ? 'Recuperar Contraseña' 
            : 'Califique su experiencia'}
        </h2>
        {error && <p className="error">{error}</p>}
        {message && <p className="message">{message}</p>}
        {operation !== 'feedback' && (
          <form onSubmit={handleVerify}>
            <div className="form-group">
              <label htmlFor="codigo">Código de Verificación:</label>
              <div className="custom-otp-container">
                <InputOtp value={codigo} onChange={(e) => setCodigo(e.value)} length={6} inputTemplate={customInput} style={{gap: 0}}/>
              </div>
            </div>
            {operation === 'resetPassword' && (
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
              <Button label={operation === 'registration' ? 'Verificar' : 'Actualizar Contraseña'} />
              <Button label="Cancelar" onClick={onClose} className="cancel-button" />
            </div>
          </form>
        )}
        {operation === 'feedback' && (
          <>
            <div className="form-group">
              <label htmlFor="calificacion">Calificación:</label>
              <input type="number" id="calificacion" min="1" max="5" />
            </div>
            <div className="form-group">
              <label htmlFor="comentario">Comentario:</label>
              <textarea id="comentario"></textarea>
            </div>
            <button onClick={handleFeedbackSubmit}>Enviar Calificación</button>
          </>
        )}
      </div>
    </div>
  );
};

export default VerificationModal;
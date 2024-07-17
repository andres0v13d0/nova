import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import './ModalStyles.css';

const VerificationModal = ({ email, onClose, isForRegistration }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const history = useHistory();

  const handleVerification = async (e) => {
    e.preventDefault();
    const url = isForRegistration 
      ? 'http://localhost:3200/usuario/verify-registration-code'
      : 'http://localhost:3200/usuario/verify-code';

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ correoelectronico: email, code }),
      });

      if (!response.ok) {
        throw new Error('Error al verificar el código');
      }

      const data = await response.json();
      if (isForRegistration) {
        history.push('/login'); // Redirigir a la página de inicio de sesión después del registro exitoso
      } else {
        history.push('/reset-password'); // Redirigir a la página de restablecimiento de contraseña
      }
    } catch (error) {
      setError('Código de verificación incorrecto');
    }
  };

  return (
    <div className="modal-container">
      <div className="modal-content">
        <h2>Verificación de Código</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleVerification}>
          <div className="form-group">
            <label htmlFor="code">Ingrese el código de 6 dígitos:</label>
            <input
              type="text"
              id="code"
              name="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              maxLength="6"
              pattern="\d{6}" 
            />
          </div>
          <button type="submit" className="login-button">Verificar</button>
          <button type="button" onClick={onClose} className="cancel-button">Cancelar</button>
        </form>
      </div>
    </div>
  );
};

export default VerificationModal;

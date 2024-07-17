import React, { useState } from 'react';
import { useHistory } from 'react-router-dom'; // Importar useHistory
import './ModalStyles.css'; // Asegúrate de crear este archivo CSS

const VerificationModal = ({ email, onClose }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const history = useHistory(); // Definir useHistory

  const handleVerification = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3200/usuario/verify-code', {
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
      // Manejar la respuesta según sea necesario
      history.push('/reset-password'); // Redirigir a la página de restablecimiento de contraseña
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
            <label htmlFor="code">Ingrese el código de 4 dígitos:</label>
            <input
              type="text"
              id="code"
              name="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              maxLength="4"
              pattern="\d{4}" // Solo permite 4 dígitos
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

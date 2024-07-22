import React, { useContext, useEffect, useState } from 'react';
import { MyContext } from '../App';
import './LoginStyles.css';
import { useHistory } from 'react-router-dom';
import VerificationModal from './VerificationModal';

const ForgotPassword = () => {
  const { setisHeaderFooterShow } = useContext(MyContext);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const history = useHistory();

  useEffect(() => {
    setisHeaderFooterShow(false);
    return () => {
      setisHeaderFooterShow(true);
    };
  }, [setisHeaderFooterShow]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3200/usuario/recuperar-contrasena', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ correoelectronico: email }),
      });

      if (!response.ok) {
        throw new Error('Error al solicitar cambio de contraseña');
      }

      setShowModal(true); // Mostrar el modal al enviar el correo
    } catch (error) {
      setError('Error al solicitar cambio de contraseña');
    }
  };

  return (
    <div className="login-container">
      <h2>Olvidé mi Contraseña</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Correo Electrónico:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="login-button">Enviar</button>
        <button type="button" onClick={() => history.push('/login')} className="cancel-button">Cancelar</button>
      </form>
      {showModal && <VerificationModal email={email} operation="resetPassword" onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default ForgotPassword;

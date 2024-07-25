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

      setShowModal(true);
    } catch (error) {
      setError('Error al solicitar cambio de contraseña');
    }
  };

  return (
    <div className="login-page">
      <button className="back-button" onClick={() => history.push('/login')}>
        <i className="pi pi-arrow-left"></i>
      </button>
      <div className="login-container">
        <img src="/images/logo1.png" alt="Logo" className="login-logo" />
        <br>
        </br>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="p-inputgroup flex-1 form-group">
            <span className="p-inputgroup-addon">
              <i className="pi pi-envelope"></i>
            </span>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Correo Electrónico"
              required
            />
          </div>
          <div className="button-group">
            <button type="submit" className="login-button">Enviar</button>
          </div>
        </form>
        {showModal && <VerificationModal email={email} operation="resetPassword" onClose={() => setShowModal(false)} />}
      </div>
    </div>
  );
};

export default ForgotPassword;

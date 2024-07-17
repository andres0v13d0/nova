import React, { useContext, useEffect, useState } from 'react';
import { MyContext } from '../App';
import './LoginStyles.css';
import { useHistory } from 'react-router-dom';
import VerificationModal from './VerificationModal'; // Importa el componente de verificación

const Register = () => {
  const { setisHeaderFooterShow } = useContext(MyContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      const response = await fetch('http://localhost:3200/usuario/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ correoelectronico: email, contrasena: password }),
      });

      if (!response.ok) {
        throw new Error('Error al registrarse');
      }

      const data = await response.json();
      // Manejar la respuesta según sea necesario
      setShowModal(true); // Mostrar el modal para ingresar el código de verificación
    } catch (error) {
      setError('Error al registrarse');
    }
  };

  return (
    <div className="login-container">
      <h2>Registrarse</h2>
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
        <div className="form-group">
          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirmar Contraseña:</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <div className="button-group">
          <button type="submit" className="login-button">Enviar</button>
          <button type="button" onClick={() => history.push('/login')} className="cancel-button">Cancelar</button>
        </div>
      </form>
      <div className="login-links">
        <a onClick={() => history.push('/login')}>Iniciar sesión</a>
        <a onClick={() => history.push('/forgot-password')}>Olvidé mi contraseña</a>
      </div>
      {showModal && <VerificationModal email={email} onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default Register;

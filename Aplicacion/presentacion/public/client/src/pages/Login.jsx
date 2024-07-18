import React, { useContext, useEffect, useState } from 'react';
import { MyContext } from '../App'; // Asegúrate de ajustar la ruta de importación según tu estructura de archivos
import './LoginStyles.css';
import { useHistory, Link } from 'react-router-dom';

const Login = () => {
  const { setisHeaderFooterShow } = useContext(MyContext);

  useEffect(() => {
    // Ocultar header y footer al montar el componente
    setisHeaderFooterShow(false);
    return () => {
      // Mostrar header y footer al desmontar el componente
      setisHeaderFooterShow(true);
    };
  }, [setisHeaderFooterShow]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3200/usuario/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ correoelectronico: email, contrasena: password }),
      });

      if (!response.ok) {
        throw new Error('Inicio de sesión fallido');
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);

      history.push('/');
    } catch (error) {
      setError('Correo electrónico o contraseña incorrectos');
    }
  };

  const handleCancel = () => {
    history.push('/');
  };

  return (
    <div className="login-container">
      <img src="/images/logo1.png" alt="Logo" className="login-logo" / > {/* Agrega la imagen aquí */}
      <h2>Inicio de Sesión</h2>
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
        <div className="button-group">
          <button type="submit" className="login-button">Iniciar Sesión</button>
          <button type="button" onClick={handleCancel} className="cancel-button">Cancelar</button>
        </div>
        <div className="login-links">
          <Link to="/forgot-password">Olvidé mi contraseña</Link>
          <Link to="/register">Registrarse</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;

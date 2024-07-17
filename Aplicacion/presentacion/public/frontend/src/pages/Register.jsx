import React, { useContext, useEffect, useState } from 'react';
import { MyContext } from '../App'; // Asegúrate de ajustar la ruta de importación según tu estructura de archivos
import './LoginStyles.css'; // Usamos el mismo archivo de estilos que Login.jsx
import { useHistory, Link } from 'react-router-dom';

const Register = () => {
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
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const history = useHistory();

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
        throw new Error('Registro fallido');
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);

      history.push('/login');
    } catch (error) {
      setError('Error al registrar el usuario');
    }
  };

  const handleCancel = () => {
    history.push('/');
  };

  return (
    <div className="login-container">
      <h2>Registro</h2>
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
          <button type="submit" className="login-button">Registrarse</button>
          <button type="button" onClick={handleCancel} className="cancel-button">Cancelar</button>
        </div>
        <div className="login-links">
          <Link to="/login">Iniciar sesión</Link>
          <Link to="/forgot-password">Olvidé mi contraseña</Link>
        </div>
      </form>
    </div>
  );
};

export default Register;

import React, { useContext, useEffect, useState } from 'react';
import { MyContext } from '../App';
import './LoginStyles.css';
import { useHistory } from 'react-router-dom';

const ResetPassword = () => {
  const { setisHeaderFooterShow } = useContext(MyContext);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
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
      const response = await fetch('http://localhost:3200/usuario/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        throw new Error('Error al restablecer la contraseña');
      }

      const data = await response.json();
      // Manejar la respuesta según sea necesario
      history.push('/login');
    } catch (error) {
      setError('Error al restablecer la contraseña');
    }
  };

  return (
    <div className="login-container">
      <h2>Restablecer Contraseña</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="password">Nueva Contraseña:</label>
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
          <label htmlFor="confirmPassword">Confirmar Nueva Contraseña:</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="login-button">Restablecer</button>
        <button type="button" onClick={() => history.push('/login')} className="cancel-button">Cancelar</button>
      </form>
    </div>
  );
};

export default ResetPassword;

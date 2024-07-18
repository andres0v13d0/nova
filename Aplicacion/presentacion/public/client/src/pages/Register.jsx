import React, { useContext, useEffect, useState } from 'react';
import { MyContext } from '../App';
import './RegisterStyles.css';
import { useHistory } from 'react-router-dom';
import VerificationModal from './VerificationModal';

const Register = () => {
  const { setisHeaderFooterShow } = useContext(MyContext);
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');
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
      const response = await fetch('http://localhost:3200/usuario/registro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre,
          apellido,
          correoelectronico: email,
          contrasena: password,
          direccion,
          telefono,
          rol: 'cliente'
        }),
      });

      if (!response.ok) {
        throw new Error('Error al registrarse');
      }

      const data = await response.json();
      setShowModal(true);
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
          <label htmlFor="nombre">Nombre:</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="apellido">Apellido:</label>
          <input
            type="text"
            id="apellido"
            name="apellido"
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
            required
          />
        </div>
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
        <div className="form-group">
          <label htmlFor="direccion">Dirección:</label>
          <input
            type="text"
            id="direccion"
            name="direccion"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="telefono">Teléfono:</label>
          <input
            type="text"
            id="telefono"
            name="telefono"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            required
          />
        </div>
        <div className="button-group">
          <button type="submit" className="login-button">Enviar</button>
          <button type="button" onClick={() => history.push('/login')} className="cancel-button">Cancelar</button>
        </div>
        <div className="login-links">
          <a onClick={() => history.push('/login')}>Iniciar sesión</a>
        </div>
      </form>
      {showModal && <VerificationModal email={email} onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default Register;

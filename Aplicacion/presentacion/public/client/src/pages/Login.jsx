import React, { useContext, useEffect, useState, useRef } from 'react';
import { MyContext } from '../App';
import './LoginStyles.css';
import { useHistory, Link } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Messages } from 'primereact/messages';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

const Login = () => {
  const { setisHeaderFooterShow } = useContext(MyContext);

  useEffect(() => {
    setisHeaderFooterShow(false);
    return () => {
      setisHeaderFooterShow(true);
    };
  }, [setisHeaderFooterShow]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const msgs = useRef(null);
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

      msgs.current.show({ severity: 'success', summary: 'Success', detail: 'Inicio de sesión exitoso' });
      setTimeout(() => {
        history.push('/');
      }, 2000);
    } catch (error) {
      msgs.current.show({ severity: 'error', summary: 'Error', detail: 'Correo electrónico o contraseña incorrectos' });
    }
  };

  const handleCancel = () => {
    history.push('/');
  };

  return (
    <div className="login-page">
      <Messages ref={msgs} className="login-messages" />
      <button className="back-button" onClick={handleCancel}>
        <i className="pi pi-arrow-left"></i>
      </button>
      <div className="login-container">
        <img src="/images/logo1.png" alt="Logo" className="login-logo" />
        <br />
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="p-inputgroup flex-1 form-group">
            <span className="p-inputgroup-addon">
              <i className="pi pi-envelope"></i>
            </span>
            <InputText
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Correo Electrónico"
              required
            />
          </div>
          <div className="p-inputgroup flex-1 form-group">
            <span className="p-inputgroup-addon">
              <i className="pi pi-lock"></i>
            </span>
            <InputText
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              required
            />
            <span className="p-inputgroup-addon">
              <button type="button" onClick={() => setShowPassword(!showPassword)}>
                <i className={showPassword ? "pi pi-eye-slash" : "pi pi-eye"}></i>
              </button>
            </span>
          </div>
          <div className="form-group remember-me">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label htmlFor="rememberMe">Recordar contraseña</label>
          </div>
          <div className="button-group">
            <button type="submit" className="login-button">INICIAR SESION</button>
          </div>
          <div className="login-links">
            <Link to="/forgot-password">Olvidé mi contraseña</Link>
            <Link to="/register">Registrarse</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
import React, { useContext, useEffect, useState } from 'react';
import { MyContext } from '../App'; // Asegúrate de ajustar la ruta de importación según tu estructura de archivos
import './LoginStyles.css';
import { useHistory, Link } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import 'primereact/resources/themes/saga-blue/theme.css'; // Estilo de tema
import 'primereact/resources/primereact.min.css'; // Estilo de componentes
import 'primeicons/primeicons.css'; // Iconos

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
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
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
    <div className="login-page">
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
            <button type="submit" className="login-button">Iniciar Sesión</button>
            <button type="button" onClick={handleCancel} className="cancel-button">Cancelar</button>
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

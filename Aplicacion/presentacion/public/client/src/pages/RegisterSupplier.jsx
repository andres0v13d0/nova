import React, { useState, useEffect, useContext } from 'react';
import { MyContext } from '../App'; // Ajusta la ruta según tu estructura de archivos
import './RegisterStyles.css';
import { useHistory } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import 'primereact/resources/themes/saga-blue/theme.css'; // Estilo de tema
import 'primereact/resources/primereact.min.css'; // Estilo de componentes
import 'primeicons/primeicons.css'; // Iconos

const RegisterSupplier = () => {
  const { setisHeaderFooterShow } = useContext(MyContext);
  const [ruc, setRuc] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [estadoRuc, setEstadoRuc] = useState('');
  const [nombreEmpresa, setNombreEmpresa] = useState('');
  const [direccionEmpresa, setDireccionEmpresa] = useState('');
  const [estadoEmpresa, setEstadoEmpresa] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');
  const [error, setError] = useState('');
  const history = useHistory();

  useEffect(() => {
    setisHeaderFooterShow(false);
    return () => {
      setisHeaderFooterShow(true);
    };
  }, [setisHeaderFooterShow]);

  const handleRucValidation = async (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      try {
        const response = await fetch(`http://localhost:3200/proveedor/buscarRuc/${ruc}`);
        if (!response.ok) {
          throw new Error('Error al validar el RUC');
        }
        const data = await response.json();
        setEstadoRuc(data.estadoRuc);
        setNombreEmpresa(data.nombreEmpresa);
        setDireccionEmpresa(data.direccionEmpresa);
        setEstadoEmpresa(data.estadoEmpresa);
      } catch (error) {
        setError('Error al validar el RUC');
      }
    }
  };

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
          ruc,
          estadoRuc,
          nombreEmpresa,
          direccionEmpresa,
          estadoEmpresa,
          rol: 'proveedor'
        }),
      });

      if (!response.ok) {
        throw new Error('Error al registrarse');
      }

      const data = await response.json();
      history.push('/login');
    } catch (error) {
      setError('Error al registrarse');
    }
  };

  const passwordHeader = <div className="font-bold mb-3">Elige una contraseña</div>;
  const passwordFooter = (
    <div className="password-suggestions">
      <ul className="pl-2 ml-2 mt-0 line-height-3">
        <li>Al menos una letra minúscula</li>
        <li>Al menos una letra mayúscula</li>
        <li>Al menos un número</li>
        <li>Mínimo 8 caracteres</li>
      </ul>
    </div>
  );

  return (
    <div className="register-page">
      <button className="back-button" onClick={() => history.push('/register')}>
        <i className="pi pi-arrow-left"></i>
      </button>
      <div className="register-container">
        <img src="/images/logo1.png" alt="Logo" className="login-logo" />
        <br />
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="p-inputgroup flex-1 form-group">
              <span className="p-inputgroup-addon">
                <i className="pi pi-id-card"></i>
              </span>
              <InputText
                type="text"
                id="ruc"
                name="ruc"
                value={ruc}
                onChange={(e) => setRuc(e.target.value)}
                placeholder="RUC"
                required
                onKeyPress={handleRucValidation}
              />
            </div>
            <div className="p-inputgroup flex-1 form-group">
              <span className="p-inputgroup-addon">
                <i className="pi pi-id-card"></i>
              </span>
              <InputText
                type="text"
                id="estadoRuc"
                name="estadoRuc"
                value={estadoRuc}
                onChange={(e) => setEstadoRuc(e.target.value)}
                placeholder="Estado del RUC"
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="p-inputgroup flex-1 form-group">
              <span className="p-inputgroup-addon">
                <i className="pi pi-id-card"></i>
              </span>
              <InputText
                type="text"
                id="nombreEmpresa"
                name="nombreEmpresa"
                value={nombreEmpresa}
                onChange={(e) => setNombreEmpresa(e.target.value)}
                placeholder="Nombre de la Empresa"
                required
              />
            </div>
            <div className="p-inputgroup flex-1 form-group">
              <span className="p-inputgroup-addon">
                <i className="pi pi-home"></i>
              </span>
              <InputText
                type="text"
                id="direccionEmpresa"
                name="direccionEmpresa"
                value={direccionEmpresa}
                onChange={(e) => setDireccionEmpresa(e.target.value)}
                placeholder="Dirección de la Empresa"
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="p-inputgroup flex-1 form-group">
              <span className="p-inputgroup-addon">
                <i className="pi pi-id-card"></i>
              </span>
              <InputText
                type="text"
                id="estadoEmpresa"
                name="estadoEmpresa"
                value={estadoEmpresa}
                onChange={(e) => setEstadoEmpresa(e.target.value)}
                placeholder="Estado de la Empresa"
                required
              />
            </div>
            <div className="p-inputgroup flex-1 form-group">
              <span className="p-inputgroup-addon">
                <i className="pi pi-user"></i>
              </span>
              <InputText
                type="text"
                id="nombre"
                name="nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Nombre"
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="p-inputgroup flex-1 form-group">
              <span className="p-inputgroup-addon">
                <i className="pi pi-user"></i>
              </span>
              <InputText
                type="text"
                id="apellido"
                name="apellido"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                placeholder="Apellido"
                required
              />
            </div>
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
          </div>
          <div className="form-row">
            <div className="form-group password-group">
              <div className="p-inputgroup flex-1">
                <span className="p-inputgroup-addon">
                  <i className="pi pi-lock"></i>
                </span>
                <Password
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  header={passwordHeader}
                  footer={passwordFooter}
                  placeholder="Contraseña"
                  required
                  feedback={true}
                />
              </div>
            </div>
            <div className={`p-inputgroup flex-1 form-group ${confirmPassword && (password === confirmPassword ? 'match' : 'no-match')}`}>
              <span className="p-inputgroup-addon">
                <i className="pi pi-lock"></i>
              </span>
              <InputText
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirmar Contraseña"
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="p-inputgroup flex-1 form-group">
              <span className="p-inputgroup-addon">
                <i className="pi pi-home"></i>
              </span>
              <InputText
                type="text"
                id="direccion"
                name="direccion"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                placeholder="Dirección"
                required
              />
            </div>
            <div className="p-inputgroup flex-1 form-group">
              <span className="p-inputgroup-addon">
                <i className="pi pi-phone"></i>
              </span>
              <InputText
                id="telefono"
                name="telefono"
                keyfilter="int"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                placeholder="Teléfono"
                required
              />
            </div>
          </div>
          <div className="button-group">
            <button type="submit" className="login-button">REGISTRARSE</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterSupplier;

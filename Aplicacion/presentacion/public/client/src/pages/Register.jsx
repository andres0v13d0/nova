import React, { useContext, useEffect, useState } from 'react';
import { MyContext } from '../App';
import './RegisterStyles.css';
import { useHistory } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import 'primereact/resources/themes/saga-blue/theme.css'; // Estilo de tema
import 'primereact/resources/primereact.min.css'; // Estilo de componentes
import 'primeicons/primeicons.css'; // Iconos
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
  const [cedula, setCedula] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const history = useHistory();

  useEffect(() => {
    setisHeaderFooterShow(false);
    return () => {
      setisHeaderFooterShow(true);
    };
  }, [setisHeaderFooterShow]);

  const validateCedula = (cedula) => {
    // Implementación simplificada para validar cédula ecuatoriana
    let total = 0;
    let longitud = cedula.length;
    let longCheck = longitud - 1;

    if (cedula !== "" && longitud === 10) {
      for (let i = 0; i < longCheck; i++) {
        if (i % 2 === 0) {
          let aux = cedula.charAt(i) * 2;
          if (aux > 9) aux -= 9;
          total += aux;
        } else {
          total += parseInt(cedula.charAt(i), 10);
        }
      }

      total = total % 10 ? 10 - total % 10 : 0;

      if (cedula.charAt(longCheck) === String(total)) {
        return true;
      }
    }
    return false;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (!validateCedula(cedula)) {
      setError('Cédula inválida');
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
          cedula,
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
      <button className="back-button" onClick={() => history.push('/login')}>
        <i className="pi pi-arrow-left"></i>
      </button>
      <div className="register-container">
        <img src="/images/logo1.png" alt="Logo" className="login-logo" />
        <br></br>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
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
          <div className="p-inputgroup flex-1 form-group">
            <span className="p-inputgroup-addon">
              <i className="pi pi-id-card"></i>
            </span>
            <InputText
              id="cedula"
              name="cedula"
              keyfilter="int"
              value={cedula}
              onChange={(e) => setCedula(e.target.value)}
              placeholder="Número de Cédula"
              required
            />
          </div>
          <div className="button-group">
            <button type="submit" className="login-button">REGISTRARSE</button>
          </div>
        </form>
        {showModal && <VerificationModal email={email} operation="registration" onClose={() => setShowModal(false)} />}
      </div>
    </div>
  );
};

export default Register;

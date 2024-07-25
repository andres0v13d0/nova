import React, { useState, useEffect, useRef } from "react";
import logo from "../../components/assets/images/logo.jpg";
import { Link, useHistory } from "react-router-dom";
import ChatModal from "./ChatModal";
import "./ChatModalStyles.css";
import "./SearchStyles.css"; // Importa el archivo CSS para el submenú

const Search = ({ CartItem, setProductos }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showChatModal, setShowChatModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false); // Estado para mostrar/ocultar el submenú
  const [userRole, setUserRole] = useState(null); // Estado para el rol del usuario
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Estado para comprobar si el usuario está autenticado
  const history = useHistory();
  const userMenuRef = useRef();

  useEffect(() => {
    // Aquí puedes obtener el rol del usuario desde el contexto, una llamada a la API, o desde el almacenamiento local
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      // Establece el rol del usuario aquí, esto es un ejemplo
      // setUserRole('administrador'); // Cambiar según el rol real
    } else {
      setIsAuthenticated(false);
    }

    // Añadir un evento de clic para cerrar el submenú cuando se haga clic fuera de él
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = async (e) => {
    setSearchTerm(e.target.value);

    try {
      const response = await fetch(`http://localhost:3200/catalogo/productos?nombre=${e.target.value}`);
      const productosFiltrados = await response.json();
      const shopItems = productosFiltrados.map(producto => ({
        id: producto.productoid,
        cover: producto.imagen ? `data:image/png;base64,${producto.imagen}` : 'default-image-path', // Ajusta la ruta de la imagen por defecto si `imagen` es null
        name: producto.nombre,
        price: producto.precio, // Ajusta este campo según sea necesario
        discount: "0", // Ajusta este campo según sea necesario
      }));
      setProductos(shopItems);
    } catch (error) {
      console.error('Error al filtrar productos:', error);
    }
  };

  const handleUserIconClick = () => {
    if (isAuthenticated) {
      setShowUserMenu(!showUserMenu);
    } else {
      history.push('/login');
    }
  };

  const handleLogout = () => {
    // Lógica para cerrar la sesión del usuario
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    history.push('/login');
  };

  return (
    <>
      <section className='search'>
        <div className='container c_flex'>
          <div className='logo width '>
            <a href='/'>
              <img src={logo} alt='' />
            </a>
          </div>

          <div className='search-box f_flex'>
            <i className='fa fa-search'></i>
            <input
              type='text'
              placeholder='Buscar Producto ...'
              value={searchTerm}
              onChange={handleSearch}
            />
            <span>Todas las Categorias</span>
          </div>

          <div className='icon f_flex width'>
            <div className="cart" onClick={() => setShowChatModal(true)}>
              <i className="fa fa-robot icon-circle"></i>
            </div>

            <div className="user-menu" ref={userMenuRef}>
              <i className="fa fa-user icon-circle" onClick={handleUserIconClick}></i>
              {showUserMenu && isAuthenticated && (
                <div className="submenu">
                  {userRole === 'administrador' && (
                    <>
                      <Link to="/admin/dashboard">Administración</Link>
                      <button onClick={handleLogout}>Salir</button>
                    </>
                  )}
                  {userRole === 'proveedor' && (
                    <>
                      <Link to="/provider/dashboard">Ingresar Producto</Link>
                      <button onClick={handleLogout}>Salir</button>
                    </>
                  )}
                  {userRole === 'cliente' && (
                    <>
                      <Link to="/user/settings">Configurar Datos</Link>
                      <button onClick={handleLogout}>Salir</button>
                    </>
                  )}
                </div>
              )}
            </div>

            <div className='cart'>
              <Link to='/cart'>
                <i className='fa fa-shopping-bag icon-circle'></i>
                <span>{CartItem.length === 0 ? "" : CartItem.length}</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <ChatModal show={showChatModal} onClose={() => setShowChatModal(false)} />
    </>
  );
};

export default Search;

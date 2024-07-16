import React, { useState } from "react";
import logo from "../../components/assets/images/logo.jpg";
import { Link, useHistory } from "react-router-dom";
import ChatBubble from "./ChatBubble"; 
import "./ChatBubbleStyles.css"; 

const Search = ({ CartItem, setProductos }) => {
  const [searchTerm, setSearchTerm] = useState('');

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

  // fixed Header
  window.addEventListener("scroll", function () {
    const search = document.querySelector(".search");
    search.classList.toggle("active", window.scrollY > 100);
  });
  const history = useHistory();


  const [showChatBubble, setShowChatBubble] = useState(false);


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
          <div className="cart" onClick={() => setShowChatBubble(true)}>
              <i className="fa fa-robot icon-circle"></i>
            </div>

            <div className="cart" onClick={() => history.push('/login')}>
              <i className="fa fa-user icon-circle"></i>
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

      <ChatBubble show={showChatBubble} onClose={() => setShowChatBubble(false)} />
    </>
  );
};

export default Search;

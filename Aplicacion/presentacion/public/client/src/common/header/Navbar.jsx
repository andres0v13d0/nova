import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./NavbarStyles.css"; // Asegúrate de importar el archivo CSS

const Navbar = () => {
  const [MobileMenu, setMobileMenu] = useState(false);
  const [showSubMenu, setShowSubMenu] = useState({
    componentes: false,
    perifericos: false,
    monitores: false,
    pcs: false,
    laptops: false,
    consolas: false,
    audioVideo: false,
  });

  const toggleSubMenu = (menu) => {
    setShowSubMenu((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };

  return (
    <header className="header">
      <div className="container d_flex">
        <div className="navlink">
          <ul className={MobileMenu ? "nav-links-MobileMenu" : "link f_flex capitalize"} onClick={() => setMobileMenu(false)}>
            <li>
              <Link to="/">Tienda</Link>
            </li>
            <li onMouseEnter={() => toggleSubMenu('componentes')} onMouseLeave={() => toggleSubMenu('componentes')}>
              <Link to="/pages">Componentes de PC</Link>
              {showSubMenu.componentes && (
                <ul className="sub-menu">
                  <li><Link to="/pages/cpu">CPU</Link></li>
                  <li><Link to="/pages/gpu">GPU</Link></li>
                  <li><Link to="/pages/ram">RAM</Link></li>
                </ul>
              )}
            </li>
            <li onMouseEnter={() => toggleSubMenu('perifericos')} onMouseLeave={() => toggleSubMenu('perifericos')}>
              <Link to="/user">Perifericos</Link>
              {showSubMenu.perifericos && (
                <ul className="sub-menu">
                  <li><Link to="/user/teclados">Teclados</Link></li>
                  <li><Link to="/user/ratones">Ratones</Link></li>
                  <li><Link to="/user/auriculares">Auriculares</Link></li>
                </ul>
              )}
            </li>
            <li onMouseEnter={() => toggleSubMenu('monitores')} onMouseLeave={() => toggleSubMenu('monitores')}>
              <Link to="/vendor">Monitores</Link>
              {showSubMenu.monitores && (
                <ul className="sub-menu">
                  <li><Link to="/vendor/4k">4K</Link></li>
                  <li><Link to="/vendor/1080p">1080p</Link></li>
                </ul>
              )}
            </li>
            <li>
              <Link to="/track">PCs</Link>
            </li>
            <li>
              <Link to="/contact">Laptops</Link>
            </li>
            <li>
              <Link to="/track">Consolas</Link>
            </li>
            <li>
              <Link to="/contact">Audio y Video</Link>
            </li>
            <li>
              <Link to="/contact">Conocenos</Link>
            </li>
          </ul>

          <button className="toggle" onClick={() => setMobileMenu(!MobileMenu)}>
            {MobileMenu ? <i className="fas fa-times close home-btn"></i> : <i className="fas fa-bars open"></i>}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

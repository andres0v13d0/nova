import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./NavbarStyles1.css"; // Asegúrate de importar el archivo CSS

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
            </li>
            <li onMouseEnter={() => toggleSubMenu('perifericos')} onMouseLeave={() => toggleSubMenu('perifericos')}>
              <Link to="/user">Perifericos</Link>
            </li>
            <li onMouseEnter={() => toggleSubMenu('monitores')} onMouseLeave={() => toggleSubMenu('monitores')}>
              <Link to="/vendor">Monitores</Link>
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
        </div>
      </div>
    </header>
  );
};

export default Navbar;

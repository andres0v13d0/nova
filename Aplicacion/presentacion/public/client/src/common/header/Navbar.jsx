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
            
            <li>
              <Link to="/Conocenos">Conocenos</Link>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

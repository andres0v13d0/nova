import React, { useState } from "react"
import { Link } from "react-router-dom"

const Navbar = () => {
  // Toogle Menu
  const [MobileMenu, setMobileMenu] = useState(false)
  return (
    <>
      <header className='header'>
        <div className='container d_flex'>
          <div className='navlink'>
            <ul className={MobileMenu ? "nav-links-MobileMenu" : "link f_flex capitalize"} onClick={() => setMobileMenu(false)}>
              {/*<ul className='link f_flex uppercase {MobileMenu ? "nav-links-MobileMenu" : "nav-links"} onClick={() => setMobileMenu(false)}'>*/}
              <li>
                <Link to='/'>Tienda</Link>
              </li>
              <li>
                <Link to='/pages'>Componentes de PC</Link>
              </li>
              <li>
                <Link to='/user'>Perifericos</Link>
              </li>
              <li>
                <Link to='/vendor'>Monitores</Link>
              </li>
              <li>
                <Link to='/track'>PCs</Link>
              </li>
              <li>
                <Link to='/contact'>Laptops</Link>
              </li>
              <li>
                <Link to='/track'>Consolas</Link>
              </li>
              <li>
                <Link to='/contact'>Audio y Video</Link>
              </li>
              <li>
                <Link to='/contact'>Conocenos</Link>
              </li>
            </ul>

            <button className='toggle' onClick={() => setMobileMenu(!MobileMenu)}>
              {MobileMenu ? <i className='fas fa-times close home-btn'></i> : <i className='fas fa-bars open'></i>}
            </button>
          </div>
        </div>
      </header>
    </>
  )
}

export default Navbar

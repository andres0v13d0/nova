import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './UserMenu.css';

const UserMenu = ({ isOpen, toggleMenu }) => {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        toggleMenu(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, toggleMenu]);

  return (
    isOpen && (
      <div className="dropdown-menu" ref={menuRef}>
        <ul>
          <li>
            <Link to="/account" onClick={() => toggleMenu(false)}>
              <i className="fa fa-user"></i> My Account
            </Link>
          </li>
          <li>
            <Link to="/orders" onClick={() => toggleMenu(false)}>
              <i className="fa fa-clipboard"></i> Orders
            </Link>
          </li>
          <li>
            <Link to="/wishlist" onClick={() => toggleMenu(false)}>
              <i className="fa fa-heart"></i> My List
            </Link>
          </li>
          <li>
            <Link to="/logout" onClick={() => toggleMenu(false)}>
              <i className="fa fa-sign-out-alt"></i> Logout
            </Link>
          </li>
        </ul>
      </div>
    )
  );
};

export default UserMenu;

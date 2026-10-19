import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import menuOptions from '../../menuoptions';

const SideNav = () => {
  const location = useLocation(); // This gives you the current URL path

  return (
    <div className="sidenav-custom min-vh-100 border-top-1">
      <ul className="list-group list-group-flush px-3">
        {menuOptions.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.id}
              to={item.path}
              className="text-decoration-none mt-4"
            >
              <li
                className={`list-group-item d-flex align-items-center bg-transparent border-0 text-dark ${
                  isActive ? 'active shadow' : ''
                }`}
              >
                <i className={`${item.icon} me-2`}></i>
                <span>{item.label}</span>
              </li>
            </Link>
          );
        })}
      </ul>
    </div>
  );
};

export default SideNav;

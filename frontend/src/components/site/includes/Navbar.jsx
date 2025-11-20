// frontend/src/components/Navbar.js
import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";
import logo from "../../../assets/images/logos/logo_yummy_nouilles.png";

import { useAuth } from "../../../contexts/AuthContext";

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();

  const classActive =
    "cursor-pointer underline underline-offset-4 md:decoration-4 md:decoration-red-yummy font-title mr-2";
  const baseClass = "cursor-pointer font-title mr-2";

  return (
    <header className="mr-2 mb-3 md:ml-0 md:mr-0 mt-2 flex flex-row justify-between md:justify-start md:items-center">
      <Link to="/">
        <img className="ml-3 h-20" src={logo} alt="Yummy Nouilles Logo" />
      </Link>
      <nav>
        <ul className="md:ml-3 hidden md:inline-flex">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? `${classActive}` : `${baseClass}`
              }
            >
              Accueil
            </NavLink>
            <NavLink
              to="/items"
              className={({ isActive }) =>
                isActive ? `${classActive}` : `${baseClass}`
              }
            >
              Menu
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                isActive ? `${classActive}` : `${baseClass}`
              }
            >
              Contact
            </NavLink>

            {isAuthenticated ? (
              <button
                onClick={logout}
                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              >
                Logout
              </button>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    isActive ? `${classActive}` : `${baseClass}`
                  }
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className={({ isActive }) =>
                    isActive ? `${classActive}` : `${baseClass}`
                  }
                >
                  Register
                </NavLink>
              </>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;

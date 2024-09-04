import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const username = localStorage.getItem('username'); // Učitaj korisničko ime iz localStorage
  const role = localStorage.getItem('role');


  const handleLogout = () => {
    // Ukloni token iz localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <ul className="navbar-links">
        {username && (
          <li>
            <p className="welcome">Welcome {username}</p>
          </li>
        )}
        <li>
          <Link to="/home" className={location.pathname === "/home" ? "active" : ""}>Main</Link>
        </li>
        <li>
          <Link to="/objects" className={location.pathname === "/objects" ? "active" : ""}>Objects</Link>
        </li>
        {role === "Admin" && (
          <li>
            <Link to="/users" className={location.pathname === "/users" ? "active" : ""}>Users</Link>
          </li>
        )}
        {(role === "Manager" || role === "RegularUser") && (
          <li>
            <Link to="/managers" className={location.pathname === "/managers" ? "active" : ""}>Managers</Link>
          </li>
        )}
        <li>
          <Link to="/myprofile" className={location.pathname === "/myprofile" ? "active" : ""}>My profile</Link>
        </li>
        <li>
          <button onClick={handleLogout}>Logout</button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;

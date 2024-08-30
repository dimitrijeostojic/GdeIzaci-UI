import React from 'react';
import { Route, Navigate } from 'react-router-dom';

// Ova komponenta proverava da li je korisnik ulogovan
const PrivateRoute = ({ element, ...rest }) => {
  const token = localStorage.getItem('token');
  
  // Ako nema tokena, preusmeri korisnika na stranicu za prijavu
  return token ? element : <Navigate to="/login" />;
};

export default PrivateRoute;

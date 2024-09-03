import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import PrivateRoute from './components/PrivateRoute';
import Objects from './components/Objects';
import MyProfile from './components/MyProfile';
import ObjectDetails from './components/ObjectDetails';
import UsersList from './components/UsersList';
import ManagersList from './components/ManagersList';
import ManagerObjects from './components/ManagerObjects';

function App() {

  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    // Osvježi token prilikom montaže komponente
    setToken(localStorage.getItem('token'));
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Register />} />{" "}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Koristi PrivateRoute za zaštićene rute */}
        <Route path="/home" element={<PrivateRoute element={<Home />} />} />
        <Route path="/objects" element={<PrivateRoute element={<Objects />} />} />
        <Route path="/objects/:id" element={<PrivateRoute element={<ObjectDetails />} />} /> {/* Detalji objekta */}
        <Route path="/managers" element={<PrivateRoute element={<ManagersList />} />} />
        <Route path="/manager/:userId/objects" element={<PrivateRoute element={<ManagerObjects />} />} />
        <Route path="/users" element={<PrivateRoute element={<UsersList />} />} />
        <Route path="/myprofile" element={<PrivateRoute element={<MyProfile />} />} />
      </Routes>
    </Router>
  );
}


export default App;

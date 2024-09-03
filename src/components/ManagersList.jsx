import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/ManagersList.css';
import Navbar from './Navbar';
import ManagerCard from './ManagerCard';

const ManagersList = () => {
  const [managers, setManagers] = useState([]);
  const token = localStorage.getItem('token'); // Ili odakle god dohvatate token

  const GetManagers = async () => {
    try {
      const response = await axios.get('https://localhost:5000/api/User/managers', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setManagers(response.data);
    } catch (error) {
      console.error('Error fetching managers:', error);
    }
  }

  useEffect(() => {
    GetManagers();
  }, []);

  return (
    <div className="managers">
      <Navbar />
      <div className="managers-list">
        <h2>Managers List</h2>
        {managers && managers.length > 0 ? (
          managers.map((manager, index) => (

            <ManagerCard key={index} id={manager.id} userName={manager.userName} email={manager.email} numberOfObjects={manager.numberOfObjects} />

          ))
        ) : (
          <p>No managers found.</p>
        )}
      </div>
    </div>
  );
}

export default ManagersList;

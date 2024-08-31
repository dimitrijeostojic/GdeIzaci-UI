import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/ManagersList.css';
import Navbar from './Navbar';
import ManagerCard from './ManagerCard';

function ManagersList() {
  const [managers, setManagers] = useState([]);
  const token = localStorage.getItem('token'); // Ili odakle god dohvatate token

  useEffect(() => {
    axios.get('https://localhost:5000/api/User/managers', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        console.log(response.data);
        setManagers(response.data);
      })
      .catch(error => {
        console.error('Error fetching managers:', error);
      });
  }, []);

  return (
    <div className="managers">
      <div className="managers-list">
        <Navbar />
        <h2>Managers List</h2>
        {managers && managers.length > 0 ? (
          managers.map((manager, index) => (
            
              <ManagerCard key={index} userName={manager.userName} email={manager.email} numberOfObjects={manager.numberOfObjects}/>
            
          ))
        ) : (
          <p>No managers found.</p>
        )}
      </div>
    </div>
  );
}

export default ManagersList;

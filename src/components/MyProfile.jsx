import React, { useEffect, useState } from 'react'
import Navbar from './Navbar'
import axios from 'axios';
import ObjectCard from './ObjectCard';
import '../styles/MyProfile.css';
import { jwtDecode } from 'jwt-decode';

const MyProfile = () => {
  const token = localStorage.getItem('token');
  const [objects, setObjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [email, setEmail] = useState('');
  const username = localStorage.getItem('username');
  const role = localStorage.getItem('role');
  const decodedToken = jwtDecode(token);

  const fetchObjects = async () => {
    try {
      const response = await axios.get('https://localhost:5000/api/Place', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const selected = response.data.slice(-8);
      setObjects(selected);
    } catch (error) {
      console.error('Error fetching objects:', error);
    }
  };

  useEffect(() => {
    fetchObjects();
    const email = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"];
    setEmail(email);
  }, []);

  return (
    <div className='my-profile'>
      <Navbar />
      <div className="my-profile-details">
        <div className='my-profile-content'>
          <h3>{username.toUpperCase()}</h3>
          <p>{role.toUpperCase()}</p>
          <p><a href={`mailto:${email}`}>{email}</a></p>
        </div>
      </div>
      <div className="my-profile-objects">
        <div className='my-profile-title'>
          <h2>New Objects</h2>
        </div>
        <div className="objects-container">
          <div className="objects-grid">
            {objects.map((obj, index) => (
              <ObjectCard key={index} id={obj.placeID} photo={obj.photo} name={obj.name} price={obj.price} location={obj.location} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyProfile
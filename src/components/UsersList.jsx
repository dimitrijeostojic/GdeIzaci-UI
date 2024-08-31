import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/UsersList.css';
import Navbar from './Navbar';
import UserCard from './UserCard';

function UsersList() {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem('token'); // Ili odakle god dohvatate token


  // Funkcija za osvežavanje korisnika
  const fetchUsers = async () => {
    try {
      const response = await axios.get('https://localhost:5000/api/User/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
   fetchUsers();
  }, []);

  return (
    <div className="users">
      <div className="users-list">
        <Navbar />
        <h2>Users List</h2>
        {users && users.length > 0 ? (
          users.map((user, index) => (
              <UserCard key={index} userName={user.userName} email={user.email} numberOfObjects={user.numberOfObjects} role={user.roles[0]} userId={user.id} refreshUsers={fetchUsers}/>
          ))
        ) : (
          <p>No users found.</p>
        )}
      </div>
    </div>
  );
}

export default UsersList;

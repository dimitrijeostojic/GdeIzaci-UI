import React, { useEffect, useState } from 'react'
import Navbar from './Navbar';
import axios from 'axios';
import ObjectCard from './ObjectCard';
import { useParams } from 'react-router-dom';
import '../styles/ManagerObjects.css';

const ManagerObjects = () => {
    const [objects, setObjects] = useState([]);
    const token = localStorage.getItem('token');
    const { userId } = useParams();
    const [username, setUsername] = useState('');

    const fetchObjects = async () => {
        const response = await axios.get('https://localhost:5000/api/Place', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const filteredObjects = response.data.filter(obj => obj.userCreatedID === userId);
        setObjects(filteredObjects);
    }

    const fetchUser = async () => {
        const response = await axios.get(`https://localhost:5000/api/User/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        setUsername(response.data.userName);
    }

    useEffect(() => {
        fetchObjects();
        fetchUser();
    }, [userId])


    return (
        <div className='manager-objects'>
            <Navbar />
            <div className="manager-username">
                <h2>{username}'s objects</h2>
            </div>
            <div className="manager-objects-container">
                <div className="objects-grid">
                    {objects.map((obj, index) => (
                        <ObjectCard key={index} id={obj.placeID} date={obj.date} photo={obj.photo} name={obj.name} price={obj.price} location={obj.location} />
                    ))}
                </div>

            </div>
        </div>
    )
}

export default ManagerObjects
import React, { useEffect, useState } from 'react';
import '../styles/Home.css';
import Navbar from './Navbar';
import axios from 'axios';
import StatisticsCard from './StatisticsCard';
import HomeDescription from './HomeDescription';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFaceSmileBeam, faChartPie, faBuilding } from '@fortawesome/free-solid-svg-icons';
import ObjectCard from './ObjectCard';

const Home = () => {
    const [objects, setObjects] = useState([]);

    const description = {
        text: 'Discover the ultimate convenience with our Reservations App, designed to streamline your booking experience across a diverse array of establishments. From securing a room in luxurious rooftops to reserving tables at vibrant restaurants, organizing meetings in dedicated spaces, and even booking time slots in sports halls or computer centers, our app provides a seamless solution for all your reservation needs. Whether you are planning a leisurely escape or ensuring a productive work environment, our user-friendly platform simplifies the process, offering unparalleled accessibility for a variety of services and venues. Download our Reservations App today and unlock a world of effortless bookings at your fingertips.',
        image1: 'https://res.cloudinary.com/dlj9ylhsb/image/upload/v1724680024/375edbe5-city-6080-1666615a2c3_qstd4m.jpg',
        image2: 'https://res.cloudinary.com/dlj9ylhsb/image/upload/v1724680023/dubai-marina-skyline-2c8f1708f2a1_kut6fq.jpg'
    };

    const statistics = [
        {
            title: 'Number of\nsatisfied\ncustomers',
            number: '500',
            icon: faFaceSmileBeam,
        },
        {
            title: 'Number of available\nobjects',
            number: '1500',
            icon: faBuilding,
        },
        {
            title: 'Total number of\nobjects',
            number: '5684',
            icon: faChartPie,
        },
    ];

    useEffect(() => {
        const fetchObjects = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('https://localhost:5000/api/Place', {
                    headers: {
                        'Authorization': `Bearer ${token}`  // Dodaj token u zaglavlje
                    }
                });
                const selected = response.data.slice(-8);
                // console.log(response.data);
                setObjects(selected);
            } catch (error) {
                console.error('Error fetching objects:', error);
            }
        };

        fetchObjects();
    }, []);

    return (
        <div className="home-container">
            <Navbar />
            <div className="home-content">
                <div className='home-title'>
                    <h2>New Objects</h2>
                </div>

                <div className="objects-container">
                    <div className="objects-grid">
                        {objects.map((obj, index) => (
                            <ObjectCard key={index} id={obj.placeID} photo={obj.photo} name={obj.name} price={obj.price} location={obj.location} />
                        ))}
                    </div>
                </div>

                <HomeDescription text={description.text} image1={description.image1} image2={description.image2} />

                <div className="statistics-section">
                    {statistics.map((stat, index) => (
                        <StatisticsCard key={index} title={stat.title} number={stat.number} icon={stat.icon} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;

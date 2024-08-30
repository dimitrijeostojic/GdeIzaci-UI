import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/ObjectDetails.css';
import Navbar from './Navbar';
import Map from './Map';
import Rating from 'react-rating';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faStarHalfAlt, faStar as farStar } from '@fortawesome/free-solid-svg-icons';
import { jwtDecode } from 'jwt-decode';
import EditObjectModal from './EditObjectModal';



const ObjectDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [object, setObject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isOwner, setIsOwner] = useState(false);
    const [location, setLocation] = useState(null);
    const [isBooked, setIsBooked] = useState(false);
    const [rating, setRating] = useState(0); // Dodaj stanje za ocenu
    const [isCancled, setIsCancled] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [user, setUser] = useState({
        userName: '',
        numberOfObjects: 0,
        userID: '',
        numberOfStars: 0
    });


    useEffect(() => {
        const fetchObjectAndUser = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`https://localhost:5000/api/Place/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setObject(response.data);
                

                const userResponse = await axios.get(`https://localhost:5000/api/User/${response.data.userCreatedID}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                setUser({
                    userName: userResponse.data.userName,
                    numberOfObjects: userResponse.data.numberOfObjects,
                    userID: userResponse.data.userID
                });

                // Ako objekat ima latitude i longitude, postavi ih direktno
                if (response.data.latitude && response.data.longitude) {
                    setLocation({
                        lat: response.data.latitude,
                        lng: response.data.longitude
                    });
                } else {
                    // Ako nema, pokušaj da ih dobiješ iz adrese
                    const coords = await getCoordinates(response.data.location);
                    if (coords) {
                        setLocation(coords);
                    } else {
                        setError('Unable to determine object location.');
                    }
                }
                // Postavi trenutnu ocenu iz baze
                setRating(response.data.rating || 0);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Error fetching data.');
            } finally {
                setLoading(false);
            }
        };

        fetchObjectAndUser();
    }, [id]);

    useEffect(() => {
        const loggedInUser = localStorage.getItem('username');
        if (loggedInUser === user.userName) {
            setIsOwner(true);
        }
    }, [user.userName]);

    // useEffect(() => {
    //     const fetchUserRating = async () => {
    //         try {
    //             const token = localStorage.getItem('token');
    //             const response = await axios.get(`https://localhost:5000/api/Review/${id}`, {
    //                 headers: {
    //                     'Authorization': `Bearer ${token}`
    //                 }
    //             });
    //             console.log(response.data);
    //             setRating(response.data || 0); // Postavi ocenu koju je korisnik dao
    //         } catch (error) {
    //             console.error('Error fetching user rating:', error);
    //         }
    //     };

    //     fetchUserRating();
    // }, [id]);

    useEffect(() => {
        const checkReservation = async () => {
            try {
                const token = localStorage.getItem('token');
                const decodedToken = jwtDecode(token);
                const userId = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
                const response = await axios.get(`https://localhost:5000/api/Reservation/check-reservation/${id}?userId=${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setIsBooked(response.data);
                setIsCancled(!response.data);
            } catch (error) {
                console.error('Error checking reservation:', error);
            }
        };

        checkReservation();
    }, [id]);

    const handleRatingChange = async (newRating) => {
        try {
            const token = localStorage.getItem('token');
            const reviewData = {
                rating: newRating,
                placeID: id, // Zamenite stvarnim ID-jem mesta
                userID: user.userID, // Zamenite stvarnim ID-jem korisnika,
                numberOfStars: newRating
            };

            await axios.post(`https://localhost:5000/api/Review`, reviewData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            setRating(newRating); // Ažuriraj ocenu lokalno
        } catch (error) {
            console.error('Error updating rating:', error);
        }
    };

    const handleBookNow = async () => {
        try {
            const token = localStorage.getItem('token');
            const decodedToken = jwtDecode(token);
            const userId = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
            const reservationData = {
                placeID: id,
                reservationDateTime: new Date().toISOString(), // Primer za trenutni datum i vreme
                userID: userId
            };

            await axios.post(`https://localhost:5000/api/Reservation`, reservationData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            alert("You have Succesfully booked");
            setIsBooked(true); // Postavi dugme na "Booked" nakon uspešne rezervacije
            setIsCancled(false);
        } catch (error) {
            console.error('Error creating reservation:', error);
        }
    };

    const handleCancel = async () => {
        try {
            const token = localStorage.getItem('token');
            const decodedToken = jwtDecode(token);
            const userId = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
            await axios.delete(`https://localhost:5000/api/Reservation/check-reservation/${id}?userId=${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setIsBooked(false);
            setIsCancled(true);
            alert('Reservation cancelled successfully.');

        } catch (error) {
            console.error('Error cancelling reservation:', error);
        }
    };

    const getCoordinates = async (address) => {
        try {
            console.log('API Key:', process.env.REACT_APP_GOOGLE_API_KEY);

            const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
                params: {
                    address: address,
                    key: process.env.REACT_APP_GOOGLE_API_KEY // Zameni svojim pravim API ključem
                }
            });

            if (response.data.status === 'OK') {
                const location = response.data.results[0]?.geometry?.location;
                if (location) {
                    return {
                        lat: location.lat,
                        lng: location.lng
                    };
                } else {
                    console.error('Geocoding response does not contain valid location data.');
                    return null;
                }
            } else {
                console.error('Geocoding failed with status:', response.data.status);
                return null;
            }
        } catch (error) {
            console.error('Error geocoding address:', error);
            return null;
        }
    };

    const handleDeletePlace = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.delete(`https://localhost:5000/api/Place/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            alert('Object deleted successfully.');
            navigate('/home'); // Redirektuje na glavnu stranicu nakon brisanja

        } catch (error) {
            console.error('Error deleting object:', error);
            alert('Error deleting object.');
        }
    }

    const handleEditObject = async (newObject) =>{
        try {
            const token = localStorage.getItem('token');
            
            await axios.put(`https://localhost:5000/api/Place/${id}`, newObject, {  // Dodaj JSON.stringify
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            alert('Object successfully updated');
            window.location.reload();
           // fetchObjects(); // Osvježite listu objekata
          } catch (error) {
            console.error('Error updating object:', error);
            alert('Error updating object.');
          }
    }


    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;
    if (!object) return <p>No object found</p>;

    return (
        <div className="details">
            <Navbar />
            <div className="object-info">
                <div className="object-info-left">
                    <h2>Object Details</h2>
                    <div className="object-header">
                        <img src={object.photo} alt={object.name} className="object-info-image" />
                    </div>
                    <div className="object-footer">
                        <h1>{object.name}</h1>
                        <p className='object-footer-type'>Object Type: {object.placeItem.name}</p>
                        <p className='object-footer-rating'>Number of Stars:</p>
                        <Rating
                            initialRating={rating}
                            onChange={(newRating) => handleRatingChange(newRating)} // Ispravno prosleđivanje funkcije
                            emptySymbol={<FontAwesomeIcon icon={farStar} className="fa-star-o" />}
                            fullSymbol={<FontAwesomeIcon icon={faStar} className="fa-star" />}
                            fractions={2}
                        />

                        <p className='object-footer-location'>Location: {object.location}</p>
                        <p className='object-footer-price'>Price: ${object.price}</p>
                        <p className='object-footer-description'>Description: {object.description}</p>
                    </div>
                </div>
                <div className="object-info-right">
                    <div className="user-info">
                        <div className="user-info-details">
                            <h3>{user.userName.toUpperCase()}</h3>
                            <p>Manager</p>
                            <p>{user.numberOfObjects} objects</p>
                        </div>
                        <div className="user-info-buttons">
                            <button className='book' disabled={!isOwner} onClick={() => setIsModalOpen(true)}>Edit</button>
                            <button className='book' disabled={!isOwner} onClick={handleDeletePlace}>Delete</button>
                        </div>
                    </div>
                    <div className="google-map">
                        {location ? (
                            <Map location={location} />
                        ) : (
                            <p>Location data is not available.</p>
                        )}
                    </div>
                    <div className="book-button">
                        <button className='book' onClick={handleBookNow} disabled={isBooked}>
                            {isBooked ? 'Booked' : 'Book Now'}
                        </button>
                        <button className='book' onClick={handleCancel} disabled={isCancled}>Cancel</button>
                    </div>
                </div>
            </div>
            <EditObjectModal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                onEditObject={handleEditObject}
                names = {object.name}
                prices = {object.price}
                locations = {object.location}
                descriptions = {object.description}
                types = {object.placeItem.name}
                photoUrls = {object.photo}
                id={object.placeItem.placeItemID}
            />
        </div >
    );
};

export default ObjectDetails;

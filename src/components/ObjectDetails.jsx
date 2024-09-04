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
    const [isOwner, setIsOwner] = useState(false);
    const [location, setLocation] = useState(null);
    const [isBooked, setIsBooked] = useState(false);
    const [rating, setRating] = useState(0); // Dodaj stanje za ocenu
    const [isCancled, setIsCancled] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [averageRating, setAverageRating] = useState(null);
    const [numberOfUsers, setNumberOfUsers] = useState(1);
    const [user, setUser] = useState({
        userName: '',
        numberOfObjects: 0,
        userID: '',
        numberOfStars: 0
    });
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const decodedToken = jwtDecode(token);


    useEffect(() => {
        fetchObjectAndUser();
        checkReservation();
        fetchRating();
    }, [id]);

    useEffect(() => {
        const loggedInUser = localStorage.getItem('username');
        if (loggedInUser === user.userName) {
            setIsOwner(true);
        }
    }, [user.userName]);

    useEffect(() => {
        fetchAverageRating();
    }, [rating]);


    const fetchObjectAndUser = async () => {
        try {
            const response = await axios.get(`https://localhost:5000/api/Place/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setObject(response.data);

            const role = localStorage.getItem('role');
            if (role === "Admin") {
                setIsOwner(true);
            }

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
            const coords = await getCoordinates(response.data.location);

            setLocation(coords);


            // setRating(response.data.rating || 0);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const checkReservation = async () => {
        try {
            const userId = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
            const response = await axios.get(`https://localhost:5000/api/Reservation/check-reservation/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                params: { userId: userId }
            });
            setNumberOfUsers(response.data.numberOfUsers);
            setIsBooked(response.data.isReserved);
            setIsCancled(!response.data.isReserved);
        } catch (error) {
            console.error('Error checking reservation:', error);
        }
    };

    const fetchAverageRating = async () => {
        try {
            const response = await axios.get(`https://localhost:5000/api/Review/average-rating/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setAverageRating(response.data.numberOfStars);
        } catch (error) {
            console.error("Error fetching average rating:", error);
        }
    };

    const fetchRating = async () => {
        try {
            const userId = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
            const response = await axios.get(`https://localhost:5000/api/Review/${id}/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setRating(response.data.numberOfStars || 0); // Ako rating nije dostupan, postavite na 0
        } catch (error) {
            console.error("Error fetching user rating:", error);
            setRating(0); // Postavite na 0 ako dođe do greške
        }
    };

    const handleAddRatingChange = async (newRating) => {
        try {
            const userId = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
            const reviewData = {
                placeID: id,
                userID: userId,
                numberOfStars: newRating
            };

            await axios.post(`https://localhost:5000/api/Review`, reviewData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            setRating(newRating);
        } catch (error) {
            console.error('Error updating rating:', error);
        }
    };

    const handleEditRatingChange = async (newRating) => {
        try {
            const reviewData = {
                numberOfStars: newRating
            };

            await axios.put(`https://localhost:5000/api/Review/${id}`, reviewData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            setRating(newRating);
        } catch (error) {
            console.error('Error updating rating:', error);
        }
    };

    const handleBookNow = async () => {
        try {
            const userId = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
            const reservationData = {
                placeID: id,
                reservationDateTime: new Date().toISOString(), // Primer za trenutni datum i vreme
                userID: userId,
                numberOfUsers: numberOfUsers
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
            const isConfirmed = window.confirm('Do you want to cancel a reservation?');
            if (isConfirmed) {
                const userId = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
                await axios.delete(`https://localhost:5000/api/Reservation/check-reservation/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    params: {
                        id: id,
                        userId: userId
                    }
                });
                setIsBooked(false);
                setIsCancled(true);
            }
        } catch (error) {
            console.error('Error cancelling reservation:', error);
        }
    };

    const getCoordinates = async (address) => {
        try {
            const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
                params: {
                    address: address,
                    key: process.env.REACT_APP_GOOGLE_API_KEY
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
            const isConfirmed = window.confirm('Do you want to delete this object?');
            if (isConfirmed) {
                await axios.delete(`https://localhost:5000/api/Place/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                alert('Object deleted successfully.');
                navigate('/home');
            }
        } catch (error) {
            console.error('Error deleting object:', error);
            alert('Error deleting object.');
        }
    }

    const handleEditObject = async (newObject) => {
        try {
            const isConfirmed = window.confirm('Do you want to edit this objecti?');
            const updatePlaceRequestDto = newObject;
            if (isConfirmed) {
                await axios.put(`https://localhost:5000/api/Place/${id}`, updatePlaceRequestDto, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                alert('Object successfully updated');
                window.location.reload();
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.errors) {
                const errors = error.response.data.errors;
                console.error('Validation errors:', errors);

                // Na primer, možeš proći kroz greške i prikazati ih
                for (const [field, messages] of Object.entries(errors)) {
                    console.error(`${field}: ${messages.join(', ')}`);
                }
                alert('Error updating object: ' + Object.values(errors).flat().join('\n'));
            } else {
                console.error('Error updating object:', error);
                alert('Error updating object.');
            }
        }
    }

    const handleNumberOfUsersChange = (e) => {
        const value = parseInt(e.target.value, 10);
        if (value < 1) {
            setNumberOfUsers(1); // Postavite na minimalnu vrednost
        } else {
            setNumberOfUsers(value); // Postavite na unetu vrednost ako je validna
        }
      };

    // Formatiranje datuma
    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // meseci su 0-indeksirani
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }


    if (loading) return <p>Loading...</p>;
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
                        <h3>Date: {formatDate(object.date)}</h3>
                        <p className='object-footer-type'>Object Type: {object.placeItem.name}</p>
                        <p className='object-footer-rating'>Number of Stars:</p>
                        {role !== 'Admin' && (
                            <Rating
                                initialRating={rating}
                                onChange={(newRating) => {
                                    if (rating === 0) {
                                        handleAddRatingChange(newRating)
                                    }
                                    else {
                                        handleEditRatingChange(newRating)
                                    }
                                }}
                                emptySymbol={<FontAwesomeIcon icon={farStar} className="fa-star-o" />}
                                fullSymbol={<FontAwesomeIcon icon={faStar} className="fa-star" />}
                                fractions={2}
                            />
                        )}
                        <p className="average-grade">Average rating: {averageRating === null ? "No ratings available for this place" : averageRating}</p>
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
                        <button className='book' onClick={handleBookNow} disabled={isBooked || isOwner}>{isBooked ? 'Booked' : 'Book Now'}</button>
                        <button className='book' onClick={handleCancel} disabled={isCancled || isOwner}>Cancel</button>
                    </div>
                    <div className="numberOfUsers">
                        <p>Enter number of users:</p>
                        <input type="number" max={10} min={1} disabled={isBooked || isOwner} onChange={handleNumberOfUsersChange} value={numberOfUsers} />
                    </div>
                </div>
            </div>
            <EditObjectModal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                onEditObject={handleEditObject}
                names={object.name}
                prices={object.price}
                locations={object.location}
                dates={object.date}
                descriptions={object.description}
                types={object.placeItem.name}
                photoUrls={object.photo}
                id={object.placeItem.placeItemID}
            />
        </div >
    );
};

export default ObjectDetails;

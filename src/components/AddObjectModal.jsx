import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import '../styles/Modal.css'; // Stilizovanje za modal
import axios from 'axios';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Postavite appElement za pristupačnost
Modal.setAppElement('#root');

const AddObjectModal = ({ isOpen, onRequestClose, onAddObject }) => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [photo, setPhoto] = useState('');
    const [selectedPlaceItem, setSelectedPlaceItem] = useState('');
    const [placeItems, setPlaceItems] = useState([]);
    const [selectedPlaceItemDetails, setSelectedPlaceItemDetails] = useState(null);
    const token = localStorage.getItem('token')


    // Učitaj placeItems iz baze kada se komponenta učita
    const fetchPlaceItems = async () => {
        try {
            const response = await axios.get('https://localhost:5000/api/PlaceItem', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }); // Ažurirajte URL ako je potrebno
            setPlaceItems(response.data);
            setSelectedPlaceItemDetails(response.data[0].placeItemID);
        } catch (error) {
            console.error('Error fetching place items:', error);
        }
    };

    useEffect(() => {
        fetchPlaceItems();
    }, []);

    const handlePlaceItemChange = (event) => {
        const selectedName = event.target.value;
        setSelectedPlaceItem(selectedName);
        const selectedItem = placeItems.find(item => item.name === selectedName);
        setSelectedPlaceItemDetails(selectedItem.placeItemID);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newObject = {
            name,
            description,
            location,
            date,
            price,
            photo: photo,
            placeItemId: selectedPlaceItemDetails, // Postavi ID umesto naziva
        };

        try {
            onAddObject(newObject);
            setName('');
            setDescription('');
            setLocation('');
            setDate('');
            setPhoto('');
            setPrice(0);
            setSelectedPlaceItemDetails(null);
            onRequestClose();
        } catch (error) {
            console.error('Error adding object:', error);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Add Object"
            className="modal"
            overlayClassName="overlay"
        >
            <h2>Add New Object</h2>
            <form onSubmit={handleSubmit}>
                <label>Name:</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />

                <label>Price:</label>
                <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />

                <label>Location:</label>
                <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} required />

                <label>Date:</label>
                <DatePicker selected={date} onChange={(date) => setDate(date)} dateFormat="dd/MM/yyyy" required />

                <label>Description:</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />

                <label>Type:</label>
                <select value={selectedPlaceItem} onChange={handlePlaceItemChange} required>
                    {placeItems.map((item, index) => (
                        <option key={index} value={item.name}>
                            {item.name}
                        </option>
                    ))}
                </select>

                <label>Upload Photo URL:</label>
                <input type="text" value={photo} onChange={(e) => setPhoto(e.target.value)} required />
                <button type="submit">Add Object</button>
                <button type="button" onClick={onRequestClose}>Cancel</button>
            </form>
        </Modal>
    );
};

export default AddObjectModal;

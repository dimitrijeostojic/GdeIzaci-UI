import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import '../styles/Modal.css'; // Stilizovanje za modal
import axios from 'axios';
import '../styles/Modal.css';

// Postavite appElement za pristupačnost
Modal.setAppElement('#root');

const EditObjectModal = ({ isOpen, onRequestClose, onEditObject, names, prices, locations, descriptions, types, photoUrls, id }) => {
    const [name, setName] = useState(names);
    const [price, setPrice] = useState(prices);
    const [location, setLocation] = useState(locations);
    const [description, setDescription] = useState(descriptions);
    const [photo, setPhoto] = useState(photoUrls);
    const [selectedPlaceItem, setSelectedPlaceItem] = useState('');
    const [placeItems, setPlaceItems] = useState([]);
    const [selectedPlaceItemDetails, setSelectedPlaceItemDetails] = useState(id);

    useEffect(() => {
        // Učitaj placeItems iz baze kada se komponenta učita
        const fetchPlaceItems = async () => {
            try {
              const response = await axios.get('https://localhost:5000/api/PlaceItem'); // Ažurirajte URL ako je potrebno
              setPlaceItems(response.data);
               setSelectedPlaceItem(types);
            } catch (error) {
              console.error('Error fetching place items:', error);
            }
          };

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
            price,
            photo: photo,
            placeItemId: selectedPlaceItemDetails, // Postavi ID umesto naziva
        };
        console.log(newObject);
        try {
            onEditObject(newObject);
            onRequestClose();

        } catch (error) {
            console.error('Error adding object:', error);
            
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Edit Object"
            className="modal"
            overlayClassName="overlay"
        >
            <h2>Edit Object</h2>
            <form onSubmit={handleSubmit}>
                <label>Name:</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />

                <label>Price:</label>
                <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                />

                <label>Location:</label>
                <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                />

                <label>Description:</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />

                <label>Type:</label>
                <select
                    value={selectedPlaceItem}
                    onChange={handlePlaceItemChange}
                    required
                >
                    {placeItems.map((item, index) => (
                        <option key={index} value={item.name}>
                            {item.name}
                        </option>
                    ))}
                </select>

                <label>Upload Photo URL:</label>
                <input
                    type="text"
                    value={photo}
                    onChange={(e) => setPhoto(e.target.value)}
                    required
                />
                <button type="submit">Update Object</button>
                <button type="button" onClick={onRequestClose}>Cancel</button>
            </form>
        </Modal>
    );
};

export default EditObjectModal;

import React from "react";
import '../styles/ObjectCard.css';
import { useNavigate } from "react-router-dom";


const ObjectCard = (prop) => {

  const navigate = useNavigate();

  const ObjectDetails = () => {
    navigate(`/objects/${prop.id}`);
  }

  // Formatiranje datuma
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // meseci su 0-indeksirani
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  return (
    <div className="object-card" onClick={ObjectDetails}>
      <img src={prop.photo} alt={prop.name} className="object-image" />
      <div className="object-details">
        <h3 className="object-title">{prop.name}</h3>
        <p className="object-price">${prop.price}</p>
        <p className="object-location">{prop.location}</p>
        <p className="object-date">{formatDate(prop.date)}</p>
      </div>
    </div>
  );
};

export default ObjectCard;
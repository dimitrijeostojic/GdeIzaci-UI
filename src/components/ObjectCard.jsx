import React from "react";
import '../styles/ObjectCard.css';
import { useNavigate } from "react-router-dom";


const ObjectCard = (prop) => {

  const navigate = useNavigate();

  const ObjectDetails = () => {
    navigate(`/objects/${prop.id}`);
  }

  return (
    <div className="object-card" onClick={ObjectDetails}>
      <img src={prop.photo} alt={prop.name} className="object-image" />
      <div className="object-details">
        <h3 className="object-title">{prop.name}</h3>
        <p className="object-price">${prop.price}</p>
        <p className="object-location">{prop.location}</p>
      </div>
    </div>
  );
};

export default ObjectCard;
import React from 'react';
import '../styles/HomeDescription.css';

const PraznaKomponenta = (props) => {
  return (
    <div className="description-container">
                <p className="description-text">{props.text}</p>
                <div className="description-images">
                    <img src={props.image1} alt="Description Image 1" className="description-image"/>
                    <img src={props.image2} alt="Description Image 2" className="description-image"/>
                </div>
            </div>
  );
};

export default PraznaKomponenta;

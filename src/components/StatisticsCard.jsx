import React from 'react';
import '../styles/StatisticsCard.css'; // Ako imate stilove za ovu komponentu
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const StatisticsCard = ({ title, number, icon }) => {
  return (
    <div className="statistics-card">
        <div className='statistics-card-left'>
            <h3 className="statistics-title">{title}</h3>
            <p className="statistics-number">{number}</p>
      </div>
      <div className='statistics-icon'>
         <FontAwesomeIcon icon={icon} className='icon'/>
      </div>
    </div>
  );
};

export default StatisticsCard;

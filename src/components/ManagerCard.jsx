import React from 'react'
import '../styles/ManagerCard.css';
import { useNavigate } from 'react-router-dom';

const ManagerCard = (prop) => {

    const navigate = useNavigate();

    const handleClick = () => {
        if (prop.numberOfObjects > 0) {
            navigate(`/manager/${prop.id}/objects`);
        }
    };

    return (
        < div className="manager-details" >
            <div className="manager-detatils-left">
                <h3>{prop.userName}</h3>
                <p>Object Manager</p>
            </div>
            <div className="manager-details-right">
                <p><a href={`mailto:${prop.email}`}>{prop.email}</a></p>
                <p className={`objects-link ${prop.numberOfObjects > 0 ? '' : 'disabled'}`} onClick={handleClick}>
                    {prop.numberOfObjects} Objects
                </p>
            </div>
        </div >
    )
}

export default ManagerCard
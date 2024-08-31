import React from 'react'
import '../styles/ManagerCard.css';

const ManagerCard = (prop) => {
    return (
        < div className="manager-details" >
            <div className="manager-detatils-left">
                <h3>{prop.userName}</h3>
                <p>Object Manager</p>
            </div>
            <div className="manager-details-right">
                <p><a href={`mailto:${prop.email}`}>{prop.email}</a></p>
                <p>{prop.numberOfObjects} Objects</p>
            </div>
        </div >
    )
}

export default ManagerCard
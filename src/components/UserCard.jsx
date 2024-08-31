import React from 'react'
import '../styles/UserCard.css';
import axios from 'axios';

const UserCard = (props) => {

    const handleChangeRole = async () => {
        try {
            const token = localStorage.getItem('token');
            const isConfirmed = window.confirm('Do you want to set user to be a manager?');
            if (isConfirmed) {
                // Pozivanje API-ja za promenu uloge korisnika
                const response = await axios.put(`https://localhost:5000/api/User/changeRole/${props.userId}`,
                    { role: 'Manager' },
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );
                if (response.status === 200) {
                    // Možete dodati obaveštenje ili osvežiti podatke
                    console.log(`Uloga korisnika ${props.userName} promenjena u Manager`);
                    props.refreshUsers();
                } else {
                    console.error('Došlo je do greške prilikom promene uloge');
                }
            }

        } catch (error) {
            console.error('Greška prilikom pozivanja API-ja:', error);
        }
    };

    const handleDeleteUser = async () => {
        try {
            // Pozivanje API-ja za brisanje korisnika
            const token = localStorage.getItem('token');
            const isConfirmed = window.confirm('Do you want to delete this user?');
            if (isConfirmed) {
                const response = await axios.delete(`https://localhost:5000/api/User/delete/${props.userId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.status === 200) {
                    console.log(`Korisnik ${props.userName} obrisan`);
                    props.refreshUsers();

                } else {
                    console.error('Došlo je do greške prilikom brisanja korisnika');
                }
            }

        } catch (error) {
            console.error('Greška prilikom pozivanja API-ja:', error);
        }
    };

    return (
        < div className="user-details" >
            <div className="user-detatils-left">
                <h3>{props.userName}</h3>
                <p>{props.role}</p>
            </div>
            <div className="user-details-right">
                <p><a href={`mailto:${props.email}`}>{props.email}</a></p>
                <p>{props.numberOfObjects} Objects</p>
                <button onClick={handleChangeRole} disabled={props.role == "Manager"}>{props.isManager ? 'Already a Manager' : 'Make Manager'}</button>
                <button onClick={handleDeleteUser}>Delete User</button>
            </div>
        </div >
    )
}

export default UserCard;
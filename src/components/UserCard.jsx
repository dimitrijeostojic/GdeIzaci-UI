import React from 'react'
import '../styles/UserCard.css';
import axios from 'axios';

const UserCard = (props) => {
    const token = localStorage.getItem('token');

    const handleChangeRole = async () => {
        try {
            const isConfirmed = window.confirm('Do you want to set user to be a manager?');
            if (isConfirmed) {
                const response = await axios.put(`https://localhost:5000/api/User/changeRole/${props.userId}`,
                    { role: 'Manager' },
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );
                props.refreshUsers();
                alert("The system has changed the role for this user");
            }
        } catch (error) {
            alert("The system can't change the role for this user");
        }
    };

    const handleDeleteUser = async () => {
        try {
            const isConfirmed = window.confirm('Do you want to delete this user?');
            if (isConfirmed) {
                const response = await axios.delete(`https://localhost:5000/api/User/delete/${props.userId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                    props.refreshUsers();
                    alert("The system has successfully deleted this user");
            }
        } catch (error) {
            alert("The system can't delete this user");
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
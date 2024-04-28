import React, { useEffect, useState } from 'react';
import axios from 'axios';

function AdminDashboard() {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        axios.get('http://localhost:5000/api/admin/users')
            .then(response => {
                setUsers(response.data);
                setError('');
            })
            .catch(error => {
                console.error('Error fetching users:', error);
                setError('Failed to fetch users. Please try again later.');
            });
    }, []);

    return (
        <div>
            <h1>Admin Dashboard</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <h2>Users List</h2>
            
            <ul>
                {users.map(user => (
                    <li key={user.id}>id:{user.id} username:{user.username}</li>
                ))}
            </ul>
        </div>
    );
}

export default AdminDashboard;

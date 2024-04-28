import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

function Profile() {
    const query = useQuery();
    const [user, setUser] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const userId = query.get("id");
        if (!userId) {
            setError("User ID is missing");
            setIsLoading(false);
            return;
        }

        axios.get(`http://localhost:5000/profile?id=${userId}`)
            .then(response => {
                setUser(response.data);
                setIsLoading(false);
            })
            .catch(error => {
                setError('Error fetching profile: ' + error.message);
                setIsLoading(false);
            });
    }, [query.get("id")]);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h1>Profile</h1>
            <p><strong>Username:</strong> {user.username}</p>
        </div>
    );
}

export default Profile;

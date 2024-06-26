import React from 'react';
import { Link } from 'react-router-dom';

function Navigation() {
  const userId = localStorage.getItem('userId');

  return (
    <nav>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li>{userId && <Link to={`/profile?id=${userId}`}>My Profile</Link>}</li>
        <li><Link to="/login">Login</Link></li>
        <li><Link to="/register">Register</Link></li>
        {/* <li><Link to="/admin/users">Admin Dashboard</Link></li> */}
      </ul>
    </nav>
  );
}

export default Navigation;

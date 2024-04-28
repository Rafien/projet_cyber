import React from 'react';
import { BrowserRouter as
Router, Route, Routes } from 'react-router-dom';
import Profile from '../src/components/Profile';
import Login from '../src/components/Login';
import Register from '../src/components/Registration'
import Navigation from '../src/components/Navigation';
import AdminDashboard from '../src/components/AdminDashboard';

function App() {
return (
<Router>
<div>
<Navigation />
<Routes>
<Route path="/profile" element={<Profile />} />
<Route path="/login" element={<Login />} />
<Route path="/register" element={<Register />} />
<Route path="/admin/users" element={<AdminDashboard />} />

</Routes>
</div>
</Router>
);
}

export default App;
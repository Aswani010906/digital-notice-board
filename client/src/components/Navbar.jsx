import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { Bell } from 'lucide-react';

const Navbar = () => {
    const navigate = useNavigate();
    const user = authService.getCurrentUser();

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="container navbar-inner">
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.25rem', fontWeight: 'bold' }}>
                    <div style={{ background: 'var(--primary)', color: 'white', padding: '0.5rem', borderRadius: '8px', display: 'flex' }}>
                        <Bell size={20} />
                    </div>
                    <span style={{ color: 'var(--text-main)' }}>CollegeBoard</span>
                </Link>
                <div className="nav-links">
                    <Link to="/" style={{ color: 'var(--text-muted)' }}>Home</Link>
                    <Link to="/archive" style={{ color: 'var(--text-muted)' }}>Archive</Link>
                    {user ? (
                        <>
                            <Link to="/dashboard" style={{ color: 'var(--text-main)', fontWeight: '500' }}>Dashboard</Link>
                            <button className="btn btn-outline" onClick={handleLogout}>Logout</button>
                        </>
                    ) : (
                        <Link to="/login" className="btn btn-primary">Login / Admin</Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

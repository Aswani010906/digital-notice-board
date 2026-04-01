import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { authService } from '../services/api';
import { Bell } from 'lucide-react';

const Navbar = () => {
    const user = authService.getCurrentUser();
    const homeLink = user ? (user.role === 'student' ? '/notices' : '/dashboard') : '/login';

    const handleLogout = () => {
        authService.logout();
        window.location.replace('/login');
    };

    return (
        <nav className="navbar">
            <div className="container navbar-inner">
                <Link to={homeLink} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.25rem', fontWeight: 'bold' }}>
                    <div style={{ background: 'var(--primary)', color: 'white', padding: '0.5rem', borderRadius: '8px', display: 'flex' }}>
                        <Bell size={20} />
                    </div>
                    <span style={{ color: 'var(--text-main)' }}>CollegeBoard</span>
                </Link>
                <div className="nav-links" style={{ alignItems: 'center' }}>
                    {user ? (
                        <>
                            <NavLink to="/notices" style={({ isActive }) => ({ color: isActive ? 'var(--text-main)' : 'var(--text-muted)', fontWeight: isActive ? '700' : 'normal' })}>Notices</NavLink>
                            <NavLink to="/archive" style={({ isActive }) => ({ color: isActive ? 'var(--text-main)' : 'var(--text-muted)', fontWeight: isActive ? '700' : 'normal' })}>Archive</NavLink>
                            {user.role === 'admin' && (
                                <NavLink to="/admin/users" style={({ isActive }) => ({ color: isActive ? 'var(--text-main)' : 'var(--text-muted)', fontWeight: isActive ? '700' : '500' })}>Admin Users</NavLink>
                            )}
                            {user.role !== 'student' && (
                                <NavLink to="/dashboard" style={({ isActive }) => ({ color: isActive ? 'var(--text-main)' : 'var(--text-muted)', fontWeight: isActive ? '700' : '500' })}>Dashboard</NavLink>
                            )}
                            <span style={{ marginLeft: '1rem', color: 'var(--text-main)', fontSize: '0.9rem', opacity: 0.8 }}>
                                Welcome, <strong>{user.name}</strong>
                            </span>
                            <button className="btn btn-outline" onClick={handleLogout} style={{ marginLeft: '0.5rem' }}>Logout</button>
                        </>
                    ) : (
                        <NavLink to="/login" className="btn btn-primary">Login / Admin</NavLink>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

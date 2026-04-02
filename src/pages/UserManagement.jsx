import React, { useState, useEffect } from 'react';
import { userService } from '../services/api';
import { Eye, EyeOff, Users, UserPlus, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'student',
        department: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const data = await userService.getUsers();
            setUsers(data);
        } catch (err) {
            console.error('Failed to fetch users', err);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            await userService.createUser(formData);
            setSuccess('User created successfully!');
            setFormData({ name: '', email: '', password: '', role: 'student', department: '' });
            fetchUsers(); // Refresh list
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create user');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container main-content">
            <motion.section className="admin-users-hero" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.45 }}>
                <div className="admin-users-hero__badge">
                    <Shield size={16} />
                    <span>Admin Dashboard</span>
                </div>
                <div className="admin-users-hero__header">
                    <div>
                        <h1>User Management</h1>
                        <p style={{ color: 'var(--text-muted)' }}>
                            The central core for user identity and access management across the institution.
                        </p>
                    </div>
                    <div className="page-hero__stats">
                        <div className="admin-users-stat">
                            <Users size={24} />
                            <div>
                                <strong>{users.length}</strong>
                                <span>Total Users</span>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.section>

            <div className="admin-users-layout">
                <motion.div className="card admin-users-panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.45 }}>
                    <div className="admin-users-panel__head">
                        <div className="admin-users-panel__icon">
                            <UserPlus size={22} />
                        </div>
                        <div>
                            <h2>Add New User</h2>
                            <p style={{ color: 'var(--text-muted)', marginTop: '0.2rem' }}>Provision new platform access and set departmental privileges.</p>
                        </div>
                    </div>

                    <AnimatePresence>
                        {error && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="admin-users-alert admin-users-alert--error overflow-hidden">
                                <div style={{ padding: '0.5rem 0' }}>{error}</div>
                            </motion.div>
                        )}
                        {success && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="admin-users-alert admin-users-alert--success overflow-hidden">
                                <div style={{ padding: '0.5rem 0' }}>{success}</div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form onSubmit={handleSubmit} className="admin-users-form__grid" autoComplete="off">
                        <div className="form-group">
                            <label className="form-label">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                placeholder="e.g. Jane Doe"
                                value={formData.name}
                                onChange={handleChange}
                                className="form-input"
                                autoComplete="off"
                                required
                            />
                        </div>
                        
                        <div className="form-group">
                            <label className="form-label">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="jane@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                className="form-input"
                                autoComplete="off"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <div className="password-input-wrap">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    placeholder="Set a strong password..."
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="form-input password-input"
                                    autoComplete="new-password"
                                    required
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword((value) => !value)}
                                    aria-label="Toggle password"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Account Role</label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="form-input"
                            >
                                <option value="student">Student</option>
                                <option value="admin">Admin</option>
                                <option value="department">Department Head</option>
                                <option value="club">Club Representative</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Department</label>
                            <select
                                name="department"
                                value={formData.department}
                                onChange={handleChange}
                                className="form-input"
                                required
                            >
                                <option value="" disabled>Select Department...</option>
                                <option value="CSE">CSE</option>
                                <option value="EEE">EEE</option>
                                <option value="EC">EC</option>
                                <option value="ME">ME</option>
                                <option value="CE">CE</option>
                                <option value="RAI">RAI</option>
                                <option value="General">General/Other</option>
                            </select>
                        </div>

                        <div className="form-group admin-users-form__full" style={{ marginTop: '0.5rem' }}>
                            <button type="submit" className="btn btn-primary admin-users-submit" disabled={loading}>
                                {loading ? 'Creating...' : 'Create Account'}
                            </button>
                        </div>
                    </form>
                </motion.div>

                <motion.div className="card admin-users-panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.45 }}>
                    <div className="admin-users-panel__head" style={{ marginBottom: '1.5rem' }}>
                        <div className="admin-users-panel__icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: 'var(--secondary)' }}>
                            <Users size={22} />
                        </div>
                        <div>
                            <h2>Existing System Users</h2>
                            <p style={{ color: 'var(--text-muted)', marginTop: '0.2rem' }}>Comprehensive directory of active personnel and student accounts.</p>
                        </div>
                    </div>
                    
                    <div style={{ overflowX: 'auto', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
                        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', whiteSpace: 'nowrap' }}>
                            <thead style={{ background: 'rgba(23, 32, 51, 0.03)' }}>
                                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                                    <th style={{ padding: '1.1rem 1.25rem', fontWeight: '700', color: 'var(--text-muted)' }}>Name</th>
                                    <th style={{ padding: '1.1rem 1.25rem', fontWeight: '700', color: 'var(--text-muted)' }}>Email</th>
                                    <th style={{ padding: '1.1rem 1.25rem', fontWeight: '700', color: 'var(--text-muted)' }}>Role</th>
                                    <th style={{ padding: '1.1rem 1.25rem', fontWeight: '700', color: 'var(--text-muted)' }}>Department</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No users found.</td>
                                    </tr>
                                ) : users.map((user) => (
                                    <tr key={user._id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(23, 32, 51, 0.02)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                                        <td style={{ padding: '1.1rem 1.25rem', fontWeight: '600' }}>{user.name}</td>
                                        <td style={{ padding: '1.1rem 1.25rem', color: 'var(--text-muted)' }}>{user.email}</td>
                                        <td style={{ padding: '1.1rem 1.25rem' }}>
                                            <span style={{
                                                background: user.role === 'admin' ? 'rgba(15, 118, 110, 0.12)' : 'rgba(23, 32, 51, 0.05)',
                                                color: user.role === 'admin' ? 'var(--primary)' : 'var(--text-main)',
                                                padding: '0.35rem 0.65rem',
                                                borderRadius: '999px',
                                                fontSize: '0.75rem',
                                                fontWeight: '800',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.04em'
                                            }}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1.1rem 1.25rem' }}>
                                            <span style={{
                                                background: 'rgba(255, 255, 255, 0.5)',
                                                border: '1px solid var(--border-color)',
                                                padding: '0.35rem 0.6rem',
                                                borderRadius: '6px',
                                                fontSize: '0.8rem',
                                                fontWeight: '600'
                                            }}>
                                                {user.department || 'N/A'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default UserManagement;

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { userService } from '../services/api';
import { Users, UserPlus, Eye, EyeOff, ChevronLeft, ChevronRight, Shield } from 'lucide-react';

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
    const [showAddModal, setShowAddModal] = useState(false);
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 8;

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

    // Calculate pagination slices
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(users.length / usersPerPage);

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
            setTimeout(() => {
                setShowAddModal(false);
                setSuccess(null);
            }, 1500);
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
                <motion.div className="card admin-users-panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.45 }}>
                    <div className="admin-users-panel__head" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div className="admin-users-panel__icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: 'var(--secondary)' }}>
                                <Users size={22} />
                            </div>
                            <div>
                                <h2>Existing System Users</h2>
                                <p style={{ color: 'var(--text-muted)', marginTop: '0.2rem' }}>Comprehensive directory of active personnel and student accounts.</p>
                            </div>
                        </div>
                        <button 
                            className="btn btn-primary" 
                            style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', borderRadius: '12px', padding: '0.6rem 1.25rem' }}
                            onClick={() => setShowAddModal(true)}
                        >
                            <UserPlus size={18} />
                            <span>Add New User</span>
                        </button>
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
                                {currentUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>{users.length === 0 ? "No users found." : "No users on this page."}</td>
                                    </tr>
                                ) : currentUsers.map((user) => (
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
                        
                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div style={{ padding: '1.1rem 1.25rem', display: 'flex', gap: '0.5rem', alignItems: 'center', background: 'rgba(23, 32, 51, 0.01)', borderTop: '1px solid var(--border-color)' }}>
                                <button 
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    style={{ 
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', 
                                        background: 'transparent', border: 'none', 
                                        cursor: currentPage === 1 ? 'not-allowed' : 'pointer', 
                                        color: currentPage === 1 ? 'var(--border-color)' : 'var(--text-main)', 
                                        padding: '0.4rem' 
                                    }}
                                >
                                    <ChevronLeft size={20} />
                                </button>

                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                    <button 
                                        key={page} 
                                        onClick={() => setCurrentPage(page)}
                                        style={{
                                            width: '32px', height: '32px', borderRadius: '50%', border: 'none',
                                            background: currentPage === page ? 'var(--primary)' : 'transparent',
                                            color: currentPage === page ? 'white' : 'var(--text-main)',
                                            fontWeight: currentPage === page ? '600' : '500',
                                            cursor: 'pointer',
                                            transition: 'background 0.2s'
                                        }}
                                    >
                                        {page}
                                    </button>
                                ))}

                                <button 
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    style={{ 
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', 
                                        background: 'transparent', border: 'none', 
                                        cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', 
                                        color: currentPage === totalPages ? 'var(--border-color)' : 'var(--text-main)', 
                                        padding: '0.4rem' 
                                    }}
                                >
                                    <ChevronRight size={20} />
                                </button>
                                
                                <span style={{ marginLeft: 'auto', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                    Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, users.length)} of {users.length} users
                                </span>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>

            <AnimatePresence>
                {showAddModal && (
                    <motion.div
                        className="notice-modal-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowAddModal(false)}
                        style={{ zIndex: 1200 }}
                    >
                        <motion.div
                            className="notice-modal"
                            initial={{ y: 50, opacity: 0, scale: 0.95 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            exit={{ y: 20, opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                            style={{ maxWidth: '600px', cursor: 'default', overflow: 'visible' }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="notice-modal__content" style={{ padding: '2.5rem' }}>
                                <button className="notice-modal__close" onClick={() => setShowAddModal(false)}>×</button>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.5rem' }}>
                                    <div className="admin-users-panel__icon">
                                        <UserPlus size={22} />
                                    </div>
                                    <div>
                                        <h2 style={{ fontSize: '1.35rem', marginBottom: '0.2rem' }}>Add New User</h2>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Provision new platform access and privileges.</p>
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

                                <form onSubmit={handleSubmit} className="grid grid-cols-1" autoComplete="off" style={{ gap: '1.25rem', marginTop: '1.5rem' }}>
                                    <div className="form-group" style={{ marginBottom: 0 }}>
                                        <label className="form-label">Full Name *</label>
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
                                    
                                    <div className="form-group" style={{ marginBottom: 0 }}>
                                        <label className="form-label">Email Address *</label>
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

                                    <div className="form-group" style={{ marginBottom: 0 }}>
                                        <label className="form-label">Password *</label>
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

                                    <div className="grid grid-cols-2" style={{ gap: '1.25rem' }}>
                                        <div className="form-group" style={{ marginBottom: 0 }}>
                                            <label className="form-label">User Permissions *</label>
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

                                        <div className="form-group" style={{ marginBottom: 0 }}>
                                            <label className="form-label">Status (Department) *</label>
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
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
                                        <button type="button" className="btn btn-outline" onClick={() => setShowAddModal(false)}>
                                            Cancel
                                        </button>
                                        <button type="submit" className="btn btn-primary" disabled={loading} style={{ minWidth: '120px' }}>
                                            {loading ? 'Saving...' : 'Save User'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default UserManagement;

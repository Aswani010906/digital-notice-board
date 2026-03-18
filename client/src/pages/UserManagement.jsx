import React, { useState, useEffect } from 'react';
import { userService } from '../services/api';
import { Search, ShieldCheck, UserPlus, Users } from 'lucide-react';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResult, setSearchResult] = useState(null);
    const [hasSearched, setHasSearched] = useState(false);
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
            fetchUsers();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create user');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        const query = searchTerm.trim().toLowerCase();
        if (!query) {
            setSearchResult(null);
            setHasSearched(false);
            return;
        }

        const match = users.find((user) =>
            user.name?.toLowerCase().includes(query) ||
            user.email?.toLowerCase().includes(query)
        );

        setSearchResult(match || null);
        setHasSearched(true);
    };

    return (
        <div className="container main-content">
            <section className="admin-users-hero">
                <div className="admin-users-hero__badge">
                    <ShieldCheck size={16} />
                    <span>Admin Access</span>
                </div>
                <div className="admin-users-hero__header">
                    <div>
                        <h1>Admin Users</h1>
                        <p>Manage platform access for students, admins, departments, and club representatives.</p>
                    </div>
                    <div className="admin-users-hero__stats">
                        <div className="admin-users-stat">
                            <Users size={18} />
                            <div>
                                <strong>{users.length}</strong>
                                <span>Total Users</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="admin-users-layout">
                <section className="card admin-users-panel">
                    <div className="admin-users-panel__head">
                        <div className="admin-users-panel__icon">
                            <UserPlus size={18} />
                        </div>
                        <div>
                            <h2>Add New User</h2>
                            <p>Create accounts for students, admins, departments, and clubs.</p>
                        </div>
                    </div>

                    {error && <div className="admin-users-alert admin-users-alert--error">{error}</div>}
                    {success && <div className="admin-users-alert admin-users-alert--success">{success}</div>}

                    <form onSubmit={handleSubmit} className="admin-users-form">
                        <div className="admin-users-form__grid">
                            <div className="form-group">
                                <label className="form-label">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Enter full name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="form-input"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Enter email address"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="form-input"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Create a password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="form-input"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Role</label>
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
                            <div className="form-group admin-users-form__full">
                                <label className="form-label">Department</label>
                                <select
                                    name="department"
                                    value={formData.department}
                                    onChange={handleChange}
                                    className="form-input"
                                    required
                                >
                                    <option value="" disabled>Select Department</option>
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

                        <button type="submit" className="btn btn-primary admin-users-submit" disabled={loading}>
                            {loading ? 'Creating...' : 'Create User'}
                        </button>
                    </form>
                </section>

                <section className="card admin-users-search-card">
                    <div className="admin-users-panel__head">
                        <div className="admin-users-panel__icon">
                            <Search size={18} />
                        </div>
                        <div>
                            <h2>Search User</h2>
                            <p>Check whether a particular user exists by name or email.</p>
                        </div>
                    </div>

                    <form onSubmit={handleSearch} className="admin-users-search-form">
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Enter name or email"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button type="submit" className="btn btn-primary">Search</button>
                    </form>

                    {hasSearched && (
                        searchResult ? (
                            <div className="admin-user-search-result admin-user-search-result--found">
                                <strong>User found</strong>
                                <span>{searchResult.name} • {searchResult.email}</span>
                                <span>Role: {searchResult.role}{searchResult.department ? ` • Department: ${searchResult.department}` : ''}</span>
                            </div>
                        ) : (
                            <div className="admin-user-search-result admin-user-search-result--missing">
                                <strong>User not found</strong>
                                <span>No matching user exists for the entered name or email.</span>
                            </div>
                        )
                    )}
                </section>
            </div>
        </div>
    );
};

export default UserManagement;

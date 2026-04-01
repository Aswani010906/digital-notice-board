import React, { useState, useEffect } from 'react';
import { userService } from '../services/api';
import { Eye, EyeOff } from 'lucide-react';

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
        <div style={{ marginTop: '2rem' }}>
            <h2>User Management (Admin Only)</h2>

            <div className="card" style={{ marginBottom: '2rem' }}>
                <h3>Add New User</h3>
                {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
                {success && <div style={{ color: 'green', marginBottom: '1rem' }}>{success}</div>}
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={handleChange}
                        className="input"
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={handleChange}
                        className="input"
                        required
                    />
                    <div className="password-input-wrap">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            className="input form-input password-input"
                            required
                        />
                        <button
                            type="button"
                            className="password-toggle"
                            onClick={() => setShowPassword((value) => !value)}
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                            aria-pressed={showPassword}
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="input"
                    >
                        <option value="student">Student</option>
                        <option value="admin">Admin</option>
                        <option value="department">Department Head</option>
                        <option value="club">Club Representative</option>
                    </select>
                    <select
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        className="input"
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
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Creating...' : 'Create User'}
                    </button>
                </form>
            </div>

            <div className="card">
                <h3>Existing Users</h3>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                                <th style={{ padding: '0.5rem' }}>Name</th>
                                <th style={{ padding: '0.5rem' }}>Email</th>
                                <th style={{ padding: '0.5rem' }}>Role</th>
                                <th style={{ padding: '0.5rem' }}>Department</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                    <td style={{ padding: '0.5rem' }}>{user.name}</td>
                                    <td style={{ padding: '0.5rem' }}>{user.email}</td>
                                    <td style={{ padding: '0.5rem' }}>
                                        <span style={{
                                            background: 'var(--bg-card-hover)',
                                            padding: '0.2rem 0.5rem',
                                            borderRadius: '4px',
                                            fontSize: '0.85rem'
                                        }}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td style={{ padding: '0.5rem' }}>{user.department || '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UserManagement;

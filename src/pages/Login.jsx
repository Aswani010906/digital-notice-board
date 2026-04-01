import React, { useState } from 'react';
import { authService } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { BellRing, Eye, EyeOff, ShieldCheck, Sparkles } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }
        setLoading(true);
        setError('');

        try {
            const user = await authService.login({ email, password });
            navigate(user.role === 'student' ? '/notices' : '/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="login-shell">
            <div className="login-backdrop login-backdrop-one"></div>
            <div className="login-backdrop login-backdrop-two"></div>

            <div className="login-layout">
                <div className="login-hero">
                    <div className="login-chip">
                        <BellRing size={16} />
                        <span>College Notice Board</span>
                    </div>

                    <h1>College Notice Board</h1>
                    <p>
                        A focused digital space for official updates, staff coordination, and campus communication.
                    </p>

                    <div className="login-feature-list">
                        <div className="login-feature-item">
                            <Sparkles size={18} />
                            <span>Clean, modern access for admins and staff</span>
                        </div>
                        <div className="login-feature-item">
                            <ShieldCheck size={18} />
                            <span>Secure sign-in before notices and management tools appear</span>
                        </div>
                    </div>
                </div>

                <div className="login-panel">
                    <div className="login-card">
                        <h2>Staff/Admin Login</h2>
                        <p className="login-subtitle">Sign in to manage notices, categories, and users.</p>

                        {error && (
                            <div className="login-error">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleLogin}>
                            <div className="form-group">
                                <label className="form-label">Email Address</label>
                                <input
                                    type="email"
                                    className="form-input"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@college.edu"
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Password</label>
                                <div className="password-input-wrap">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        className="form-input password-input"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter your password"
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
                            </div>
                            <button
                                type="submit"
                                className="btn btn-primary login-submit"
                                disabled={loading}
                            >
                                {loading ? 'Signing in...' : 'Sign In'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Login;

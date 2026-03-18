import React, { useLayoutEffect, useRef, useState } from 'react';
import { authService } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { BellRing, ShieldCheck, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const shellRef = useRef(null);
    const heroRef = useRef(null);
    const cardRef = useRef(null);
    const glowOneRef = useRef(null);
    const glowTwoRef = useRef(null);

    useLayoutEffect(() => {
        const context = gsap.context(() => {
            gsap.fromTo(heroRef.current, { y: 36, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out' });
            gsap.fromTo(cardRef.current, { y: 42, opacity: 0, rotateX: -8 }, { y: 0, opacity: 1, rotateX: 0, duration: 0.95, delay: 0.12, ease: 'power3.out' });
            gsap.to(glowOneRef.current, { y: 18, x: 10, duration: 6, repeat: -1, yoyo: true, ease: 'sine.inOut' });
            gsap.to(glowTwoRef.current, { y: -20, x: -14, duration: 7, repeat: -1, yoyo: true, ease: 'sine.inOut' });
        }, shellRef);

        return () => context.revert();
    }, []);

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
        <section className="login-shell" ref={shellRef}>
            <div ref={glowOneRef} className="login-backdrop login-backdrop-one"></div>
            <div ref={glowTwoRef} className="login-backdrop login-backdrop-two"></div>

            <div className="login-layout">
                <motion.div
                    ref={heroRef}
                    className="login-hero"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                >
                    <motion.div className="login-chip" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12, duration: 0.45 }}>
                        <BellRing size={16} />
                        <span>College Notice Board</span>
                    </motion.div>

                    <motion.h1 initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18, duration: 0.55 }}>
                        College Notice Board
                    </motion.h1>
                    <motion.p initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.26, duration: 0.55 }}>
                        A focused digital space for official updates, staff coordination, and campus communication.
                    </motion.p>

                    <motion.div className="login-feature-list" initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.34 } } }}>
                        <motion.div className="login-feature-item" variants={{ hidden: { opacity: 0, x: -18 }, show: { opacity: 1, x: 0 } }} transition={{ duration: 0.45 }}>
                            <Sparkles size={18} />
                            <span>Clean, modern access for admins and staff</span>
                        </motion.div>
                        <motion.div className="login-feature-item" variants={{ hidden: { opacity: 0, x: -18 }, show: { opacity: 1, x: 0 } }} transition={{ duration: 0.45 }}>
                            <ShieldCheck size={18} />
                            <span>Secure sign-in before notices and management tools appear</span>
                        </motion.div>
                    </motion.div>
                </motion.div>

                <div className="login-panel">
                    <motion.div
                        ref={cardRef}
                        className="login-card"
                        whileHover={{ y: -4 }}
                        transition={{ duration: 0.25 }}
                    >
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
                                <input
                                    type="password"
                                    className="form-input"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                />
                            </div>
                            <button
                                type="submit"
                                className="btn btn-primary login-submit"
                                disabled={loading}
                            >
                                {loading ? 'Signing in...' : 'Sign In'}
                            </button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Login;

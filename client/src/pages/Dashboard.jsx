import React, { useEffect, useState } from 'react';
import { noticeService, authService } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, FilePlus2, ImagePlus, ShieldCheck, Trash2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const CATEGORIES = ['Whole College', 'CSE', 'EEE', 'EC', 'ME', 'CE', 'RAI', 'IEEE', 'ISTE', 'IEDC', 'TinkerHub', 'NSS', 'Sports', 'Arts Club'];

const Dashboard = () => {
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({ title: '', description: '', category: 'Whole College', deadline: '', expiryDate: '', file: null });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [noticeToDelete, setNoticeToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const navigate = useNavigate();
    const user = authService.getCurrentUser();

    if (!user) {
        navigate('/login');
        return null;
    }

    if (user.role === 'student') {
        navigate('/notices');
        return null;
    }

    useEffect(() => {
        fetchMyNotices();
    }, []);

    const fetchMyNotices = async () => {
        try {
            const data = await noticeService.getNotices();
            const myNotices = data.filter(n => n.postedBy?._id === user._id);
            setNotices(myNotices);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('description', formData.description);
            data.append('category', formData.category);
            if (formData.deadline) data.append('deadline', formData.deadline);
            if (formData.expiryDate) data.append('expiryDate', formData.expiryDate);
            if (formData.file) data.append('image', formData.file);

            await noticeService.createNotice(data);
            setSuccess('Notice created successfully!');
            setFormData({ title: '', description: '', category: 'Whole College', deadline: '', expiryDate: '', file: null });
            fetchMyNotices();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError('Failed to create notice: ' + (err.response?.data?.message || err.message));
            setTimeout(() => setError(''), 3000);
        }
    };

    const handleDelete = async () => {
        if (!noticeToDelete) return;

        setIsDeleting(true);
        try {
            await noticeService.deleteNotice(noticeToDelete._id);
            setSuccess('Notice deleted successfully.');
            setNoticeToDelete(null);
            fetchMyNotices();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError('Failed to delete notice: ' + (err.response?.data?.message || err.message));
            setTimeout(() => setError(''), 3000);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="container main-content">
            {(error || success) && (
                <div className="app-toast-stack">
                    {error && <div className="app-toast app-toast--error">{error}</div>}
                    {success && <div className="app-toast app-toast--success">{success}</div>}
                </div>
            )}

            <motion.section className="page-hero" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
                <div className="page-hero__badge">
                    <ShieldCheck size={16} />
                    <span>{user.role.toUpperCase()} PANEL</span>
                </div>
                <div className="page-hero__header">
                    <div>
                        <h1>Dashboard</h1>
                        <p>Create, organize, and manage the notices you publish across the college board.</p>
                    </div>
                    <div className="page-hero__stats">
                        <div className="page-hero-stat">
                            <ClipboardList size={18} />
                            <div>
                                <strong>{notices.length}</strong>
                                <span>Managed Notices</span>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.section>

            <div className="dashboard-layout">
                <motion.section className="card dashboard-panel dashboard-panel--form" initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08, duration: 0.45 }}>
                    <div className="dashboard-panel__head">
                        <div className="dashboard-panel__icon">
                            <FilePlus2 size={18} />
                        </div>
                        <div>
                            <h2>Post New Notice</h2>
                            <p>Create a fresh announcement with optional dates and poster upload.</p>
                        </div>
                    </div>

                    <form onSubmit={handleCreate} className="dashboard-form">
                        <div className="dashboard-form__grid">
                            <div className="form-group dashboard-form__full">
                                <label className="form-label">Title</label>
                                <input type="text" className="form-input" required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                            </div>
                            <div className="form-group dashboard-form__full">
                                <label className="form-label">Description</label>
                                <textarea className="form-input dashboard-textarea" required rows="5" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}></textarea>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Category</label>
                                <select className="form-input" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                                    {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Poster</label>
                                <div className="dashboard-upload-wrap">
                                    <div className="dashboard-upload-wrap__icon">
                                        <ImagePlus size={18} />
                                    </div>
                                    <div className="dashboard-upload-wrap__copy">
                                        <strong>{formData.file ? formData.file.name : 'Upload poster image'}</strong>
                                        <span>{formData.file ? 'Poster selected successfully' : 'PNG, JPG, JPEG, WEBP or GIF'}</span>
                                    </div>
                                    <input type="file" accept="image/*" className="form-input" onChange={e => setFormData({ ...formData, file: e.target.files[0] })} />
                                </div>
                            </div>
                            <div className="dashboard-date-card">
                                <label className="form-label">Event Deadline</label>
                                <p className="dashboard-date-card__hint">Optional last date for an event or registration.</p>
                                <input type="date" className="form-input" value={formData.deadline} onChange={e => setFormData({ ...formData, deadline: e.target.value })} />
                            </div>
                            <div className="dashboard-date-card">
                                <label className="form-label">Archive After Date</label>
                                <p className="dashboard-date-card__hint">Move the notice to archive automatically after this date.</p>
                                <input type="date" className="form-input" value={formData.expiryDate} onChange={e => setFormData({ ...formData, expiryDate: e.target.value })} />
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary dashboard-submit">Post Notice</button>
                    </form>
                </motion.section>

                <motion.section className="card dashboard-panel dashboard-panel--list" initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14, duration: 0.45 }}>
                    <div className="dashboard-panel__head">
                        <div className="dashboard-panel__icon">
                            <ClipboardList size={18} />
                        </div>
                        <div>
                            <h2>Manage Notices</h2>
                            <p>Quickly review and remove notices you have already published.</p>
                        </div>
                    </div>

                    <div className="dashboard-notice-list">
                        {loading ? (
                            <p>Loading...</p>
                        ) : notices.length === 0 ? (
                            <div className="dashboard-empty-state">No notices posted by you yet.</div>
                        ) : notices.map(notice => (
                            <motion.div key={notice._id} className="dashboard-notice-row" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                                <div className="dashboard-notice-row__copy">
                                    <h4>{notice.title}</h4>
                                    <div className="dashboard-notice-row__meta">
                                        <span className="dashboard-notice-chip">{notice.category}</span>
                                        <span>{new Date(notice.createdAt).toLocaleDateString('en-US', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric'
                                        })}</span>
                                    </div>
                                </div>
                                <button onClick={() => setNoticeToDelete(notice)} className="btn btn-danger dashboard-delete-btn">
                                    <span>Delete</span>
                                    <Trash2 size={16} />
                                </button>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>
            </div>

            <AnimatePresence>
            {noticeToDelete && (
                <motion.div className="notice-modal-backdrop" onClick={() => !isDeleting && setNoticeToDelete(null)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <motion.div className="dashboard-delete-modal" onClick={(e) => e.stopPropagation()} initial={{ opacity: 0, y: 24, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 18, scale: 0.97 }} transition={{ duration: 0.28 }}>
                        <div className="dashboard-delete-modal__icon">
                            <Trash2 size={20} />
                        </div>
                        <h3>Delete this notice?</h3>
                        <p>
                            This will remove <strong>{noticeToDelete.title}</strong> from the notice board.
                        </p>
                        <div className="dashboard-delete-modal__actions">
                            <button
                                type="button"
                                className="btn btn-outline"
                                onClick={() => setNoticeToDelete(null)}
                                disabled={isDeleting}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="btn dashboard-delete-modal__confirm"
                                onClick={handleDelete}
                                disabled={isDeleting}
                            >
                                {isDeleting ? 'Deleting...' : 'Delete Notice'}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
            </AnimatePresence>
        </div>
    );
};

export default Dashboard;

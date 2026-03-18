import React, { useEffect, useState } from 'react';
import { noticeService, authService } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, FilePlus2, ImagePlus, ShieldCheck, Trash2 } from 'lucide-react';

const CATEGORIES = ['Whole College', 'CSE', 'EEE', 'EC', 'ME', 'CE', 'RAI', 'IEEE', 'ISTE', 'TinkerHub', 'NSS', 'Arts Club'];

const Dashboard = () => {
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({ title: '', description: '', category: 'Whole College', deadline: '', expiryDate: '', file: null });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
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

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this notice?')) {
            try {
                await noticeService.deleteNotice(id);
                fetchMyNotices();
            } catch (err) {
                alert('Failed to delete notice: ' + (err.response?.data?.message || err.message));
            }
        }
    };

    return (
        <div className="container main-content">
            <section className="page-hero">
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
            </section>

            <div className="dashboard-layout">
                <section className="card dashboard-panel dashboard-panel--form">
                    <div className="dashboard-panel__head">
                        <div className="dashboard-panel__icon">
                            <FilePlus2 size={18} />
                        </div>
                        <div>
                            <h2>Post New Notice</h2>
                            <p>Create a fresh announcement with optional dates and poster upload.</p>
                        </div>
                    </div>

                    {error && <div className="dashboard-alert dashboard-alert--error">{error}</div>}
                    {success && <div className="dashboard-alert dashboard-alert--success">{success}</div>}

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
                </section>

                <section className="card dashboard-panel dashboard-panel--list">
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
                            <div key={notice._id} className="dashboard-notice-row">
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
                                <button onClick={() => handleDelete(notice._id)} className="btn btn-danger dashboard-delete-btn">
                                    <span>Delete</span>
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Dashboard;

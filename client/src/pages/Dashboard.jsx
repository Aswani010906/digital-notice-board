import React, { useEffect, useState } from 'react';
import { noticeService, authService } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { Trash2 } from 'lucide-react';

const CATEGORIES = ['CSE', 'ECE', 'EC', 'ME', 'CE', 'RAI', 'NSS', 'IEEE', 'Arts Club', 'Whole College'];

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

    useEffect(() => {
        fetchMyNotices();
    }, []);

    const fetchMyNotices = async () => {
        try {
            const data = await noticeService.getNotices();
            // Filter my notices (or Admin sees all - simplistic approach here)
            const myNotices = user.role === 'admin' ? data : data.filter(n => n.postedBy?._id === user._id);
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1>Dashboard</h1>
                <span className="btn btn-outline" style={{ cursor: 'default' }}>Role: {user.role.toUpperCase()}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2">
                {/* Create Form or Student Welcome */}
                {user.role !== 'student' ? (
                    <div className="card" style={{ padding: '1.5rem', height: 'fit-content' }}>
                        <h2 style={{ marginBottom: '1.5rem' }}>Post New Notice</h2>
                        {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
                        {success && <div style={{ color: 'green', marginBottom: '1rem' }}>{success}</div>}

                        <form onSubmit={handleCreate}>
                            <div className="form-group">
                                <label className="form-label">Title</label>
                                <input type="text" className="form-input" required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Description</label>
                                <textarea className="form-input" required rows="4" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}></textarea>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Category</label>
                                <select className="form-input" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                                    {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                            </div>
                            <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label className="form-label">Event Deadline</label>
                                    <input type="date" className="form-input" value={formData.deadline} onChange={e => setFormData({ ...formData, deadline: e.target.value })} />
                                </div>
                                <div>
                                    <label className="form-label">Archive After Date</label>
                                    <input type="date" className="form-input" value={formData.expiryDate} onChange={e => setFormData({ ...formData, expiryDate: e.target.value })} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Upload Poster (Image)</label>
                                <input type="file" accept="image/*" className="form-input" onChange={e => setFormData({ ...formData, file: e.target.files[0] })} />
                            </div>
                            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Post Notice</button>
                        </form>
                    </div>
                ) : (
                    <div className="card" style={{ padding: '1.5rem', height: 'fit-content' }}>
                        <h2 style={{ marginBottom: '1.5rem' }}>Welcome to your Dashboard</h2>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
                            Here you can view the notices relevant to you. As a student, you have view-only access to the notice board.
                            <br /><br />
                            If you need to post an announcement for a club or event, please contact your department head or club representative.
                        </p>
                    </div>
                )}

                {/* Existing Notices List */}
                <div>
                    <h2 style={{ marginBottom: '1.5rem' }}>Manage Notices</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {loading ? <p>Loading...</p> : notices.length === 0 ? <p>No notices posted by you yet.</p> : notices.map(notice => (
                            <div key={notice._id} className="card" style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h4 style={{ marginBottom: '0.25rem' }}>{notice.title}</h4>
                                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{notice.category}</p>
                                </div>
                                <button onClick={() => handleDelete(notice._id)} className="btn btn-danger" style={{ padding: '0.5rem' }}>
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

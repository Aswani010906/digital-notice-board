import React, { useEffect, useState } from 'react';
import { noticeService, authService } from '../services/api';
import NoticeCard from '../components/NoticeCard';
import { useNavigate } from 'react-router-dom';

const CATEGORIES = ['CSE', 'EEE', 'EC', 'ME', 'CE', 'RAI', 'NSS', 'IEEE', 'Arts Club', 'Whole College'];

const Home = () => {
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const user = authService.getCurrentUser();

    useEffect(() => {
        fetchNotices();
    }, []);

    const fetchNotices = async () => {
        try {
            const data = await noticeService.getNotices();

            if (user && user.role === 'student' && user.department) {
                // Students only see Whole College, Clubs, and their own Department
                const allowedCategories = ['Whole College', 'NSS', 'IEEE', 'Arts Club', user.department];
                const filtered = data.filter(n => allowedCategories.includes(n.category));
                setNotices(filtered);
            } else {
                setNotices(data);
            }
        } catch (error) {
            console.error('Error fetching notices', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container main-content">
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>College Digital Notice Board</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
                    Stay updated with the latest announcements, events, and important notices from all departments and clubs.
                </p>
            </div>

            {user?.role === 'student' && (
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
                    <div className="btn btn-outline" style={{ cursor: 'default', fontWeight: '700', padding: '0.75rem 1.4rem' }}>
                        Role: Student
                    </div>
                </div>
            )}

            <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ marginBottom: '1rem' }}>Filter by Category</h3>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            className="btn btn-outline"
                            onClick={() => navigate(`/category/${encodeURIComponent(cat)}`)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{
                    display: 'inline-block',
                    width: '8px',
                    height: '24px',
                    background: 'var(--primary)',
                    borderRadius: '4px'
                }}></span>
                Latest Notices
            </h2>

            {loading ? (
                <p>Loading notices...</p>
            ) : notices.length === 0 ? (
                <div className="card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No notices found.
                </div>
            ) : (
                <div className="grid grid-cols-1 grid-cols-2 lg:grid-cols-3">
                    {notices.map(notice => (
                        <NoticeCard key={notice._id} notice={notice} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Home;

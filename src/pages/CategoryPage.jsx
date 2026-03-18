import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { noticeService, authService } from '../services/api';
import NoticeCard from '../components/NoticeCard';

const CategoryPage = () => {
    const { catName } = useParams();
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = authService.getCurrentUser();

    useEffect(() => {
        fetchCategoryNotices();
    }, [catName]);

    const fetchCategoryNotices = async () => {
        setLoading(true);
        try {
            const data = await noticeService.getNotices(catName);
            if (user?.role === 'student') {
                const allowedCategories = ['Whole College', 'CSE', 'EEE', 'EC', 'ME', 'CE', 'RAI', 'IEEE', 'ISTE', 'TinkerHub', 'NSS', 'Arts Club'];

                if (!allowedCategories.includes(catName)) {
                    setNotices([]);
                } else {
                    setNotices(data.filter(notice => allowedCategories.includes(notice.category)));
                }
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
            <div style={{ marginBottom: '2rem' }}>
                <Link to="/notices" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                    &larr; Back to Notices
                </Link>
                <h1>{catName} Notices</h1>
                <p style={{ color: 'var(--text-muted)' }}>Showing all active notices for {catName}.</p>
            </div>

            {loading ? (
                <p>Loading notices...</p>
            ) : notices.length === 0 ? (
                <div className="card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No notices found for this category.
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

export default CategoryPage;

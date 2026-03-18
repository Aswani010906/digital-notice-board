import React, { useEffect, useState } from 'react';
import { noticeService } from '../services/api';
import NoticeCard from '../components/NoticeCard';

const ArchivePage = () => {
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchArchivedNotices();
    }, []);

    const fetchArchivedNotices = async () => {
        try {
            const data = await noticeService.getArchivedNotices();
            setNotices(data);
        } catch (error) {
            console.error('Error fetching archived notices', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container main-content">
            <div style={{ marginBottom: '2rem' }}>
                <h1>Notice Archive</h1>
                <p style={{ color: 'var(--text-muted)' }}>Past and expired notices.</p>
            </div>

            {loading ? (
                <p>Loading archive...</p>
            ) : notices.length === 0 ? (
                <div className="card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No archived notices found.
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

export default ArchivePage;

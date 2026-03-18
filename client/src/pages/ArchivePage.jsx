import React, { useEffect, useState } from 'react';
import { noticeService } from '../services/api';
import NoticeCard from '../components/NoticeCard';
import { Archive, Clock3 } from 'lucide-react';

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
            <section className="page-hero">
                <div className="page-hero__badge">
                    <Archive size={16} />
                    <span>Archive</span>
                </div>
                <div className="page-hero__header">
                    <div>
                        <h1>Notice Archive</h1>
                        <p>Browse past and expired notices that have moved out of the active board.</p>
                    </div>
                    <div className="page-hero__stats">
                        <div className="page-hero-stat">
                            <Clock3 size={18} />
                            <div>
                                <strong>{notices.length}</strong>
                                <span>Archived Notices</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

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

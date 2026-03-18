import React, { useEffect, useState } from 'react';
import { noticeService } from '../services/api';
import NoticeCard from '../components/NoticeCard';
import { Archive, Clock3 } from 'lucide-react';
import { motion } from 'framer-motion';

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
            <motion.section className="page-hero" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
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
            </motion.section>

            {loading ? (
                <div className="category-page-state">Loading archive...</div>
            ) : notices.length === 0 ? (
                <div className="student-empty-state category-page-state">
                    No archived notices found.
                </div>
            ) : (
                <motion.div className="grid grid-cols-1 grid-cols-2 lg:grid-cols-3" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08, duration: 0.45 }}>
                    {notices.map(notice => (
                        <NoticeCard key={notice._id} notice={notice} />
                    ))}
                </motion.div>
            )}
        </div>
    );
};

export default ArchivePage;

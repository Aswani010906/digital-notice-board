import React, { useEffect, useState } from 'react';
import { noticeService, authService } from '../services/api';
import NoticeCard from '../components/NoticeCard';
import { useNavigate } from 'react-router-dom';

const CATEGORIES = ['Whole College', 'CSE', 'EEE', 'EC', 'ME', 'CE', 'RAI', 'IEEE', 'ISTE', 'TinkerHub', 'NSS', 'Arts Club'];
const SOCIETY_CATEGORIES = ['IEEE', 'ISTE', 'TinkerHub', 'NSS', 'Arts Club'];

const Home = () => {
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const user = authService.getCurrentUser();
    const isStudent = user?.role === 'student';
    const studentDepartment = user?.department;

    useEffect(() => {
        fetchNotices();
    }, []);

    const fetchNotices = async () => {
        try {
            const data = await noticeService.getNotices();
            setNotices(data);
        } catch (error) {
            console.error('Error fetching notices', error);
        } finally {
            setLoading(false);
        }
    };

    const wholeCollegeNotices = notices.filter((notice) => notice.category === 'Whole College');
    const societyNotices = notices.filter((notice) => SOCIETY_CATEGORIES.includes(notice.category));
    const departmentNotices = studentDepartment
        ? notices.filter((notice) => notice.category === studentDepartment)
        : [];

    const renderNoticeSection = (title, items, emptyText) => (
        <section className="student-notice-section">
            <div className="student-notice-section__header">
                <h2>{title}</h2>
            </div>
            {items.length === 0 ? (
                <div className="student-empty-state">
                    {emptyText}
                </div>
            ) : (
                <div className="grid grid-cols-1 grid-cols-2">
                    {items.map((notice) => (
                        <NoticeCard key={notice._id} notice={notice} />
                    ))}
                </div>
            )}
        </section>
    );

    return (
        <div className="container main-content">
            {isStudent ? (
                <div className="student-dashboard-shell">
                    <aside className="student-sidebar">
                        <div className="student-sidebar__top">
                            <div className="student-sidebar__eyebrow">Explore Board</div>
                            <h3>Categories</h3>
                            <p>Open any category to browse notices across departments and societies.</p>
                            <div className="student-role-badge">Role: Student</div>
                        </div>
                        <div className="student-sidebar__list">
                            {CATEGORIES.map((cat, index) => {
                                return (
                                    <button
                                        key={cat}
                                        type="button"
                                        className="student-sidebar__item"
                                        style={{ '--fade-delay': `${index * 0.03}s` }}
                                        onClick={() => navigate(`/category/${encodeURIComponent(cat)}`)}
                                    >
                                        <div className="student-sidebar__item-glow"></div>
                                        <span>{cat}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </aside>

                    <section className="student-main-panel">
                        <div className="student-hero">
                            <h1>College Notice Board</h1>
                            <p>
                                Browse campus-wide updates, society announcements, and notices from your department.
                                Other department notices are available from the category sidebar.
                            </p>
                        </div>

                        {loading ? (
                            <p>Loading notices...</p>
                        ) : (
                            <div className="student-notice-layout">
                                {renderNoticeSection(
                                    'Whole College Notices',
                                    wholeCollegeNotices,
                                    'No whole college notices available right now.'
                                )}
                                {renderNoticeSection(
                                    'Society Notices',
                                    societyNotices,
                                    'No society notices available right now.'
                                )}
                                {renderNoticeSection(
                                    studentDepartment ? `${studentDepartment} Department Notices` : 'Department Notices',
                                    departmentNotices,
                                    studentDepartment
                                        ? `No notices available for ${studentDepartment} right now.`
                                        : 'Your department is not set yet.'
                                )}
                            </div>
                        )}
                    </section>
                </div>
            ) : (
                <>
                    <div style={{ position: 'relative', marginBottom: '3rem' }}>
                        <div style={{ textAlign: 'center' }}>
                            <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>College Digital Notice Board</h1>
                            <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
                                Stay updated with the latest announcements, events, and important notices from all departments and clubs.
                            </p>
                        </div>
                    </div>

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
                </>
            )}
        </div>
    );
};

export default Home;

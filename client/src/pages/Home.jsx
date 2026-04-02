import React, { useEffect, useState } from 'react';
import { noticeService, authService } from '../services/api';
import NoticeCard from '../components/NoticeCard';
import { useNavigate } from 'react-router-dom';
import { BellRing, ChevronDown, ChevronUp, LayoutList } from 'lucide-react';
import { motion } from 'framer-motion';

const CATEGORIES = ['Whole College', 'CSE', 'EEE', 'EC', 'ME', 'CE', 'RAI', 'IEEE', 'ISTE', 'IEDC', 'TinkerHub', 'NSS', 'Sports', 'Arts Club'];
const SOCIETY_CATEGORIES = ['IEEE', 'ISTE', 'IEDC', 'TinkerHub', 'NSS', 'Sports', 'Arts Club'];
const CATEGORY_DISPLAY_NAMES = {
    'Whole College': 'Whole College',
    CSE: 'Computer Science Department',
    EEE: 'Electrical and Electronics Department',
    EC: 'Electronics and Communication Department',
    ME: 'Mechanical Department',
    CE: 'Civil Department',
    RAI: 'Robotics and Artificial Intelligence Department',
    IEEE: 'Institute of Electrical and Electronics Engineers',
    ISTE: 'Indian Society for Technical Education',
    IEDC: 'Innovation and Entrepreneurship Development Centre',
    TinkerHub: 'TinkerHub',
    NSS: 'National Service Scheme',
    Sports: 'Sports',
    'Arts Club': 'Arts Club'
};

const Home = () => {
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAllNotices, setShowAllNotices] = useState(false);
    const navigate = useNavigate();
    const user = authService.getCurrentUser();
    const isStudent = user?.role === 'student';
    const studentDepartment = user?.department;
    const studentDepartmentName = CATEGORY_DISPLAY_NAMES[studentDepartment] || studentDepartment;
    const initialNoticeCount = 6;

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
    const visibleAdminNotices = showAllNotices ? notices : notices.slice(0, initialNoticeCount);

    const renderNoticeSection = (title, items, emptyText) => (
        <motion.section
            className="student-notice-section"
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.45 }}
        >
            <div className="student-notice-section__header">
                <h2>{title}</h2>
            </div>
            {items.length === 0 ? (
                <div className="student-empty-state">
                    {emptyText}
                </div>
            ) : (
                <div className="grid grid-cols-1 grid-cols-2 grid-cols-3 grid-cols-4">
                    {items.map((notice) => (
                        <NoticeCard key={notice._id} notice={notice} />
                    ))}
                </div>
            )}
        </motion.section>
    );

    return (
        <div className="container main-content">
            {isStudent ? (
                <div className="student-dashboard-shell">
                    <motion.aside className="student-sidebar" initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45 }}>
                        <motion.div className="student-sidebar__top" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08, duration: 0.4 }}>
                            <div className="student-sidebar__eyebrow">Explore Board</div>
                            <h3>Categories</h3>
                            <p>Open any category to browse notices across departments and societies.</p>
                            <div className="student-role-badge">Role: Student</div>
                        </motion.div>
                        <div className="student-sidebar__list">
                            {CATEGORIES.map((cat, index) => (
                                <motion.button
                                    key={cat}
                                    type="button"
                                    className="student-sidebar__item"
                                    style={{ '--fade-delay': `${index * 0.03}s` }}
                                    onClick={() => navigate(`/category/${encodeURIComponent(cat)}`)}
                                    initial={{ opacity: 0, x: -18 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.08 + index * 0.04, duration: 0.35 }}
                                    whileHover={{ x: 6, scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                >
                                    <div className="student-sidebar__item-glow"></div>
                                    <span>{cat}</span>
                                </motion.button>
                            ))}
                        </div>
                    </motion.aside>

                    <section className="student-main-panel">
                        <motion.div className="student-hero" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12, duration: 0.45 }}>
                            <h1>College Notice Board</h1>
                            <p>
                                Browse campus-wide updates, society announcements, and notices from your department.
                                Other department notices are available from the category sidebar.
                            </p>
                        </motion.div>

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
                                    studentDepartmentName ? `${studentDepartmentName} Notices` : 'Department Notices',
                                    departmentNotices,
                                    studentDepartmentName
                                        ? `No notices available for ${studentDepartmentName} right now.`
                                        : 'Your department is not set yet.'
                                )}
                            </div>
                        )}
                    </section>
                </div>
            ) : (
                <div className="student-dashboard-shell">
                    <motion.aside className="student-sidebar" initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45 }}>
                        <motion.div className="student-sidebar__top" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08, duration: 0.4 }}>
                            <div className="student-sidebar__eyebrow">Explore Board</div>
                            <h3>Categories</h3>
                            <p>Open any category to browse notices. All active notices are shown on the main board.</p>
                            <div className="student-role-badge">Role: {user?.role || 'User'}</div>
                        </motion.div>
                        <div className="student-sidebar__list">
                            {CATEGORIES.map((cat, index) => (
                                <motion.button
                                    key={cat}
                                    type="button"
                                    className="student-sidebar__item"
                                    style={{ '--fade-delay': `${index * 0.03}s` }}
                                    onClick={() => navigate(`/category/${encodeURIComponent(cat)}`)}
                                    initial={{ opacity: 0, x: -18 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.08 + index * 0.04, duration: 0.35 }}
                                    whileHover={{ x: 6, scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                >
                                    <div className="student-sidebar__item-glow"></div>
                                    <span>{cat}</span>
                                </motion.button>
                            ))}
                        </div>
                    </motion.aside>

                    <section className="student-main-panel">
                        <motion.section className="page-hero" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12, duration: 0.45 }}>
                            <div className="page-hero__badge">
                                <BellRing size={16} />
                                <span>Notice Board</span>
                            </div>
                            <div className="page-hero__header">
                                <div>
                                    <h1>College Digital Notice Board</h1>
                                    <p>
                                        Stay updated with the latest announcements, events, and important notices from all departments and clubs.
                                    </p>
                                </div>
                                <div className="page-hero__stats">
                                    <div className="page-hero-stat">
                                        <LayoutList size={18} />
                                        <div>
                                            <strong>{notices.length}</strong>
                                            <span>Active Notices</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.section>

                        <motion.section className="student-notice-section" initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18, duration: 0.45 }}>
                            <div className="student-notice-section__header">
                                <h2>Latest Notices</h2>
                            </div>

                            {loading ? (
                                <p>Loading notices...</p>
                            ) : notices.length === 0 ? (
                                <div className="student-empty-state">
                                    No notices found.
                                </div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-1 grid-cols-2 grid-cols-3 grid-cols-4">
                                        {visibleAdminNotices.map((notice) => (
                                            <NoticeCard key={notice._id} notice={notice} />
                                        ))}
                                    </div>

                                    {notices.length > initialNoticeCount && (
                                        <div className="notice-expand-wrap">
                                            <button
                                                type="button"
                                                className="notice-expand-btn"
                                                onClick={() => setShowAllNotices((current) => !current)}
                                            >
                                                {showAllNotices ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                                <span>{showAllNotices ? 'Show Less' : 'Show More'}</span>
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </motion.section>
                    </section>
                </div>
            )}
        </div>
    );
};

export default Home;

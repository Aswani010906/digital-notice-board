import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { noticeService, authService } from '../services/api';
import NoticeCard from '../components/NoticeCard';
import { ArrowLeft, FolderOpen, LayoutList } from 'lucide-react';

const CATEGORY_DISPLAY_NAMES = {
    'Whole College': 'Whole College',
    CSE: 'Computer Science and Engineering',
    EEE: 'Electrical and Electronics Engineering',
    EC: 'Electronics and Communication Engineering',
    ME: 'Mechanical Engineering',
    CE: 'Civil Engineering',
    RAI: 'Robotics and Artificial Intelligence',
    IEEE: 'Institute of Electrical and Electronics Engineers',
    ISTE: 'Indian Society for Technical Education',
    IEDC: 'Innovation and Entrepreneurship Development Centre',
    TinkerHub: 'TinkerHub',
    NSS: 'National Service Scheme',
    Sports: 'Sports',
    'Arts Club': 'Arts Club'
};

const CategoryPage = () => {
    const { catName } = useParams();
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = authService.getCurrentUser();
    const categoryTitle = CATEGORY_DISPLAY_NAMES[catName] || catName;

    useEffect(() => {
        fetchCategoryNotices();
    }, [catName]);

    const fetchCategoryNotices = async () => {
        setLoading(true);
        try {
            const data = await noticeService.getNotices(catName);
            if (user?.role === 'student') {
                const allowedCategories = ['Whole College', 'CSE', 'EEE', 'EC', 'ME', 'CE', 'RAI', 'IEEE', 'ISTE', 'IEDC', 'TinkerHub', 'NSS', 'Sports', 'Arts Club'];

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
            <section className="page-hero category-page-hero">
                <div className="page-hero__badge">
                    <FolderOpen size={16} />
                    <span>Category View</span>
                </div>
                <div className="page-hero__header">
                    <div>
                        <Link to="/notices" className="category-page__back-link">
                            <ArrowLeft size={16} />
                            <span>Back to Notices</span>
                        </Link>
                        <h1>{categoryTitle} Notices</h1>
                        <p>Browse all active notices published under {categoryTitle} in one clean view.</p>
                    </div>
                    <div className="page-hero__stats">
                        <div className="page-hero-stat">
                            <LayoutList size={18} />
                            <div>
                                <strong>{loading ? '--' : notices.length}</strong>
                                <span>Active Notices</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="student-notice-section category-page-section">
                <div className="student-notice-section__header">
                    <p className="category-page-section__subtitle">Open any notice to read the full content and poster.</p>
                </div>

                {loading ? (
                    <div className="category-page-state">
                        Loading notices...
                    </div>
                ) : notices.length === 0 ? (
                    <div className="student-empty-state category-page-state">
                        No notices found for this category.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 grid-cols-2 lg:grid-cols-3">
                        {notices.map(notice => (
                            <NoticeCard key={notice._id} notice={notice} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default CategoryPage;

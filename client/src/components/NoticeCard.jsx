import React from 'react';
import { Calendar, User, Tag, Paperclip } from 'lucide-react';

const NoticeCard = ({ notice }) => {
    const date = new Date(notice.createdAt).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });

    return (
        <div className="card notice-card">
            <div style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', flex: 1 }}>{notice.title}</h3>
                    <span style={{
                        background: 'var(--primary)',
                        color: 'white',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '999px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        whiteSpace: 'nowrap',
                        marginLeft: '1rem'
                    }}>
                        {notice.category}
                    </span>
                </div>

                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                    {notice.description}
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Calendar size={16} />
                        {date}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <User size={16} />
                        {notice.postedBy?.name || 'Admin'}
                    </div>
                    {notice.attachment && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <a href={notice.attachment} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: 'var(--primary)' }}>
                                <Paperclip size={16} />
                                Attachment
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NoticeCard;

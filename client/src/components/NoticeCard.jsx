import React, { useState } from 'react';
import { Calendar, User, Paperclip, X } from 'lucide-react';

const NoticeCard = ({ notice }) => {
    const [isOpen, setIsOpen] = useState(false);

    const date = new Date(notice.createdAt).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });

    const deadlineStr = notice.deadline ? new Date(notice.deadline).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    }) : null;

    const isImageAttachment = Boolean(notice.attachment && notice.attachment.match(/\.(jpg|jpeg|png|webp|gif)$/i));
    const previewText = notice.description.length > 140
        ? `${notice.description.slice(0, 140).trim()}...`
        : notice.description;

    return (
        <>
            <button
                type="button"
                className="card notice-card"
                onClick={() => setIsOpen(true)}
                style={{ display: 'flex', flexDirection: 'column', width: '100%', textAlign: 'left', cursor: 'pointer' }}
            >
                <div style={{ padding: '1.5rem' }}>
                    {deadlineStr && (
                        <div style={{ marginBottom: '1rem' }}>
                            <span style={{
                                background: '#ffe4e6',
                                color: '#e11d48',
                                padding: '0.25rem 0.75rem',
                                borderRadius: '4px',
                                fontSize: '0.875rem',
                                fontWeight: '600',
                                border: '1px solid #fda4af'
                            }}>
                                Deadline: {deadlineStr}
                            </span>
                        </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', gap: '1rem' }}>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', flex: 1 }}>{notice.title}</h3>
                        <span style={{
                            background: 'var(--primary)',
                            color: 'white',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '999px',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            whiteSpace: 'nowrap'
                        }}>
                            {notice.category}
                        </span>
                    </div>

                    <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                        {previewText}
                    </p>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <Calendar size={16} />
                            {date}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <User size={16} />
                            {notice.postedBy?.name || 'Admin'}
                        </div>
                    </div>

                    <span className="notice-card__cta">Click to view full notice</span>
                </div>
            </button>

            {isOpen && (
                <div className="notice-modal-backdrop" onClick={() => setIsOpen(false)}>
                    <div className="notice-modal" onClick={(e) => e.stopPropagation()}>
                        <button
                            type="button"
                            className="notice-modal__close"
                            onClick={() => setIsOpen(false)}
                            aria-label="Close notice"
                        >
                            <X size={18} />
                        </button>

                        <div className="notice-modal__content">
                            {deadlineStr && (
                                <div style={{ marginBottom: '1rem' }}>
                                    <span style={{
                                        background: '#ffe4e6',
                                        color: '#e11d48',
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '4px',
                                        fontSize: '0.875rem',
                                        fontWeight: '600',
                                        border: '1px solid #fda4af'
                                    }}>
                                        Deadline: {deadlineStr}
                                    </span>
                                </div>
                            )}

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
                                <h2 style={{ fontSize: '1.9rem', flex: 1 }}>{notice.title}</h2>
                                <span style={{
                                    background: 'var(--primary)',
                                    color: 'white',
                                    padding: '0.35rem 0.7rem',
                                    borderRadius: '999px',
                                    fontSize: '0.8rem',
                                    fontWeight: '600',
                                    whiteSpace: 'nowrap'
                                }}>
                                    {notice.category}
                                </span>
                            </div>

                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                    <Calendar size={16} />
                                    {date}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                    <User size={16} />
                                    {notice.postedBy?.name || 'Admin'}
                                </div>
                                {notice.attachment && !isImageAttachment && (
                                    <a
                                        href={`http://localhost:5000${notice.attachment}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--primary)' }}
                                    >
                                        <Paperclip size={16} />
                                        View Attachment
                                    </a>
                                )}
                            </div>

                            <p className="notice-modal__description">{notice.description}</p>

                            {isImageAttachment && (
                                <div className="notice-modal__poster">
                                    <img
                                        src={`http://localhost:5000${notice.attachment}`}
                                        alt="Notice Poster"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default NoticeCard;

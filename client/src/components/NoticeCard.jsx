import React, { useState } from 'react';
import { Calendar, User, Paperclip, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

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
            <motion.button
                type="button"
                className="card notice-card notice-small-box"
                onClick={() => setIsOpen(true)}
                style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', textAlign: 'left', cursor: 'pointer', background: 'var(--card-bg)' }}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.1 }}
                whileHover={{ y: -6, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
                <div style={{ padding: '1.25rem', width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.8rem', gap: '0.5rem' }}>
                        <span style={{
                            background: 'rgba(15, 118, 110, 0.12)',
                            color: 'var(--primary)',
                            padding: '0.2rem 0.6rem',
                            borderRadius: '6px',
                            fontSize: '0.75rem',
                            fontWeight: '700',
                            letterSpacing: '0.02em',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        }}>
                            {notice.category}
                        </span>
                        {(isImageAttachment || notice.attachment) && (
                            <Paperclip size={14} style={{ color: 'var(--text-muted)' }} />
                        )}
                    </div>
                    
                    <h3 style={{ 
                        fontSize: '1.05rem', 
                        lineHeight: '1.4', 
                        marginBottom: '1.2rem', 
                        flex: 1,
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        color: 'var(--text-main)'
                    }}>
                        {notice.title}
                    </h3>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 'auto', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '0.8rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: '500' }}>
                                <Calendar size={13} />
                                {date}
                            </div>
                        </div>
                        {deadlineStr && (
                            <div style={{ background: '#fff0f2', color: '#e11d48', padding: '0.15rem 0.45rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: '700' }}>
                                Due {deadlineStr}
                            </div>
                        )}
                    </div>
                </div>
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="notice-modal-backdrop"
                        onClick={() => setIsOpen(false)}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.22 }}
                    >
                        <motion.div
                            className="notice-modal"
                            onClick={(e) => e.stopPropagation()}
                            initial={{ opacity: 0, y: 30, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 18, scale: 0.97 }}
                            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                        >
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
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default NoticeCard;

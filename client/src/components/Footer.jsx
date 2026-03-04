import React from 'react';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <p>&copy; {new Date().getFullYear()} College Digital Notice Board. All Rights Reserved.</p>
                <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>Designed for clear communication.</p>
            </div>
        </footer>
    );
};

export default Footer;

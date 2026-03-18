const cron = require('node-cron');
const Notice = require('../models/Notice');

const archiveNotices = async () => {
    try {
        const currentDate = new Date();
        // Find notices that have expired and are not already archived
        const result = await Notice.updateMany(
            {
                expiryDate: { $lte: currentDate },
                isArchived: false,
            },
            {
                $set: { isArchived: true }
            }
        );
        if (result.modifiedCount > 0) {
            console.log(`Auto-archived ${result.modifiedCount} expired notices.`);
        }
    } catch (error) {
        console.error('Error auto-archiving notices:', error.message);
    }
};

// Run cron job once every day at midnight
const startArchiver = () => {
    cron.schedule('0 0 * * *', () => {
        console.log('Running archive scheduler...');
        archiveNotices();
    });
    console.log('Archive scheduler setup complete.');
};

module.exports = startArchiver;

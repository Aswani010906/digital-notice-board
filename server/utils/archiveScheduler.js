const cron = require('node-cron');
const Notice = require('../models/Notice');

const archiveNotices = async () => {
    try {
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        // Recover notices that were archived too early before the date-handling fix.
        const restoreResult = await Notice.updateMany(
            {
                expiryDate: { $gte: startOfToday },
                isArchived: true,
            },
            {
                $set: { isArchived: false }
            }
        );

        // Archive only after the selected expiry day has fully finished.
        const archiveResult = await Notice.updateMany(
            {
                expiryDate: { $lt: startOfToday },
                isArchived: false,
            },
            {
                $set: { isArchived: true }
            }
        );
        if (restoreResult.modifiedCount > 0) {
            console.log(`Restored ${restoreResult.modifiedCount} notices that were archived too early.`);
        }
        if (archiveResult.modifiedCount > 0) {
            console.log(`Auto-archived ${archiveResult.modifiedCount} expired notices.`);
        }
    } catch (error) {
        console.error('Error auto-archiving notices:', error.message);
    }
};

const startArchiver = () => {
    archiveNotices();

    // Run the archive job every 5 minutes to keep notices in sync with expiry dates.
    cron.schedule('*/5 * * * *', () => {
        console.log('Running archive scheduler...');
        archiveNotices();
    });

    console.log('Archive scheduler setup complete. Running on startup and every 5 minutes.');
};

module.exports = startArchiver;

const Notice = require('../models/Notice');

// @desc    Get all notices
// @route   GET /api/notices
// @access  Public
const getNotices = async (req, res) => {
    try {
        const { category } = req.query;
        let query = { isArchived: false };

        if (category) {
            query.category = category;
        }

        const notices = await Notice.find(query)
            .populate('postedBy', 'name email role department')
            .sort({ createdAt: -1 });

        res.json(notices);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get archived notices
// @route   GET /api/notices/archive
// @access  Public
const getArchivedNotices = async (req, res) => {
    try {
        const notices = await Notice.find({ isArchived: true })
            .populate('postedBy', 'name email role department')
            .sort({ createdAt: -1 });

        res.json(notices);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Create a notice
// @route   POST /api/notices
// @access  Private (Admin, Department, Club)
const createNotice = async (req, res) => {
    try {
        const { title, description, category, attachment, expiryDate } = req.body;

        const notice = new Notice({
            title,
            description,
            category,
            attachment,
            expiryDate,
            postedBy: req.user._id,
        });

        const createdNotice = await notice.save();
        res.status(201).json(createdNotice);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update a notice
// @route   PUT /api/notices/:id
// @access  Private (Owner or Admin)
const updateNotice = async (req, res) => {
    try {
        const { title, description, category, attachment, expiryDate, isArchived } = req.body;

        const notice = await Notice.findById(req.params.id);

        if (notice) {
            // Check if user is owner or admin
            if (notice.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
                return res.status(403).json({ message: 'User not authorized to update this notice' });
            }

            notice.title = title || notice.title;
            notice.description = description || notice.description;
            notice.category = category || notice.category;
            notice.attachment = attachment !== undefined ? attachment : notice.attachment;
            notice.expiryDate = expiryDate !== undefined ? expiryDate : notice.expiryDate;
            if (isArchived !== undefined) notice.isArchived = isArchived;

            const updatedNotice = await notice.save();
            res.json(updatedNotice);
        } else {
            res.status(404).json({ message: 'Notice not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Delete a notice
// @route   DELETE /api/notices/:id
// @access  Private (Owner or Admin)
const deleteNotice = async (req, res) => {
    try {
        const notice = await Notice.findById(req.params.id);

        if (notice) {
            // Check if user is owner or admin
            if (notice.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
                return res.status(403).json({ message: 'User not authorized to delete this notice' });
            }

            await notice.deleteOne();
            res.json({ message: 'Notice removed' });
        } else {
            res.status(404).json({ message: 'Notice not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    getNotices,
    getArchivedNotices,
    createNotice,
    updateNotice,
    deleteNotice,
};

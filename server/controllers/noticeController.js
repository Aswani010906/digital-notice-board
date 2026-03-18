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
        const { title, description, category, expiryDate, deadline } = req.body;
        let attachment = req.body.attachment || '';

        // If a file was uploaded, set the attachment URL to the local file path
        if (req.file) {
            attachment = `/uploads/${req.file.filename}`;
        }

        const notice = new Notice({
            title,
            description,
            category,
            attachment,
            expiryDate,
            deadline,
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
// @access  Private (Owner only)
const updateNotice = async (req, res) => {
    try {
        const { title, description, category, expiryDate, deadline, isArchived } = req.body;

        const notice = await Notice.findById(req.params.id);

        if (notice) {
            // Only the creator can update their notice
            if (notice.postedBy.toString() !== req.user._id.toString()) {
                return res.status(403).json({ message: 'User not authorized to update this notice' });
            }

            let attachment = notice.attachment;
            if (req.file) {
                attachment = `/uploads/${req.file.filename}`;
            } else if (req.body.attachment !== undefined) {
                attachment = req.body.attachment;
            }

            notice.title = title || notice.title;
            notice.description = description || notice.description;
            notice.category = category || notice.category;
            notice.attachment = attachment;
            notice.expiryDate = expiryDate !== undefined ? expiryDate : notice.expiryDate;
            notice.deadline = deadline !== undefined ? deadline : notice.deadline;
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
// @access  Private (Owner only)
const deleteNotice = async (req, res) => {
    try {
        const notice = await Notice.findById(req.params.id);

        if (notice) {
            // Only the creator can delete their notice
            if (notice.postedBy.toString() !== req.user._id.toString()) {
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

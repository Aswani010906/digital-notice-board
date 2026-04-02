const Notice = require('../models/Notice');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

const canManageNotice = (notice, user) => {
    if (!notice || !user) return false;
    return user.role === 'admin' || notice.postedBy.toString() === user._id.toString();
};

const normalizeExpiryDate = (value) => {
    if (value === undefined) return undefined;
    if (!value) return null;

    const normalizedDate = new Date(value);
    if (Number.isNaN(normalizedDate.getTime())) {
        return value;
    }

    normalizedDate.setHours(23, 59, 59, 999);
    return normalizedDate;
};

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
        const normalizedExpiryDate = normalizeExpiryDate(expiryDate);

        // If a file was uploaded, set the attachment URL to the local file path
        if (req.file) {
            attachment = `/uploads/${req.file.filename}`;
        }

        const notice = new Notice({
            title,
            description,
            category,
            attachment,
            expiryDate: normalizedExpiryDate,
            deadline,
            postedBy: req.user._id,
        });

        const createdNotice = await notice.save();

        // Send email notifications to the target audience
        try {
            const query = category === 'Whole College' ? {} : { department: category };
            const users = await User.find(query).select('email');
            const emails = users.map(user => user.email).filter(email => email);

            if (emails.length > 0) {
                const mailHtml = `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
                        <h2 style="color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px;">New Notice: ${title}</h2>
                        <p><strong>Target Audience:</strong> ${category}</p>
                        ${deadline ? `<p><strong>Deadline:</strong> ${new Date(deadline).toLocaleDateString()}</p>` : ''}
                        <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #3498db; margin: 20px 0;">
                            <p style="white-space: pre-wrap;">${description}</p>
                        </div>
                        <p><em>Please log in to your dashboard to view attachments and further details.</em></p>
                    </div>
                `;

                await sendEmail({
                    subject: `New Notice: ${title}`,
                    html: mailHtml,
                    bcc: emails
                });
            }
        } catch (emailError) {
            console.error('Error sending notice emails:', emailError);
            // Continue execution to not fail the API response if email fails
        }

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
        const { title, description, category, expiryDate, deadline, isArchived } = req.body;

        const notice = await Notice.findById(req.params.id);

        if (notice) {
            if (!canManageNotice(notice, req.user)) {
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
            notice.expiryDate = expiryDate !== undefined ? normalizeExpiryDate(expiryDate) : notice.expiryDate;
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
// @access  Private (Owner or Admin)
const deleteNotice = async (req, res) => {
    try {
        const notice = await Notice.findById(req.params.id);

        if (notice) {
            if (!canManageNotice(notice, req.user)) {
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

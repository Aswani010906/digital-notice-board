const express = require('express');
const router = express.Router();
const {
    getNotices,
    getArchivedNotices,
    createNotice,
    updateNotice,
    deleteNotice,
} = require('../controllers/noticeController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.route('/')
    .get(getNotices)
    .post(protect, authorize('admin', 'department', 'club'), upload.single('image'), createNotice);

router.get('/archive', getArchivedNotices);

router.route('/:id')
    .put(protect, authorize('admin', 'department', 'club'), upload.single('image'), updateNotice)
    .delete(protect, authorize('admin', 'department', 'club'), deleteNotice);

module.exports = router;

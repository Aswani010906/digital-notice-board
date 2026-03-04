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

router.route('/')
    .get(getNotices)
    .post(protect, authorize('admin', 'department', 'club'), createNotice);

router.get('/archive', getArchivedNotices);

router.route('/:id')
    .put(protect, authorize('admin', 'department', 'club'), updateNotice)
    .delete(protect, authorize('admin', 'department', 'club'), deleteNotice);

module.exports = router;

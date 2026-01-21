const express = require('express');
const router = express.Router();
const trackController = require('../controllers/trackController');
const authMiddleware = require('../middleware/auth');

router.delete('/:id', authMiddleware, trackController.deleteTrack);

module.exports = router;

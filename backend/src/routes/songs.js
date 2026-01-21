const express = require('express');
const router = express.Router();
const songController = require('../controllers/songController');
const trackController = require('../controllers/trackController');
const materialController = require('../controllers/materialController');
const authMiddleware = require('../middleware/auth');
const { uploadTrack, uploadMaterial } = require('../middleware/upload');

router.get('/:id', songController.getSongById);
router.post('/', authMiddleware, songController.createSong);
router.put('/:id', authMiddleware, songController.updateSong);
router.delete('/:id', authMiddleware, songController.deleteSong);

router.get('/:songId/tracks', trackController.getTracksBySong);
router.post('/:songId/tracks', authMiddleware, uploadTrack.single('audio'), trackController.createTrack);

router.get('/:songId/materials', materialController.getMaterialsBySong);
router.post('/:songId/materials', authMiddleware, uploadMaterial.single('file'), materialController.createMaterial);

module.exports = router;

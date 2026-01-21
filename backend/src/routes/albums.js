const express = require('express');
const router = express.Router();
const albumController = require('../controllers/albumController');
const authMiddleware = require('../middleware/auth');
const { uploadCover } = require('../middleware/upload');

router.get('/', albumController.getAlbums);
router.get('/:id', albumController.getAlbumById);
router.post('/', authMiddleware, uploadCover.single('cover'), albumController.createAlbum);
router.put('/:id', authMiddleware, uploadCover.single('cover'), albumController.updateAlbum);
router.delete('/:id', authMiddleware, albumController.deleteAlbum);

module.exports = router;

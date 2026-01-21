const express = require('express');
const router = express.Router();
const materialController = require('../controllers/materialController');
const authMiddleware = require('../middleware/auth');

router.delete('/:id', authMiddleware, materialController.deleteMaterial);

module.exports = router;

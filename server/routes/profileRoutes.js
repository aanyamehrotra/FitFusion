const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const profileController = require('../controllers/profileController');
const upload = require('../middleware/upload');

router.get('/me', auth, profileController.getProfile);
router.put('/me', auth, profileController.updateProfile);
router.post('/me/picture', auth, upload.single('profilePicture'), profileController.uploadProfilePicture);
router.get('/trainers', auth, profileController.getTrainers);
router.get('/trainers/:id', auth, profileController.getTrainerProfile);

module.exports = router;


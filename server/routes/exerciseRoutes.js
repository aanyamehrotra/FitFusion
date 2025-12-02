const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const exerciseController = require('../controllers/exerciseController');

router.post('/', auth, exerciseController.createExercise);
router.get('/:workoutId', auth, exerciseController.getExercises);
router.put('/:id', auth, exerciseController.updateExercise);
router.delete('/:id', auth, exerciseController.deleteExercise);

module.exports = router;

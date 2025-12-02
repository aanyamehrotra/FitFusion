const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const adminController = require('../controllers/adminController');

// User routes
router.get('/users', auth, adminController.getAllUsers);
router.post('/users', auth, adminController.createUser);
router.put('/users/:id', auth, adminController.updateUser);
router.delete('/users/:id', auth, adminController.deleteUser);

// Workout routes
router.get('/workouts', auth, adminController.getAllWorkouts);
router.post('/workouts', auth, adminController.createWorkout);
router.put('/workouts/:id', auth, adminController.updateWorkout);
router.delete('/workouts/:id', auth, adminController.deleteWorkout);

// Exercise routes
router.get('/exercises', auth, adminController.getAllExercises);
router.post('/exercises', auth, adminController.createExercise);
router.put('/exercises/:id', auth, adminController.updateExercise);
router.delete('/exercises/:id', auth, adminController.deleteExercise);

module.exports = router;


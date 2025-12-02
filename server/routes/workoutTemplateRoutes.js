const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const workoutTemplateController = require('../controllers/workoutTemplateController');

router.get('/', auth, workoutTemplateController.getTemplates);
router.get('/:id', auth, workoutTemplateController.getTemplate);
router.post('/', auth, workoutTemplateController.createTemplate);
router.post('/:id/use', auth, workoutTemplateController.useTemplate);

module.exports = router;


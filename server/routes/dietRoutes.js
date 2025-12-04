const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const dietController = require('../controllers/dietController');


router.post('/', auth, dietController.createEntry);
router.get('/', auth, dietController.getEntries);
router.delete('/:id', auth, dietController.deleteEntry);

module.exports = router;



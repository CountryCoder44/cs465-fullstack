const express = require('express');
const router = express.Router();

// Controllers - each route maps to a named handler, keeping this file a clean "traffic cop"
const ctrlMain = require('../controllers/main');
const ctrlTravel = require('../controllers/travel');

/* Home page */
router.get('/', ctrlMain.index);

/* Travel page */
router.get('/travel', ctrlTravel.travel);

module.exports = router;

const express = require('express');
const router = express.Router();
const userOperations = require('../../controllers/human');

router.post('/searchHuman', userOperations.searchHuman);

module.exports = router;
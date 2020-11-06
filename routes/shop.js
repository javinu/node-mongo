const express = require('express');
const router = express.Router();
const shops = require('../controllers/shops');

router.post('/', shops.create);
router.put('/:id', shops.update);
router.get('/', shops.findAll);
router.get('/search', shops.findByQuery);
router.get('/:id', shops.findById);

module.exports = router;
const express = require('express');
const router = express.Router();
const users = require('../controllers/users');

router.post('/', users.createUser);
router.put('/:id', users.updateUser);
router.get('/', users.findUsers);
router.get('/search', users.findUsersByQuery);
router.get('/:id', users.findUserById);

module.exports = router;
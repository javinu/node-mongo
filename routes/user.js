const express = require('express');
const router = express.Router();
const user = require('../controllers/users.js');

/* GET home page. */
router.post('/', user.createUser);
router.put('/:id', user.updateUser);
router.get('/', user.findUsers);
router.get('/search', user.findUsersByQuery);
router.get('/:id', user.findUserById);

module.exports = router;
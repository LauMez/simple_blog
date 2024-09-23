const express = require('express');
const { register, 
        login, 
        getLogin,
        getRegister, 
        logout 
    } = require('../Controllers/usersController');
const router = express.Router();

router.get('/login', getLogin);
router.get('/register', getRegister);

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

module.exports = router;

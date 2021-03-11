
const express = require('express');
const router = express.Router();
const authService = require('../auth/auth.service');

router.post('/login', authenticate);     // public route
module.exports = router;

function authenticate(req, res, next) {
    authService.authenticate(req.body)
        .then(user => user ? res.json(user) : res.status(400).json({ message: 'Username or password is incorrect' }))
        .catch((error) => {
            res.status(500).json({ message: error.message })
            next(error);
        });
}
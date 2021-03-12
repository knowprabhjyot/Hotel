const express = require('express');
const router = express.Router();
const userService = require('../users/users.service');
const authorize = require('../helpers/authorize')
const Role = require('../helpers/role');

// routes
router.get('/', authorize(Role.ADMIN), getAll); // admin only
router.post('/signup', authorize(Role.ADMIN), createUser); // admin only
router.put('/reset-password', authorize(), resetPassword)
router.delete('/:id', authorize(Role.ADMIN), deleteUser);
module.exports = router;

function resetPassword(req, res, next) {
    const user = req.decoded.sub;
    const body = {
        password: req.body.password,
        newPassword: req.body.newPassword,
        user
    }
    userService.resetPassword(body)
    .then((response) => {
        if(response.data) {
            return res.status(201).json({message: response.message});
        } else {
            return res.status(400).json({ message : response.message });
        }
    })
    .catch((error) => {
        res.status(500).json({message: error.message})
        next(error);
    });
}

function getAll(req, res, next) {
    userService.getAll()
        .then(users => res.json(users))
        .catch(err => next(err));
}

function createUser(req, res, next) {
    userService.createUser(req.body)
        .then(user => user ? res.json(user) : res.status(400).json({message: 'User Already Exists'}))
        .catch(err => next(err));
}

function deleteUser(req, res, next) {
        userService.deleteUser(req.params.id)
        .then(response => response ? res.status(200).json(response) : res.status(400).json({message: 'Something Went Wrong'}))
        .catch(err => next(err));
}
const express = require('express');
const router = express.Router();
const userService = require('../users/users.service');
const authorize = require('../helpers/authorize')
const Role = require('../helpers/role');

// routes
router.post('/login', authenticate);     // public route
router.get('/', authorize(Role.ADMIN), getAll); // admin only
router.post('/signup', authorize(Role.ADMIN), createUser); // admin only
router.get('/:id', authorize(), getById);       // all authenticated users
router.delete('/:id', authorize(Role.ADMIN), deleteUser);
module.exports = router;

function authenticate(req, res, next) {
    userService.authenticate(req.body)
        .then(user => user ? res.json(user) : res.status(400).json({ message: 'Username or password is incorrect' }))
        .catch(err => next(err));
}

function getAll(req, res, next) {
    userService.getAll()
        .then(users => res.json(users))
        .catch(err => next(err));
}

function createUser(req, res, next) {
    console.log(req.body, 'REQ BODY');
    userService.createUser(req.body)
        .then(user => user ? res.json(user) : res.status(400).json({message: 'User Already Exists'}))
        .catch(err => next(err));
}

function deleteUser(req, res, next) {
        userService.deleteUser(req.params.id)
        .then(response => response ? res.status(200).json(response) : res.status(400).json({message: 'Something Went Wrong'}))
        .catch(err => next(err));
}

function getById(req, res, next) {
    const currentUser = req.user;
    const id = parseInt(req.params.id);

    // only allow admins to access other user records
    if (id !== currentUser.sub && currentUser.role !== Role.ADMIN) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    userService.getById(req.params.id)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}
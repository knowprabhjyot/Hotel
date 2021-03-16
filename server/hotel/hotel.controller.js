const express = require('express');
const router = express.Router();
const hotelService = require('./hotel.service');
const authorize = require('../helpers/authorize')
const Role = require('../helpers/role');

// routes
router.get('/', authorize(Role.ADMIN), getAll); // admin only
router.post('/', authorize(Role.ADMIN), createHotel); // admin only
router.put('/:id', authorize(Role.ADMIN), updateHotel);
router.delete('/:id', authorize(Role.ADMIN), deleteHotel);
module.exports = router;

function getAll(req, res, next) {
    hotelService.getAll()
        .then((hotels) =>  {
            if (!hotels.error) {
                res.status(200).json({message: 'Successfully Fetched Hotels', data: hotels}) 
            } else {
                res.status(400).json({message: error.message})
            }
        })
        .catch((error) => {
            res.status(500).json({message: error.message})
            next(error);
        });
}

function createHotel(req, res, next) {
    hotelService.createHotel(req.body)
        .then((hotel) => {
            if (!hotel.error) {
                return res.status(201).json({message: 'Successfully Created Hotel', data: hotel})
            } else {
                return res.status(400).json({message: hotel.error.message, error: error})
            }
        })
        .catch((error) => {
            res.status(400).json({message: error.message, error: error});
            next(error);
        });
}

function deleteHotel(req, res, next) {
    hotelService.deleteHotel(req.params.id)
        .then((response) => {
            if (!response.error) {
                res.status(200).json({message: 'Succesfully deleted Hotel', data: true})
            } else {
                res.status(400).json({ message: error.message, error: error })
            }
        })
        .catch((error) => {
            res.status(400).json({message: error.message, error: error})
            next(error);
        });
}

function updateHotel(req, res, next) {
    hotelService.updateHotel(req.body, req.params.id)
        .then((response) => {
            if (!response.error) {
                return res.status(200).json({message: 'Succesfully updated Hotel', data: true})
            } else {
                res.status(400).json({ message: error.message, error: error })
            }
        })
        .catch((error) => {
            res.status(400).json({message: error.message, error: error})
        });
}

const jwt = require('jsonwebtoken');
const Role = require('../helpers/role');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const Hotel = require('../models/hotel');

module.exports = {
    getAll,
    createHotel,
    deleteHotel,
    updateHotel
};

async function createHotel(body) {
    const hotel = new Hotel({
        name: body.name,
        address: body.address
    });

    const result = await hotel.save();
    return result;
}

async function deleteHotel(id) {
    const result = await Hotel.deleteOne({_id: id});
    return result;
}

async function updateHotel(body, id) {
    const result = await Hotel.updateOne({_id: id}, body);
    return result;
}

async function getAll() {
    const hotels = await Hotel.find({});
    return hotels;
}

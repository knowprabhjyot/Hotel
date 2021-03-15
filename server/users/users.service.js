const jwt = require('jsonwebtoken');
const Role = require('../helpers/role');
const User = require('../models/user');
const bcrypt = require('bcrypt');
// const Hotel = require('../helpers/hotel');
const Hotel = require('../models/hotel');

module.exports = {
    getAll,
    resetPassword,
    createUser,
    deleteUser
};

async function resetPassword(body) {
    const user = await User.findById({_id: body.user});
    if (user) {
        const result = await bcrypt.compare(body.password, user.password);
        if (result) {
            const hash = bcrypt.hashSync(body.newPassword, 10);
            const updatePassword = await user.update({password: hash});
            if (!updatePassword.error) {
                return {
                    data: true,
                    message: 'Password Changed Succesfully'
                }
            } else {
                return { data : false,
                         message : 'Something went wrong while updating' } 
            }
        } else {
            return {
                data: false,
                message: 'Current password is invalid for the user'
            };
        }
    } else {
        return {
            data: false,
            message: 'User not found'
        };
    }
}

async function createUser(body) {
    const hash = bcrypt.hashSync(body.password, 10);
    const hotel = await Hotel.findById({_id: body.hotel});
    const user = new User({
        email: body.email,
        name: body.name,
        password: hash,
        role: body.role,
        hotel
    });

    const user1 = await User.findOne({email: body.email});
    if (user1) {
        return null;
    }

    const result = await user.save();
    const token = jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET,  { expiresIn: "1h" });
    delete result.password;
    return {
        result,
        token
    };

}

async function deleteUser(id) {
    const result = await User.deleteOne({_id: id});
    if (result) {
        return true;
    } else {
        return null;
    }
}

async function getAll() {
    const users = await User.find({}).populate('hotel');
    return users;
}

// async function getById(id) {
//     const user = users.find(u => u.id === parseInt(id));
//     if (!user) return;
//     const { password, ...userWithoutPassword } = user;
//     return userWithoutPassword;
// }
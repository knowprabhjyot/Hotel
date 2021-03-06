const jwt = require('jsonwebtoken');
const Role = require('../helpers/role');
const User = require('../models/user');
const bcrypt = require('bcrypt');

module.exports = {
    authenticate,
    getAll,
    // getById,
    createUser,
    deleteUser
};

async function authenticate(body) {
    const user = await User.findOne({email: body.email});
    if (user) {
        const result = await bcrypt.compare(body.password, user.password);
        if (result) {
            const token = jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET,  { expiresIn: "1h" });
            return {
                user,
                token
            };
        } 
        return null;
    } 
    return null;
   
}

async function createUser(body) {
    const hash = bcrypt.hashSync(body.password, 10);
    const user = new User({
        email: body.email,
        password: hash,
        role: body.role
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
        return result;
    } else {
        return null;
    }
}

async function getAll() {
    const users = await User.find({});
    return users;
}

// async function getById(id) {
//     const user = users.find(u => u.id === parseInt(id));
//     if (!user) return;
//     const { password, ...userWithoutPassword } = user;
//     return userWithoutPassword;
// }
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const bcrypt = require('bcrypt');

module.exports = {authenticate};

async function authenticate(body) {
    const user = await User.findOne({ email: body.email });
    if (user) {
        const result = await bcrypt.compare(body.password, user.password);
        if (result) {
            const token = jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
            return {
                user,
                token
            };
        }
        return null;
    }
    return null;
}
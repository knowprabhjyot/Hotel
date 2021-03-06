const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
      const userList = await User.find({}).select('email');
      res.status(200).json({
        message: 'Sucessfully fetched users',
        userList
      })
    } catch (error) {
      res.status(500).json({
        message: error.message,
        error: error
      })
    }
  })


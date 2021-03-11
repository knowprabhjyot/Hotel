const express  = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
require('dotenv').config();
const userRoutes = require('./users/user.controller');
const paymentRoutes = require('./payments/payments.controller');
const authRoutes = require('./auth/auth.controller');

const PORT = process.env.PORT || 5000;
const validateUser = require('./auth');
var morgan = require('morgan')

app.use(express.json())
app.use(cors());

app.use(morgan('combined'))

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.connection.on('connected', () => {
    console.log('Database connected...');
})

app.use('/payments', validateUser,  paymentRoutes);
app.use('/users',validateUser, userRoutes);
app.use('/auth', authRoutes);

app.use('/', (req, res) => {
    res.send('END POINTS');
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
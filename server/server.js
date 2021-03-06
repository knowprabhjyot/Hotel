const express  = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
const paymentRoutes = require('./routes/payments');
const authRoutes = require('./routes/auth');
const userRoutes = require('./users/user.controller');
const PORT = process.env.PORT || 5000;
const validateUser = require('./auth');

app.use(express.json())
app.use(cors());


mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.connection.on('connected', () => {
    console.log('Database connected...');
})

app.use('/payments',validateUser,  paymentRoutes);
app.use('/users', userRoutes);
app.use('/auth', authRoutes);

app.use('/', (req, res) => {
    res.send('END POINTS');
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
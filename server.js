const express = require('express');
const connectDB = require('./config/db');
const passport = require('passport');
const router = require('./Auth/Routes');
const Org_router = require('./routes/api/organizations');
const User_router = require('./routes/api/users');
const cors = require('cors');
require('dotenv').config();
const app = express();
app.use(cors('*'))
// Connect Database
connectDB();

// Init Middleware
app.use(express.json());
app.use(passport.initialize());
require('./config/passport')(passport);
app.use('/api/auth', router)
app.use('/api/organisation', Org_router)
app.use('/api/user', User_router)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

const express = require('express');
const router = express.Router()
const userRoutes = require('./userRoutes');
const authRoutes = require('./authRoutes');

//User's Routes
router.use(userRoutes)

//Auth Routes
router.use(authRoutes)


module.exports = router;

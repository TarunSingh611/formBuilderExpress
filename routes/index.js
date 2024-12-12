// backend/routes/index.js  
const express = require('express');  
const router = express.Router();  

router.use('/auth', require('./auth.js'));  
router.use('/forms', require('./forms.js'));  
router.use('/uploads', require('./uploads.js'));  

module.exports = router;  


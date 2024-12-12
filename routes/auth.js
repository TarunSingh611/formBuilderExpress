// backend/routes/auth.js  
const express = require('express');  
const router = express.Router();  
const authController = require('../controllers/authController');  
const { validateRequest } = require('../middleware/validator');  
const auth = require('../middleware/auth');  
  
// Auth routes  
router.post('/register', validateRequest, authController.register);  
router.post('/login', validateRequest, authController.login);  
router.post('/refresh-token', auth, authController.refreshToken);  
router.post('/logout', auth, authController.logout);  
  
module.exports = router;  
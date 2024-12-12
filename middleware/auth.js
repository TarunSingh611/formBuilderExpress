// backend/middleware/auth.js  
const jwt = require('jsonwebtoken');  
const { createError } = require('../utils/errors');  
const User = require('../models/User');  

const auth = async (req, res, next) => {  
  try {  
    const token = req.header('Authorization')?.replace('Bearer ', '');  

    if (!token) {  
      throw createError(401, 'Authentication required');  
    }  

    const decoded = jwt.verify(token, process.env.JWT_SECRET);  
    const user = await User.findById(decoded.id);  

    if (!user) {  
      throw createError(401, 'User not found');  
    }  

    req.user = user;  
    next();  
  } catch (error) {  
    if (error.name === 'JsonWebTokenError') {  
      next(createError(401, 'Invalid token'));  
    } else {  
      next(error);  
    }  
  }  
};  

module.exports = auth;  
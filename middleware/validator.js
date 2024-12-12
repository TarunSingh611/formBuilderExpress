// backend/middleware/validator.js  
const { createError } = require('../utils/errors');  

exports.validateRequest = (req, res, next) => {  
  const { email, password } = req.body;  

  if (!email || !password) {  
    return next(createError(400, 'Email and password are required'));  
  }  

  if (!/\S+@\S+\.\S+/.test(email)) {  
    return next(createError(400, 'Invalid email format'));  
  }  

  if (password.length < 6) {  
    return next(createError(400, 'Password must be at least 6 characters'));  
  }  

  next();  
};  
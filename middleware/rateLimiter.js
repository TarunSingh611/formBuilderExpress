// middleware/rateLimiter.js  
const rateLimit = require('express-rate-limit');  

const createFormLimiter = rateLimit({  
  windowMs: 60 * 60 * 1000, // 1 hour  
  max: 50, // limit each IP to 50 form creations per hour  
  message: 'Too many forms created, please try again later'  
});  

const submitResponseLimiter = rateLimit({  
  windowMs: 15 * 60 * 1000, // 15 minutes  
  max: 100, // limit each IP to 100 submissions per 15 minutes  
  message: 'Too many responses submitted, please try again later'  
});  

const progressLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // limit each IP to 30 progress saves per minute
  message: 'Too many progress saves, please try again later'
});

module.exports = {  
  createFormLimiter, 
  progressLimiter,
  submitResponseLimiter  
};  
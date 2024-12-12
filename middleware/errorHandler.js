// backend/middleware/errorHandler.js  
const { CustomError } = require('../utils/errors');  

const errorHandler = (err, req, res, next) => {  
  console.error(err);  

  if (err instanceof CustomError) {  
    return res.status(err.statusCode).json({  
      status: 'error',  
      message: err.message  
    });  
  }  

  // MongoDB duplicate key error  
  if (err.code === 11000) {  
    return res.status(400).json({  
      status: 'error',  
      message: 'Duplicate field value entered'  
    });  
  }  

  // Mongoose validation error  
  if (err.name === 'ValidationError') {  
    const messages = Object.values(err.errors).map(val => val.message);  
    return res.status(400).json({  
      status: 'error',  
      message: messages.join(', ')  
    });  
  }  

  // Default error  
  res.status(500).json({  
    status: 'error',  
    message: 'Internal server error'  
  });  
};  

module.exports = errorHandler;  
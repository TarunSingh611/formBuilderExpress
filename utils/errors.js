// backend/utils/errors.js  
class CustomError extends Error {  
    constructor(statusCode, message) {  
      super(message);  
      this.statusCode = statusCode;  
      this.name = 'CustomError';  
    }  
  }  
    
  const createError = (statusCode, message) => {  
    return new CustomError(statusCode, message);  
  };  
    
  module.exports = {  
    CustomError,  
    createError  
  };  
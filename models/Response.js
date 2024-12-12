// backend/models/Response.js  
const mongoose = require('mongoose');  

const answerSchema = new mongoose.Schema({  
  questionId: {  
    type: mongoose.Schema.Types.ObjectId,  
    required: true  
  },  
  value: {  
    type: mongoose.Schema.Types.Mixed,  
    required: true  
  }  
});  

const responseSchema = new mongoose.Schema({  
  form: {  
    type: mongoose.Schema.Types.ObjectId,  
    ref: 'Form',  
    required: true  
  },  
  respondent: {  
    type: mongoose.Schema.Types.ObjectId,  
    ref: 'User'  
  },  
  answers: [answerSchema],  
  submittedAt: {  
    type: Date,  
    default: Date.now  
  }  
}, {  
  timestamps: true  
});  

const Response = mongoose.model('Response', responseSchema);  
module.exports = Response;  
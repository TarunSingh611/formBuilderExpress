// backend/models/Form.js  
const mongoose = require('mongoose');  
  
const questionSchema = new mongoose.Schema({  
  type: {  
    type: String,  
    required: true,  
    enum: ['Text', 'Grid', 'CheckBox', 'Radio', 'Image']  
  },  
  title: {  
    type: String,  
    required: true  
  },  
  required: {  
    type: Boolean,  
    default: false  
  },  
  options: [String], // For CheckBox, Radio, and Grid types  
  imageUrl: String,  // For Image type questions  
  rows: [String],    // For Grid type  
  columns: [String]  // For Grid type  
});  
  
const formSchema = new mongoose.Schema({  
  title: {  
    type: String,  
    required: true,  
    trim: true  
  },  
  description: {  
    type: String,  
    trim: true  
  },  
  questions: [questionSchema],  
  creator: {  
    type: mongoose.Schema.Types.ObjectId,  
    ref: 'User',  
    required: true  
  },  
  isPublished: {  
    type: Boolean,  
    default: false  
  },  
  allowAnonymous: {  
    type: Boolean,  
    default: false  
  },  
  expiresAt: Date  
}, {  
  timestamps: true  
});  
  
const Form = mongoose.model('Form', formSchema);  
module.exports = Form;  
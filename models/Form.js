// models/Form.js  
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
  description: String,  
  required: {  
    type: Boolean,  
    default: false  
  },  
  options: [String],  
  imageUrl: String,  
  rows: [String],  
  columns: [String],  
  validation: {  
    minLength: Number,  
    maxLength: Number,  
    pattern: String,  
    customError: String  
  },  
  order: {  
    type: Number,  
    default: 0  
  }  
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
  headerImage: {  
    url: String,  
    fileId: String  
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
  settings: {  
    shuffleQuestions: {  
      type: Boolean,  
      default: false  
    },  
    requireSignIn: {  
      type: Boolean,  
      default: false  
    },  
    showProgressBar: {  
      type: Boolean,  
      default: true  
    },  
    responseLimit: {  
      type: Number,  
      default: null  
    }  
  },  
  expiresAt: Date,  
  responseCount: {  
    type: Number,  
    default: 0  
  }  
}, {  
  timestamps: true  
});  
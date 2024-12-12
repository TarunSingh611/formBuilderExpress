// backend/server.js  
require('dotenv').config();  
const express = require('express');  
const mongoose = require('mongoose');  
const cors = require('cors');  
const routes = require('./routes');  
const errorHandler = require('./middleware/errorHandler');  

const app = express();  

// Middleware  
app.use(cors());  
app.use(express.json());  
app.use(express.urlencoded({ extended: true }));  

// Routes  
app.use('/api', routes);  

// Error Handler  
app.use(errorHandler);  

// Database connection  
mongoose  
  .connect(process.env.MONGODB_URI)  
  .then(() => {  
    console.log('Connected to MongoDB');  
    const PORT = process.env.PORT || 3000;  
    app.listen(PORT, () => {  
      console.log(`Server is running on port ${PORT}`);  
    });  
  })  
  .catch((err) => {  
    console.error('MongoDB connection error:', err);  
    process.exit(1);  
  });  

// Handle unhandled promise rejections  
process.on('unhandledRejection', (err) => {  
  console.error('Unhandled Promise Rejection:', err);  
  process.exit(1);  
});  
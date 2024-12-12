// server.js  
require('dotenv').config();  
const express = require('express');  
const mongoose = require('mongoose');  
const cors = require('cors');  
const helmet = require('helmet');  
const compression = require('compression');  
const mongoSanitize = require('express-mongo-sanitize');  
const routes = require('./routes');  
const errorHandler = require('./middleware/errorHandler');  

const app = express();  

// Security middleware  
app.use(helmet());  
app.use(mongoSanitize());  
app.use(compression());  

// CORS configuration  
app.use(cors());  

app.use(express.json({ limit: '10mb' }));  
app.use(express.urlencoded({ extended: true, limit: '10mb' }));  

// Routes  
app.use('/api', routes);  
app.get('/health', (req, res) => {  
      res.status(200).json({ status: 'OK', timestamp: new Date() });  
  });  

// Error Handler  
app.use(errorHandler);  

// Database connection with better options  
mongoose  
  .connect(process.env.MONGODB_URI, {  
    useNewUrlParser: true,  
    useUnifiedTopology: true,  
    serverSelectionTimeoutMS: 5000,  
    socketTimeoutMS: 45000,  
  })  
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
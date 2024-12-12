// backend/controllers/authController.js  
const User = require('../models/User');  
const jwt = require('jsonwebtoken');  
const { createError } = require('../utils/errors');  

exports.register = async (req, res, next) => {  
  try {  
    const { email, password, name } = req.body;  

    const existingUser = await User.findOne({ email });  
    if (existingUser) {  
      throw createError(400, 'Email already registered');  
    }  

    const user = new User({ email, password, name });  
    await user.save();  

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {  
      expiresIn: '7d',  
    });  

    res.status(201).json({  
      user: {  
        id: user._id,  
        email: user.email,  
        name: user.name,  
      },  
      token,  
    });  
  } catch (error) {  
    next(error);  
  }  
};  

exports.login = async (req, res, next) => {  
  try {  
    const { email, password } = req.body;  

    const user = await User.findOne({ email });  
    if (!user) {  
      throw createError(401, 'Invalid credentials');  
    }  

    const isMatch = await user.comparePassword(password);  
    if (!isMatch) {  
      throw createError(401, 'Invalid credentials');  
    }  

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {  
      expiresIn: '7d',  
    });  

    res.json({  
      user: {  
        id: user._id,  
        email: user.email,  
        name: user.name,  
      },  
      token,  
    });  
  } catch (error) {  
    next(error);  
  }  
};  

exports.refreshToken = async (req, res, next) => {  
  try {  
    const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, {  
      expiresIn: '7d',  
    });  
    res.json({ token });  
  } catch (error) {  
    next(error);  
  }  
};  

exports.logout = async (req, res, next) => {  
  try {  
    res.json({ message: 'Logged out successfully' });  
  } catch (error) {  
    next(error);  
  }  
};  
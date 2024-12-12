// backend/controllers/formController.js  
const Form = require('../models/Form');  
const Response = require('../models/Response');  
const { createError } = require('../utils/errors');  

// Create form  
exports.createForm = async (req, res, next) => {  
  try {  
    const form = new Form({  
      ...req.body,  
      creator: req.user.id,  
    });  
    await form.save();  
    res.status(201).json(form);  
  } catch (error) {  
    next(error);  
  }  
};  

// Get all forms for a user  
exports.getForms = async (req, res, next) => {  
  try {  
    const forms = await Form.find({ creator: req.user.id })  
      .sort('-createdAt')  
      .populate('creator', 'name email');  
    res.json(forms);  
  } catch (error) {  
    next(error);  
  }  
};  

// Get single form  
exports.getForm = async (req, res, next) => {  
  try {  
    const form = await Form.findById(req.params.id)  
      .populate('creator', 'name email');  

    if (!form) {  
      throw createError(404, 'Form not found');  
    }  

    res.json(form);  
  } catch (error) {  
    next(error);  
  }  
};  

// Update form  
exports.updateForm = async (req, res, next) => {  
  try {  
    const form = await Form.findOne({  
      _id: req.params.id,  
      creator: req.user.id  
    });  

    if (!form) {  
      throw createError(404, 'Form not found');  
    }  

    // Prevent updating certain fields  
    delete req.body.creator;  
    delete req.body.createdAt;  

    Object.assign(form, req.body);  
    await form.save();  

    res.json(form);  
  } catch (error) {  
    next(error);  
  }  
};  

// Delete form  
exports.deleteForm = async (req, res, next) => {  
  try {  
    const form = await Form.findOneAndDelete({  
      _id: req.params.id,  
      creator: req.user.id  
    });  

    if (!form) {  
      throw createError(404, 'Form not found');  
    }  

    // Delete all responses associated with this form  
    await Response.deleteMany({ form: req.params.id });  

    res.json({ message: 'Form deleted successfully' });  
  } catch (error) {  
    next(error);  
  }  
};  

// Submit response  
exports.submitResponse = async (req, res, next) => {  
  try {  
    const form = await Form.findById(req.params.id);  

    if (!form) {  
      throw createError(404, 'Form not found');  
    }  

    if (!form.isPublished) {  
      throw createError(400, 'This form is not accepting responses');  
    }  

    if (form.expiresAt && form.expiresAt < new Date()) {  
      throw createError(400, 'This form has expired');  
    }  

    // Validate required questions  
    const requiredQuestions = form.questions.filter(q => q.required);  
    const answeredQuestions = req.body.answers.map(a => a.questionId);  

    for (const question of requiredQuestions) {  
      if (!answeredQuestions.includes(question._id.toString())) {  
        throw createError(400, `Question "${question.title}" is required`);  
      }  
    }  

    const response = new Response({  
      form: req.params.id,  
      respondent: form.allowAnonymous ? null : req.user.id,  
      answers: req.body.answers  
    });  

    await response.save();  
    res.status(201).json(response);  
  } catch (error) {  
    next(error);  
  }  
};  

// Get form responses  
exports.getResponses = async (req, res, next) => {  
  try {  
    const form = await Form.findOne({  
      _id: req.params.id,  
      creator: req.user.id  
    });  

    if (!form) {  
      throw createError(404, 'Form not found');  
    }  

    const responses = await Response.find({ form: req.params.id })  
      .populate('respondent', 'name email')  
      .sort('-submittedAt');  

    res.json(responses);  
  } catch (error) {  
    next(error);  
  }  
};  
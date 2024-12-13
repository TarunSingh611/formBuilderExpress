// controllers/formController.js  
const Form = require('../models/Form');  
const Response = require('../models/Response');  
const { createError } = require('../utils/errors');  
  
exports.createForm = async (req, res, next) => {  
  try {  
    const { title, description, headerImage, questions, settings } = req.body;  
  
    // Validate questions  
    if (!questions || !Array.isArray(questions) || questions.length === 0) {  
      throw createError(400, 'At least one question is required');  
    }  
  
    // Validate each question  
    questions.forEach((question, index) => {  
      question.order = index;  
        
      if (!question.title) {  
        throw createError(400, 'Question title is required');  
      }  
  
      switch (question.type) {  
        case 'Grid':  
          if (!question.rows?.length || !question.columns?.length) {  
            throw createError(400, `Grid question "${question.title}" requires rows and columns`);  
          }  
          break;  
        case 'CheckBox':  
        case 'Radio':  
          if (!question.options?.length) {  
            throw createError(400, `${question.type} question "${question.title}" requires options`);  
          }  
          break;  
      }  
    });  
  
    const form = new Form({  
      title,  
      description,  
      headerImage,  
      questions,  
      creator: req.user.id,  
      settings  
    });  
  
    await form.save();  
    res.status(201).json(form);  
  } catch (error) {  
    next(error);  
  }  
};  
  
exports.submitResponse = async (req, res, next) => {
  try {
    const { formId } = req.params;
    const { responses } = req.body;
    const userId = req.user?.id;

    // Validate form exists and is published
    const form = await Form.findById(formId);
    if (!form) {
      throw createError(404, 'Form not found');
    }

    if (!form.isPublished) {
      throw createError(400, 'This form is not accepting responses');
    }

    // Validate required questions
    const missingRequired = form.questions
      .filter(q => q.required)
      .find(q => !responses[q._id]);

    if (missingRequired) {
      throw createError(400, 'Please answer all required questions');
    }

    // Create response
    const response = new Response({
      form: formId,
      respondent: userId,
      answers: Object.entries(responses).map(([questionId, value]) => ({
        questionId,
        value
      }))
    });

    await response.save();

    // Update form response count
    await Form.findByIdAndUpdate(formId, {
      $inc: { responseCount: 1 }
    });

    // Delete progress if exists
    if (userId) {
      await Progress.findOneAndDelete({
        form: formId,
        user: userId
      });
    }

    res.status(201).json({
      message: 'Response submitted successfully',
      response
    });
  } catch (error) {
    next(error);
  }
}; 
  
exports.getFormAnalytics = async (req, res, next) => {  
  try {  
    const form = await Form.findOne({  
      _id: req.params.id,  
      creator: req.user.id  
    });  
  
    if (!form) {  
      throw createError(404, 'Form not found');  
    }  
  
    const responses = await Response.find({ form: form._id });  
  
    // Calculate analytics  
    const analytics = {  
      totalResponses: responses.length,  
      questionAnalytics: {}  
    };  
  
    form.questions.forEach(question => {  
      const questionResponses = responses.map(r =>   
        r.answers.find(a => a.questionId.toString() === question._id.toString())  
      ).filter(Boolean);  
  
      analytics.questionAnalytics[question._id] = {  
        questionTitle: question.title,  
        type: question.type,  
        responseCount: questionResponses.length  
      };  
  
      if (['CheckBox', 'Radio', 'Grid'].includes(question.type)) {  
        const optionCounts = {};  
        questionResponses.forEach(response => {  
          if (Array.isArray(response.value)) {  
            response.value.forEach(val => {  
              optionCounts[val] = (optionCounts[val] || 0) + 1;  
            });  
          } else {  
            optionCounts[response.value] = (optionCounts[response.value] || 0) + 1;  
          }  
        });  
        analytics.questionAnalytics[question._id].optionCounts = optionCounts;  
      }  
    });  
  
    res.json(analytics);  
  } catch (error) {  
    next(error);  
  }  
};  

// Get all forms for the authenticated user  
exports.getForms = async (req, res, next) => {  
  try {  
    const forms = await Form.find({ creator: req.user.id })  
      .select('title description isPublished responseCount createdAt')  
      .sort({ createdAt: -1 });  

    res.json(forms);  
  } catch (error) {  
    next(error);  
  }  
};  

// Get a single form by ID  
exports.getForm = async (req, res, next) => {  
  try {  
    const form = await Form.findById(req.params.id);  

    if (!form) {  
      throw createError(404, 'Form not found');  
    }  

    // If form requires sign in and user is not authenticated  
    if (form.settings?.requireSignIn && !req.user) {  
      throw createError(401, 'Authentication required to view this form');  
    }  

    // If user is not creator, only return if form is published  
    if (!req.user || form.creator.toString() !== req.user.id) {  
      if (!form.isPublished) {  
        throw createError(404, 'Form not found');  
      }  
      // Remove sensitive data for non-creators  
      form.settings = undefined;  
    }  

    res.json(form);  
  } catch (error) {  
    next(error);  
  }  
};  

// Update a form  
exports.updateForm = async (req, res, next) => {  
  try {  
    const { title, description, headerImage, questions, settings, isPublished } = req.body;  

    const form = await Form.findOne({  
      _id: req.params.id,  
      creator: req.user.id  
    });  

    if (!form) {  
      throw createError(404, 'Form not found');  
    }  

    // Validate questions if provided  
    if (questions) {  
      if (!Array.isArray(questions) || questions.length === 0) {  
        throw createError(400, 'At least one question is required');  
      }  

      // Validate each question  
      questions.forEach((question, index) => {  
        question.order = index;  

        if (!question.title) {  
          throw createError(400, 'Question title is required');  
        }  

        switch (question.type) {  
          case 'Grid':  
            if (!question.rows?.length || !question.columns?.length) {  
              throw createError(400, `Grid question "${question.title}" requires rows and columns`);  
            }  
            break;  
          case 'CheckBox':  
          case 'Radio':  
            if (!question.options?.length) {  
              throw createError(400, `${question.type} question "${question.title}" requires options`);  
            }  
            break;  
        }  
      });  
    }  

    // Update form fields  
    Object.assign(form, {  
      title: title || form.title,  
      description: description || form.description,  
      headerImage: headerImage || form.headerImage,  
      questions: questions || form.questions,  
      settings: settings || form.settings,  
      isPublished: isPublished !== undefined ? isPublished : form.isPublished  
    });  

    await form.save();  
    res.json(form);  
  } catch (error) {  
    next(error);  
  }  
};  

// Delete a form  
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
    await Response.deleteMany({ form: form._id });  

    res.json({ message: 'Form deleted successfully' });  
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

    const responses = await Response.find({ form: form._id })  
      .populate('respondent', 'name email')  
      .sort({ submittedAt: -1 });  

    res.json(responses);  
  } catch (error) {  
    next(error);  
  }  
};

// Save progress
exports.saveProgress = async (req, res, next) => {
  try {
    const { formId } = req.params;
    const { responses } = req.body;
    const userId = req.user.id;

    // Validate form exists
    const form = await Form.findById(formId);
    if (!form) {
      throw createError(404, 'Form not found');
    }

    // Update or create progress
    const progress = await Progress.findOneAndUpdate(
      { form: formId, user: userId },
      { 
        responses,
        lastUpdated: new Date()
      },
      { 
        new: true,
        upsert: true,
        setDefaultsOnInsert: true
      }
    );

    res.json({
      message: 'Progress saved successfully',
      progress
    });
  } catch (error) {
    next(error);
  }
};

// Get saved progress
exports.getProgress = async (req, res, next) => {
  try {
    const { formId } = req.params;
    const userId = req.user.id;

    // Validate form exists
    const form = await Form.findById(formId);
    if (!form) {
      throw createError(404, 'Form not found');
    }

    // Get progress
    const progress = await Progress.findOne({
      form: formId,
      user: userId
    });

    if (!progress) {
      return res.json({
        responses: {},
        lastUpdated: null
      });
    }

    res.json({
      responses: progress.responses,
      lastUpdated: progress.lastUpdated
    });
  } catch (error) {
    next(error);
  }
};


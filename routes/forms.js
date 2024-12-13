// routes/forms.js  
const express = require('express');  
const router = express.Router();  
const formController = require('../controllers/formController');  
const auth = require('../middleware/auth');  
const { progressLimiter } = require('../middleware/rateLimiter');

router.post('/', auth, formController.createForm);  
router.get('/', auth, formController.getForms);  
router.get('/:id', formController.getForm);  
router.put('/:id', auth, formController.updateForm);  
router.delete('/:id', auth, formController.deleteForm);  
router.post('/:id/responses', auth, formController.submitResponse);  
router.get('/:id/responses', auth, formController.getResponses);  
router.get('/:id/analytics', auth, formController.getFormAnalytics);  
router.get('/:formId/progress', auth, formController.getProgress);
router.post('/:formId/progress', auth, progressLimiter, formController.saveProgress);
  
module.exports = router;  
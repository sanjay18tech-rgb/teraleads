const express = require('express');
const { body, param } = require('express-validator');
const chatController = require('../controllers/chatController');
const { authMiddleware } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validate');

const router = express.Router();

router.use(authMiddleware);

const sendMessageValidation = [
  body('patientId').isUUID().withMessage('Valid patient ID required'),
  body('message').trim().notEmpty().withMessage('Message is required'),
];

const patientIdParam = param('patientId').isUUID().withMessage('Invalid patient ID');

router.get(
  '/:patientId',
  patientIdParam,
  handleValidationErrors,
  chatController.getHistory
);
router.post('/', sendMessageValidation, handleValidationErrors, chatController.sendMessage);

module.exports = router;

const express = require('express');
const { body, param, query } = require('express-validator');
const patientController = require('../controllers/patientController');
const { authMiddleware } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validate');

const router = express.Router();

router.use(authMiddleware);

const patientValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').optional().isEmail().normalizeEmail().withMessage('Valid email required'),
  body('phone').optional().trim(),
  body('dateOfBirth')
    .optional()
    .isDate()
    .withMessage('Valid date required (YYYY-MM-DD)'),
  body('medicalNotes').optional().trim(),
];

const updatePatientValidation = [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('email').optional().isEmail().normalizeEmail().withMessage('Valid email required'),
  body('phone').optional().trim(),
  body('dateOfBirth')
    .optional()
    .isDate()
    .withMessage('Valid date required (YYYY-MM-DD)'),
  body('medicalNotes').optional().trim(),
];

const uuidParam = param('id').isUUID().withMessage('Invalid patient ID');
const paginationQuery = [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
];

router.post('/', patientValidation, handleValidationErrors, patientController.create);
router.get('/', paginationQuery, handleValidationErrors, patientController.list);
router.get('/:id', uuidParam, handleValidationErrors, patientController.getById);
router.put('/:id', uuidParam, updatePatientValidation, handleValidationErrors, patientController.update);
router.delete('/:id', uuidParam, handleValidationErrors, patientController.remove);

module.exports = router;

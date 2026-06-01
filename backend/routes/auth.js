const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const { auth } = require('../middleware/auth');

// ========== VALIDATIONS ==========
const registerValidation = [
  body('email').isEmail().withMessage('Email invalide'),
  body('fullName').notEmpty().withMessage('Nom complet requis'),
  body('phone').notEmpty().withMessage('Téléphone requis'),
  body('role').isIn(['delegate', 'pharmacist', 'delivery']).withMessage('Rôle invalide')
];

const loginValidation = [
  body('email').isEmail().withMessage('Email invalide'),
  body('password').notEmpty().withMessage('Mot de passe requis')
];

const activationValidation = [
  body('token').notEmpty().withMessage('Token requis'),
  body('password').isLength({ min: 8 }).withMessage('Le mot de passe doit contenir au moins 8 caractères'),
  body('confirmPassword').custom((value, { req }) => value === req.body.password).withMessage('Les mots de passe ne correspondent pas')
];

const codeValidation = [
  body('tempToken').notEmpty().withMessage('Token temporaire requis'),
  body('code').isLength({ min: 6, max: 6 }).withMessage('Code à 6 chiffres requis')
];

// ========== ROUTES PUBLIQUES ==========
router.post('/register', registerValidation, authController.register);
router.post('/activate', activationValidation, authController.activateAccount);
router.post('/login', loginValidation, authController.login);
router.post('/verify-code', codeValidation, authController.verifyCode);
router.post('/resend-code', authController.resendVerificationCode);

// ========== ROUTES PROTÉGÉES ==========
router.get('/me', auth, authController.getMe);
router.post('/logout', auth, authController.logout);

module.exports = router;
const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const { auth, isDelegateOrAdmin, isAdmin } = require('../middleware/auth');

// Routes protégées (nécessitent authentification)
router.use(auth);

// Routes accessibles aux délégués et admin
router.get('/', isDelegateOrAdmin, doctorController.getAllDoctors);
router.get('/stats', isDelegateOrAdmin, doctorController.getDoctorStats);
router.get('/:id', isDelegateOrAdmin, doctorController.getDoctorById);
router.post('/', isDelegateOrAdmin, doctorController.createDoctor);
router.put('/:id', isDelegateOrAdmin, doctorController.updateDoctor);

// Routes réservées à l'admin
router.delete('/:id', isAdmin, doctorController.deleteDoctor);

module.exports = router;
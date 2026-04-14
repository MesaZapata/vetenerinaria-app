const express = require('express');
const router = express.Router();
const petController = require('../controllers/petController');
const { isVeterinario } = require('../middleware/auth');

// Solo veterinarios/admin pueden ver expedientes médicos
router.get('/pets', isVeterinario, petController.listPets);
router.get('/pets/:id/history', isVeterinario, petController.getHistory);

module.exports = router;

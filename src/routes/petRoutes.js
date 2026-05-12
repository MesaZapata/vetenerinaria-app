const express = require('express');
const router = express.Router();
const petController = require('../controllers/petController');
const { isAuthenticated, isVeterinario } = require('../middleware/auth');

// Crear mascotas: cualquier usuario autenticado (recepción, vet, admin)
router.get('/pets/new', isAuthenticated, petController.getNewPetForm);
router.post('/pets/new', isAuthenticated, petController.createPet);

// Ver expedientes / historial: solo veterinario y admin
router.get('/pets', isVeterinario, petController.listPets);
router.get('/pets/:id/history', isVeterinario, petController.getHistory);

module.exports = router;

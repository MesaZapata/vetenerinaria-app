const Pet = require('../models/Pet');
const Appointment = require('../models/Appointment');

exports.listPets = (req, res) => {
    try {
        const pets = Pet.findAllWithOwner();
        res.render('pets', { title: 'Pacientes', pets });
    } catch (err) {
        res.status(500).send(err.message);
    }
};

exports.getHistory = (req, res) => {
    try {
        const petId = req.params.id;
        const pet = Pet.findById(petId);
        if (!pet) return res.status(404).send('Mascota no encontrada');
        const appointments = Appointment.findByPetId(petId);
        res.render('history', { title: `Historial — ${pet.name}`, pet, appointments });
    } catch (err) {
        res.status(500).send(err.message);
    }
};

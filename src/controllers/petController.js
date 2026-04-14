const Pet = require('../models/Pet');
const Appointment = require('../models/Appointment');

exports.listPets = (req, res) => {
    Pet.findAllWithOwner((err, pets) => {
        if (err) return res.status(500).send(err.message);
        res.render('pets', { title: 'Pacientes', pets });
    });
};

exports.getHistory = (req, res) => {
    const petId = req.params.id;
    Pet.findById(petId, (err, pet) => {
        if (err) return res.status(500).send(err.message);
        if (!pet) return res.status(404).send('Mascota no encontrada');
        Appointment.findByPetId(petId, (err, appointments) => {
            if (err) return res.status(500).send(err.message);
            res.render('history', { title: `Historial — ${pet.name}`, pet, appointments });
        });
    });
};

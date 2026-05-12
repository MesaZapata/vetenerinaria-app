const Pet = require('../models/Pet');
const Owner = require('../models/Owner');
const Appointment = require('../models/Appointment');

exports.listPets = async (req, res) => {
    try {
        const pets = await Pet.findAllWithOwner();
        res.render('pets', { title: 'Pacientes', pets });
    } catch (err) {
        res.status(500).send(err.message);
    }
};

exports.getHistory = async (req, res) => {
    try {
        const petId = req.params.id;
        const pet = await Pet.findById(petId);
        if (!pet) return res.status(404).send('Mascota no encontrada');
        const appointments = await Appointment.findByPetId(petId);
        res.render('history', { title: `Historial — ${pet.name}`, pet, appointments });
    } catch (err) {
        res.status(500).send(err.message);
    }
};

exports.getNewPetForm = async (req, res) => {
    try {
        const owners = await Owner.findAll();
        res.render('pet-create', { title: 'Nueva Mascota', owners, error: null, values: {} });
    } catch (err) {
        res.status(500).send(err.message);
    }
};

exports.createPet = async (req, res) => {
    try {
        const name = (req.body.name || '').trim();
        const owner_id = req.body.owner_id;

        if (!name || !owner_id) {
            const owners = await Owner.findAll();
            return res.status(400).render('pet-create', {
                title: 'Nueva Mascota',
                owners,
                error: 'Completá el nombre y seleccioná un dueño.',
                values: { name, owner_id }
            });
        }

        await Pet.create({ name, owner_id: Number(owner_id) });

        const canSeePetsList = req.session.user.role === 'veterinario' || req.session.user.role === 'admin';
        res.redirect(canSeePetsList ? '/pets' : '/');
    } catch (err) {
        res.status(500).send(err.message);
    }
};

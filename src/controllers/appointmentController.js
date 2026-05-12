const Appointment = require('../models/Appointment');
const Owner = require('../models/Owner');
const Pet = require('../models/Pet');

exports.getAllAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.findAllWithDetails();
        res.render('index', { title: 'Panel de Citas', appointments });
    } catch (err) {
        res.status(500).send(err.message);
    }
};

exports.getCreateForm = async (req, res) => {
    try {
        const [owners, pets] = await Promise.all([Owner.findAll(), Pet.findAll()]);
        res.render('create', { title: 'Agendar Nueva Cita', owners, pets });
    } catch (err) {
        res.status(500).send(err.message);
    }
};

exports.createAppointment = async (req, res) => {
    try {
        const { pet_id, service, appointment_date, medical_notes, diagnosis, weight, prescribed_medicine } = req.body;
        await Appointment.create({ pet_id, service, appointment_date, medical_notes, diagnosis, weight, prescribed_medicine });
        res.redirect('/');
    } catch (err) {
        res.status(500).send(err.message);
    }
};

exports.deleteAppointment = async (req, res) => {
    try {
        await Appointment.deleteById(req.params.id);
        res.redirect('/');
    } catch (err) {
        res.status(500).send(err.message);
    }
};

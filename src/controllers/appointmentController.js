const Appointment = require('../models/Appointment');
const Owner = require('../models/Owner');
const Pet = require('../models/Pet');

exports.getAllAppointments = (req, res) => {
    try {
        const appointments = Appointment.findAllWithDetails();
        res.render('index', { title: 'Panel de Citas', appointments });
    } catch (err) {
        res.status(500).send(err.message);
    }
};

exports.getCreateForm = (req, res) => {
    try {
        const owners = Owner.findAll();
        const pets = Pet.findAll();
        res.render('create', { title: 'Agendar Nueva Cita', owners, pets });
    } catch (err) {
        res.status(500).send(err.message);
    }
};

exports.createAppointment = (req, res) => {
    try {
        const { pet_id, service, appointment_date, medical_notes, diagnosis, weight, prescribed_medicine } = req.body;
        Appointment.create({ pet_id, service, appointment_date, medical_notes, diagnosis, weight, prescribed_medicine });
        res.redirect('/');
    } catch (err) {
        res.status(500).send(err.message);
    }
};

exports.deleteAppointment = (req, res) => {
    try {
        Appointment.deleteById(req.params.id);
        res.redirect('/');
    } catch (err) {
        res.status(500).send(err.message);
    }
};

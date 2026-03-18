const db = require('../config/db');

exports.getAllAppointments = (req, res) => {
    const sql = `SELECT a.*, p.name as pet_name, o.name as owner_name 
                 FROM appointments a
                 JOIN pets p ON a.pet_id = p.id
                 JOIN owners o ON p.owner_id = o.id
                 ORDER BY a.appointment_date DESC`;
    
    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).send(err.message);
        }
        res.render('index', { title: 'Panel de Citas', appointments: rows });
    });
};

exports.getCreateForm = (req, res) => {
    // Get owners and pets for dropdowns
    db.all("SELECT * FROM owners", [], (err, owners) => {
        if (err) return res.status(500).send(err.message);
        db.all("SELECT * FROM pets", [], (err, pets) => {
            if (err) return res.status(500).send(err.message);
            res.render('create', { title: 'Agendar Nueva Cita', owners, pets });
        });
    });
};

exports.createAppointment = (req, res) => {
    const { pet_id, service, appointment_date } = req.body;
    const sql = "INSERT INTO appointments (pet_id, service, appointment_date) VALUES (?, ?, ?)";
    
    db.run(sql, [pet_id, service, appointment_date], function (err) {
        if (err) {
            return res.status(500).send(err.message);
        }
        res.redirect('/');
    });
};

exports.deleteAppointment = (req, res) => {
    const id = req.params.id;
    db.run("DELETE FROM appointments WHERE id = ?", id, function (err) {
        if (err) {
            return res.status(500).send(err.message);
        }
        res.redirect('/');
    });
};
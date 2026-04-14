const db = require('../config/db');

const Appointment = {
    findAllWithDetails(callback) {
        const sql = `SELECT a.*, p.name AS pet_name, o.name AS owner_name
                     FROM appointments a
                     JOIN pets p ON a.pet_id = p.id
                     JOIN owners o ON p.owner_id = o.id
                     ORDER BY a.appointment_date DESC`;
        db.all(sql, [], callback);
    },

    create({ pet_id, service, appointment_date, medical_notes, diagnosis, weight, prescribed_medicine }, callback) {
        const sql = 'INSERT INTO appointments (pet_id, service, appointment_date, medical_notes, diagnosis, weight, prescribed_medicine) VALUES (?, ?, ?, ?, ?, ?, ?)';
        db.run(sql, [pet_id, service, appointment_date, medical_notes || '', diagnosis || '', weight || null, prescribed_medicine || ''], callback);
    },

    findByPetId(petId, callback) {
        const sql = `SELECT a.*, p.name AS pet_name, o.name AS owner_name
                     FROM appointments a
                     JOIN pets p ON a.pet_id = p.id
                     JOIN owners o ON p.owner_id = o.id
                     WHERE a.pet_id = ?
                     ORDER BY a.appointment_date ASC`;
        db.all(sql, [petId], callback);
    },

    deleteById(id, callback) {
        db.run('DELETE FROM appointments WHERE id = ?', [id], callback);
    }
};

module.exports = Appointment;

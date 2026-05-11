const db = require('../config/db');

const Appointment = {
    findAllWithDetails() {
        return db.prepare(`
            SELECT a.*, p.name AS pet_name, o.name AS owner_name
            FROM appointments a
            JOIN pets p ON a.pet_id = p.id
            JOIN owners o ON p.owner_id = o.id
            ORDER BY a.appointment_date DESC
        `).all();
    },

    create({ pet_id, service, appointment_date, medical_notes, diagnosis, weight, prescribed_medicine }) {
        return db.prepare(`
            INSERT INTO appointments (pet_id, service, appointment_date, medical_notes, diagnosis, weight, prescribed_medicine)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `).run(pet_id, service, appointment_date, medical_notes || '', diagnosis || '', weight || null, prescribed_medicine || '');
    },

    findByPetId(petId) {
        return db.prepare(`
            SELECT a.*, p.name AS pet_name, o.name AS owner_name
            FROM appointments a
            JOIN pets p ON a.pet_id = p.id
            JOIN owners o ON p.owner_id = o.id
            WHERE a.pet_id = ?
            ORDER BY a.appointment_date ASC
        `).all(petId);
    },

    deleteById(id) {
        return db.prepare('DELETE FROM appointments WHERE id = ?').run(id);
    }
};

module.exports = Appointment;

const db = require('../config/db');

const Pet = {
    findAll() {
        return db.prepare('SELECT * FROM pets').all();
    },

    findById(id) {
        return db.prepare(`
            SELECT p.*, o.name AS owner_name
            FROM pets p
            JOIN owners o ON p.owner_id = o.id
            WHERE p.id = ?
        `).get(id);
    },

    findAllWithOwner() {
        return db.prepare(`
            SELECT p.*, o.name AS owner_name
            FROM pets p
            JOIN owners o ON p.owner_id = o.id
            ORDER BY p.name ASC
        `).all();
    }
};

module.exports = Pet;

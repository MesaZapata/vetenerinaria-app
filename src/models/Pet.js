const db = require('../config/db');

const Pet = {
    findAll(callback) {
        db.all('SELECT * FROM pets', [], callback);
    },

    findById(id, callback) {
        const sql = `SELECT p.*, o.name AS owner_name
                     FROM pets p
                     JOIN owners o ON p.owner_id = o.id
                     WHERE p.id = ?`;
        db.get(sql, [id], callback);
    },

    findAllWithOwner(callback) {
        const sql = `SELECT p.*, o.name AS owner_name
                     FROM pets p
                     JOIN owners o ON p.owner_id = o.id
                     ORDER BY p.name ASC`;
        db.all(sql, [], callback);
    }
};

module.exports = Pet;

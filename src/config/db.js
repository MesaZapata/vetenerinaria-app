const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const db = new sqlite3.Database(':memory:');

// Pre-hash passwords synchronously before DB initialization
const adminHash      = bcrypt.hashSync('admin123', 10);
const vetHash        = bcrypt.hashSync('vet123', 10);
const recHash        = bcrypt.hashSync('rec123', 10);

db.serialize(() => {
    db.run(`CREATE TABLE owners (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL
    )`);

    db.run(`CREATE TABLE pets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        owner_id INTEGER,
        FOREIGN KEY (owner_id) REFERENCES owners(id)
    )`);

    db.run(`CREATE TABLE appointments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        pet_id INTEGER,
        service TEXT NOT NULL,
        appointment_date TEXT NOT NULL,
        medical_notes TEXT DEFAULT '',
        diagnosis TEXT DEFAULT '',
        weight REAL,
        prescribed_medicine TEXT DEFAULT '',
        status TEXT DEFAULT 'Scheduled',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (pet_id) REFERENCES pets(id)
    )`);

    // Sprint 3: tabla de usuarios con roles
    db.run(`CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        full_name TEXT NOT NULL,
        role TEXT NOT NULL CHECK(role IN ('admin', 'veterinario', 'recepcionista'))
    )`);

    // Datos de prueba
    db.run("INSERT INTO owners (name) VALUES ('Juan Pérez')");
    db.run("INSERT INTO owners (name) VALUES ('Maria García')");
    db.run("INSERT INTO pets (name, owner_id) VALUES ('Rex', 1)");
    db.run("INSERT INTO pets (name, owner_id) VALUES ('Luna', 2)");
    db.run("INSERT INTO appointments (pet_id, service, appointment_date, medical_notes, diagnosis, weight, prescribed_medicine) VALUES (1, 'Revisión General', '2026-02-25 10:00', 'Sin alergias conocidas', 'Paciente sano, vacunas al día', 12.5, 'Desparasitante oral cada 3 meses')");
    db.run("INSERT INTO appointments (pet_id, service, appointment_date, medical_notes, diagnosis, weight, prescribed_medicine) VALUES (2, 'Consulta Dermatológica', '2026-02-25 11:30', 'Piel sensible', 'Dermatitis leve por contacto', 8.2, 'Shampoo medicado 2 veces/semana')");
    db.run("INSERT INTO appointments (pet_id, service, appointment_date, medical_notes, diagnosis, weight, prescribed_medicine) VALUES (1, 'Vacunación', '2026-03-10 09:00', 'Refuerzo anual', 'Aplicación de refuerzo polivalente', 12.7, 'Ninguna')");
    db.run("INSERT INTO appointments (pet_id, service, appointment_date, medical_notes, diagnosis, weight, prescribed_medicine) VALUES (2, 'Control de Peso', '2026-03-15 14:00', 'Seguimiento dermatitis', 'Mejoría notable, piel sin irritación', 8.5, 'Continuar shampoo medicado 1 vez/semana')");

    // Usuarios de prueba
    db.run(`INSERT INTO users (username, password, full_name, role) VALUES ('admin', ?, 'Administrador', 'admin')`, [adminHash]);
    db.run(`INSERT INTO users (username, password, full_name, role) VALUES ('dr_garcia', ?, 'Dr. García (Vet)', 'veterinario')`, [vetHash]);
    db.run(`INSERT INTO users (username, password, full_name, role) VALUES ('recepcion', ?, 'Recepcionista', 'recepcionista')`, [recHash]);
});

module.exports = db;
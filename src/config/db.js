const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');

const db = new Database(':memory:');

const adminHash = bcrypt.hashSync('admin123', 10);
const vetHash   = bcrypt.hashSync('vet123', 10);
const recHash   = bcrypt.hashSync('rec123', 10);

db.exec(`
    CREATE TABLE owners (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL
    );

    CREATE TABLE pets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        owner_id INTEGER,
        FOREIGN KEY (owner_id) REFERENCES owners(id)
    );

    CREATE TABLE appointments (
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
    );

    CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        full_name TEXT NOT NULL,
        role TEXT NOT NULL CHECK(role IN ('admin', 'veterinario', 'recepcionista'))
    );
`);

db.prepare("INSERT INTO owners (name) VALUES (?)").run('Juan Pérez');
db.prepare("INSERT INTO owners (name) VALUES (?)").run('Maria García');
db.prepare("INSERT INTO pets (name, owner_id) VALUES (?, ?)").run('Rex', 1);
db.prepare("INSERT INTO pets (name, owner_id) VALUES (?, ?)").run('Luna', 2);

const insertAppointment = db.prepare(`
    INSERT INTO appointments (pet_id, service, appointment_date, medical_notes, diagnosis, weight, prescribed_medicine)
    VALUES (?, ?, ?, ?, ?, ?, ?)
`);
insertAppointment.run(1, 'Revisión General', '2026-02-25 10:00', 'Sin alergias conocidas', 'Paciente sano, vacunas al día', 12.5, 'Desparasitante oral cada 3 meses');
insertAppointment.run(2, 'Consulta Dermatológica', '2026-02-25 11:30', 'Piel sensible', 'Dermatitis leve por contacto', 8.2, 'Shampoo medicado 2 veces/semana');
insertAppointment.run(1, 'Vacunación', '2026-03-10 09:00', 'Refuerzo anual', 'Aplicación de refuerzo polivalente', 12.7, 'Ninguna');
insertAppointment.run(2, 'Control de Peso', '2026-03-15 14:00', 'Seguimiento dermatitis', 'Mejoría notable, piel sin irritación', 8.5, 'Continuar shampoo medicado 1 vez/semana');

const insertUser = db.prepare("INSERT INTO users (username, password, full_name, role) VALUES (?, ?, ?, ?)");
insertUser.run('admin', adminHash, 'Administrador', 'admin');
insertUser.run('dr_garcia', vetHash, 'Dr. García (Vet)', 'veterinario');
insertUser.run('recepcion', recHash, 'Recepcionista', 'recepcionista');

module.exports = db;

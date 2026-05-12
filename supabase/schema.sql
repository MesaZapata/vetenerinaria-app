-- Schema de la app veterinaria para Supabase (Postgres).
-- Correr una sola vez en Supabase Studio -> SQL Editor -> Run.
-- Credenciales de seed (passwords en texto plano):
--   admin / admin123
--   dr_garcia / vet123
--   recepcion / rec123

DROP TABLE IF EXISTS appointments CASCADE;
DROP TABLE IF EXISTS pets CASCADE;
DROP TABLE IF EXISTS owners CASCADE;
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE owners (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE pets (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    owner_id BIGINT REFERENCES owners(id) ON DELETE SET NULL
);

CREATE TABLE appointments (
    id BIGSERIAL PRIMARY KEY,
    pet_id BIGINT REFERENCES pets(id) ON DELETE CASCADE,
    service TEXT NOT NULL,
    appointment_date TEXT NOT NULL,
    medical_notes TEXT DEFAULT '',
    diagnosis TEXT DEFAULT '',
    weight NUMERIC(5,2),
    prescribed_medicine TEXT DEFAULT '',
    status TEXT DEFAULT 'Scheduled',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'veterinario', 'recepcionista'))
);

INSERT INTO owners (name) VALUES
    ('Juan Pérez'),
    ('Maria García');

INSERT INTO pets (name, owner_id) VALUES
    ('Rex', 1),
    ('Luna', 2);

INSERT INTO appointments (pet_id, service, appointment_date, medical_notes, diagnosis, weight, prescribed_medicine) VALUES
    (1, 'Revisión General',         '2026-02-25 10:00', 'Sin alergias conocidas',  'Paciente sano, vacunas al día',         12.5, 'Desparasitante oral cada 3 meses'),
    (2, 'Consulta Dermatológica',   '2026-02-25 11:30', 'Piel sensible',            'Dermatitis leve por contacto',          8.2,  'Shampoo medicado 2 veces/semana'),
    (1, 'Vacunación',               '2026-03-10 09:00', 'Refuerzo anual',           'Aplicación de refuerzo polivalente',    12.7, 'Ninguna'),
    (2, 'Control de Peso',          '2026-03-15 14:00', 'Seguimiento dermatitis',   'Mejoría notable, piel sin irritación',  8.5,  'Continuar shampoo medicado 1 vez/semana');

INSERT INTO users (username, password, full_name, role) VALUES
    ('admin',     '$2b$10$Y.Y5nKSeAX47wU1AJXpV0euaBUMMUByo1aMMyyaJMX9br5xjR20Ri', 'Administrador',     'admin'),
    ('dr_garcia', '$2b$10$n.iEuPPEOBRruEksr.YRGent4Z3KUrO5ioCUf6vLod6GorMLcXzRC', 'Dr. García (Vet)',  'veterinario'),
    ('recepcion', '$2b$10$425NcbqvC/Sl4gGrrMmakOn0SKpDlIrBcWnLCpS6emvY0PV9EzLru', 'Recepcionista',     'recepcionista');

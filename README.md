## Local

1. Tener Node.js LTS (20.x).
2. `npm install`
3. `npm start` → http://localhost:3000

## Despliegue en Netlify (CI/CD)

El repo ya está conectado a Netlify. Cada push a `main` dispara un deploy automático.

### Configuración en el dashboard de Netlify

Project configuration → Build & deploy → Environment variables, agregar:

| Variable | Valor | Notas |
|---|---|---|
| `SESSION_SECRET` | string aleatorio largo | Firma las cookies de sesión. Generar con `openssl rand -hex 32` |

El resto (build command, publish dir, functions dir) viene de `netlify.toml`, no hace falta tocar nada en la UI.

### Cómo funciona el despliegue

- `netlify.toml` declara la config (build, redirects, functions).
- `netlify/functions/server.js` envuelve la app Express con `serverless-http` y la expone como Netlify Function.
- Todo el tráfico HTTP se redirige (rewrite) a la function via `/*` → `/.netlify/functions/server/:splat`.
- La base de datos es **SQLite en memoria**: se reinicia con cada cold start de la function. Los datos seed (usuarios admin/vet/recepción, mascotas, citas) siempre están disponibles.

### Credenciales de prueba

- `admin` / `admin123` (rol: admin)
- `dr_garcia` / `vet123` (rol: veterinario)
- `recepcion` / `rec123` (rol: recepcionista)

### Si querés persistencia real

Migrar `src/config/db.js` a Turso (LibSQL) o Postgres (Neon/Supabase). El resto del código no cambia: los models ya usan prepared statements con API sync, compatible con `@libsql/client`.

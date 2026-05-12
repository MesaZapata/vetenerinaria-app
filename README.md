## Local

1. Tener Node.js LTS (20.x).
2. `npm install`
3. Crear archivo `.env` en la raíz con:
   ```
   SUPABASE_URL=https://<tu-project-ref>.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=<tu-service-role-key>
   SESSION_SECRET=<string aleatorio largo>
   ```
4. Correr el schema en Supabase: pegá `supabase/schema.sql` en **Supabase Studio → SQL Editor → Run** (una sola vez).
5. `npm start` → http://localhost:3000

## Despliegue en Netlify (CI/CD)

El repo ya está conectado a Netlify. Cada push a `main` dispara un deploy automático.

### Configuración en el dashboard de Netlify

Project configuration → Build & deploy → Environment variables, agregar:

| Variable | Valor | Notas |
|---|---|---|
| `SUPABASE_URL` | `https://<project-ref>.supabase.co` | URL del proyecto Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | service_role key (no la anon) | Project Settings → API → service_role. **Es secreta** |
| `SESSION_SECRET` | string aleatorio largo | Firma las cookies. Generar con `openssl rand -hex 32` |

El resto (build command, publish dir, functions dir) viene de `netlify.toml`, no hace falta tocar nada en la UI.

### Cómo funciona el despliegue

- `netlify.toml` declara la config (build, redirects, functions).
- `netlify/functions/server.js` envuelve la app Express con `serverless-http` y la expone como Netlify Function.
- Todo el tráfico HTTP se redirige (rewrite) a la function via `/*` → `/.netlify/functions/server/:splat`.
- La base de datos es **Supabase (Postgres)**. La app habla con Supabase vía `@supabase/supabase-js` (PostgREST), usando la **service_role key** server-side. Los datos persisten entre invocaciones.

### Credenciales de prueba

- `admin` / `admin123` (rol: admin)
- `dr_garcia` / `vet123` (rol: veterinario)
- `recepcion` / `rec123` (rol: recepcionista)

> **Importante:** la `service_role` key tiene permisos totales sobre la DB y bypassea RLS. Nunca la metas en frontend ni la commitees. Vive solo en el `.env` local (ignorado por git) y en las variables de entorno de Netlify.

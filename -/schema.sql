-- ─── Ejecutar en Supabase → SQL Editor ───────────────────────────────────────

-- 1. Tabla de proyectos
create table if not exists projects (
  id          uuid        primary key default gen_random_uuid(),
  title       text        not null,
  client      text        not null,
  industry    text        not null,
  description text        not null,
  tags        text[]      default '{}',
  year        int         default extract(year from now())::int,
  image_url   text,
  live_url    text,
  published   boolean     default true,
  created_at  timestamptz default now()
);

-- 2. Row Level Security (RLS)
alter table projects enable row level security;

-- Cualquier visitante puede leer proyectos publicados
create policy "Lectura pública"
  on projects for select
  using (published = true);

-- Solo usuarios autenticados (admins) pueden insertar / editar / borrar
create policy "Admin: insertar"
  on projects for insert
  to authenticated
  with check (true);

create policy "Admin: actualizar"
  on projects for update
  to authenticated
  using (true);

create policy "Admin: borrar"
  on projects for delete
  to authenticated
  using (true);

-- Admin también puede leer proyectos ocultos (published = false)
create policy "Admin: leer todos"
  on projects for select
  to authenticated
  using (true);

-- ─── Instrucciones ────────────────────────────────────────────────────────────
-- Después de correr este SQL:
--
-- 1. Ir a Supabase → Authentication → Users → "Invite user"
--    y crear el usuario admin con tu email y contraseña.
--
-- 2. Copiar .env.example como .env y completar con los valores de
--    Project Settings → API (Project URL + anon public key).
--
-- 3. Agregar .env al .gitignore para no subir las keys al repo.

# Proyecto PBT-ULTRA v2.0-FINAL

Generado automáticamente con enforcement duro.

## Para el Agente AI

**ORDEN DE LECTURA:**

1. `.claude/AGENT_INSTRUCTIONS.md` ← Protocolo completo
2. `.claude/SLICES_PLAN.json` ← Plan de 69 slices  
3. `PRD_EXHAUSTIVO.md` ← Especificación

## Protocolo (7 pasos)

```bash
npm run next      # 1. Genera packet
                  # 2. Leer packet
                  # 3. Crear test
npm run red       # 4. Verifica RED
                  # 5. Implementar
npm run green     # 6. Verifica GREEN
npm run complete N # 7. Completar
```

## Enforcement Duro

- ✅ RED previo obligatorio
- ✅ GREEN posterior obligatorio
- ✅ Line limit <200
- ✅ PRD inmutable
- ✅ Packets inmutables

## Supabase (producción persistente)

### Variables de entorno

Configura en local (`.env.local`) y en Vercel:

```bash
SUPABASE_URL=https://TU-PROYECTO.supabase.co
SUPABASE_ANON_KEY=TU_SUPABASE_ANON_KEY
```

Opcional recomendado para mayor seguridad en writes de servidor:

```bash
SUPABASE_SERVICE_ROLE_KEY=TU_SUPABASE_SERVICE_ROLE_KEY
```

### SQL para crear tablas

Ejecuta esto en Supabase SQL Editor:

```sql
create extension if not exists pgcrypto;

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  company text not null,
  phone text not null,
  source text not null default '/',
  created_at timestamptz not null default now()
);

create table if not exists public.site_config (
  id int primary key default 1 check (id = 1),
  header_code text not null default '',
  footer_code text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into public.site_config (id, header_code, footer_code)
values (1, '', '')
on conflict (id) do nothing;
```

### RLS / políticas mínimas

Si vas a usar solo `SUPABASE_ANON_KEY`, necesitas permitir operaciones con políticas:

```sql
alter table public.leads enable row level security;
alter table public.site_config enable row level security;

create policy "public can read leads" on public.leads
for select to anon using (true);

create policy "public can insert leads" on public.leads
for insert to anon with check (true);

create policy "public can read site_config" on public.site_config
for select to anon using (true);

create policy "public can upsert site_config" on public.site_config
for insert to anon with check (id = 1);

create policy "public can update site_config" on public.site_config
for update to anon using (id = 1) with check (id = 1);
```

Si defines `SUPABASE_SERVICE_ROLE_KEY` en servidor, puedes mantener políticas más estrictas.

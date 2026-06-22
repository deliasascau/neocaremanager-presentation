# Neocare Manager

Neocare Manager este o aplicație Next.js pentru gestionarea pacienților nou-născuți, incubatoarelor, internărilor, alertelor medicale și aprobării utilizatorilor pe roluri.

## Stack

- Next.js 16 / React 19
- Prisma ORM
- PostgreSQL, configurat prin `DATABASE_URL`
- Autentificare cu JWT în cookie HTTP-only
- Criptare AES-256-GCM pentru datele personale ale pacienților

## Setup local

1. Instalează dependențele:

```bash
npm install
```

2. Creează `.env` pornind de la `.env.example` și completează conexiunile PostgreSQL:

```bash
cp .env.example .env
```

3. Aplică migrațiile și populează datele demo:

```bash
npm run db:migrate
npm run db:seed
```

4. Pornește aplicația:

```bash
npm run dev
```

Aplicația va fi disponibilă la `http://localhost:3000`.

## Conturi demo după seed

- Admin: `admin@neocare.ro` / `admin123`
- Doctor: `maria.popescu@neocare.ro` / `doctor123`
- Asistent: `elena.dumitrescu@neocare.ro` / `assistant123`
- Mamă: `ana.lucas@email.com` / `mother123`

## Scripturi utile

- `npm run dev` - pornește serverul de dezvoltare
- `npm run build` - generează Prisma Client și verifică build-ul de producție
- `npm run lint` - rulează ESLint
- `npm run db:migrate` - aplică migrațiile Prisma
- `npm run db:seed` - creează datasetul demo
- `npm run db:studio` - deschide Prisma Studio

# Pet Shop API

A REST API for managing a pet shop's tutors (owners) and their pets, built with [NestJS](https://nestjs.com/).

## About this project

This is a personal side-project built to prepare for a NestJS project starting at my company — since I was new to the framework, I wanted hands-on practice with its module/provider/DI model, TypeORM integration, and testing conventions before using it professionally.

Along the way I also used it to pick up **Nodemailer/SMTP email sending** (a `@nestjs-modules/mailer` integration that sends welcome/farewell emails on tutor registration and deletion, using [MailDev](https://github.com/maildev/maildev) to inspect outgoing mail locally without a real mail server), and to sharpen general backend skills I'd used before: Docker Compose for local infra, database migrations, DTO validation, and a layered unit/integration/e2e test suite.

## Tech stack

- **[NestJS](https://nestjs.com/)** (v11) — application framework
- **TypeORM** + **PostgreSQL** — persistence
- **@nestjs-modules/mailer** + **Nodemailer** — transactional email
- **MailDev** — local SMTP catcher for development
- **class-validator** / **class-transformer** — DTO validation
- **Jest** + **Supertest** — unit, integration and e2e testing
- **Docker Compose** — local app, database and mail services

## Project structure

```
src/
├── app/            # root module
├── db/             # TypeORM config, entities and migrations
├── dtos/           # shared DTOs (pet, tutor)
├── pet/            # pet module (controller, service)
└── tutor/          # tutor module (controller, service, email notifications)

test/
├── unit/           # per-service/controller unit tests (mocked repositories & mailer)
├── integration/    # cross-module tests (pet <-> tutor)
└── app.e2e-spec.ts # end-to-end HTTP tests
```

## Features

- CRUD for **tutors** (`/tutors`) and **pets** (`/pets`), with pets belonging to a tutor (`ManyToOne`/`OneToMany`, cascade delete)
- DTO validation on input
- Welcome email sent when a tutor is created, and a farewell email sent when a tutor is deleted
- TypeORM migrations for schema management
- Unit tests for services/controllers, integration tests for module interaction, and e2e tests for the HTTP layer

## API endpoints

| Method | Route         | Description          |
| ------ | ------------- | --------------------- |
| POST   | `/tutors`     | Create a tutor         |
| GET    | `/tutors`     | List tutors             |
| GET    | `/tutors/:id` | Get a tutor by id       |
| PATCH  | `/tutors/:id` | Update a tutor          |
| DELETE | `/tutors/:id` | Delete a tutor          |
| POST   | `/pets`       | Create a pet            |
| GET    | `/pets`       | List pets                |
| GET    | `/pets/:id`   | Get a pet by id          |
| PATCH  | `/pets/:id`   | Update a pet             |
| DELETE | `/pets/:id`   | Delete a pet             |

## Getting started

### 1. Environment variables

Create a `.env` file in the project root (see `.env.example`):

```env
# Postgres
POSTGRES_HOST=db
POSTGRES_USER=docker
POSTGRES_PASSWORD=docker
POSTGRES_DB=petshop

# Mail (MailDev in local dev)
MAIL_HOST=maildev
MAIL_PORT=1025
MAIL_SECURE=false
MAIL_USER=
MAIL_PASS=
MAIL_FROM="'Dev' <noreply@maildev>"
```

### 2. Start infrastructure (Postgres + MailDev + app)

```bash
$ npm run services:up
```

This brings up:

- **Postgres** on `localhost:5432`
- **MailDev** on `localhost:1080` (web UI to view sent emails) / `1025` (SMTP)
- The **app** on `localhost:3000`, running via `npm run start:dev` inside the container

Stop everything with:

```bash
$ npm run services:down
```

### 3. Install dependencies (for local, non-Docker development)

```bash
$ npm install
```

### 4. Run database migrations

```bash
$ npm run migration:run
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev
```

## Running tests

```bash
# unit tests
$ npm run test

# integration + unit, with coverage
$ npm run test:cov
```

## Migrations

```bash
# generate a migration from entity changes
$ npm run migration:generate --name=my-migration

# create an empty migration
$ npm run migration:create --name=my-migration

# apply pending migrations
$ npm run migration:run

# revert the last migration
$ npm run migration:revert
```

## License

This project is unlicensed and intended for personal learning purposes.

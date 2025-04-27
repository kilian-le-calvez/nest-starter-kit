# 📚 Nest Starter Kit API – NestJS + PostgreSQL + Prisma

Welcome to **Nest Starter Kit API**, a modular and scalable backend starter built with **NestJS**, **PostgreSQL**, and **Prisma**.
This project is designed with clean architecture, authentication ready out of the box, and full testing coverage to kickstart any web or mobile application backend.

---

## 🚀 Quick Start

### 1. Clone the project

```bash
git clone git@github.com:kilian-le-calvez/nest-starter-kit.git
cd nest-starter-kit
```

### 2. Install dependencies

```bash
cd api/
npm install
```

### 3. Configure environment variables

Create a `.env` file at the root of the api folder:

```plaintext
DATABASE_URL="postgresql://dev:devpass@localhost:5432/nest_starter_kit_db?schema=public"
JWT_SECRET="your_jwt_secret_here"
```

### 4. Start PostgreSQL database (Docker)

```bash
cd database/
docker-compose up -d
```

> Make sure Docker is running on your machine.

### 5. Generate Prisma client & run migrations

```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 6. Run the application

```bash
npm run start:dev
```

Access Swagger API docs at: [http://localhost:3000/api/swagger](http://localhost:3000/api/swagger)

---

## 📖 Full Documentation

### ⚙️ Tech Stack

- **[NestJS](https://nestjs.com/)** — API server framework
- **[PostgreSQL](https://www.postgresql.org/)** — Database (Dockerized)
- **[Prisma ORM](https://www.prisma.io/)** — Database client
- **[@nestjs/config](https://docs.nestjs.com/techniques/configuration)** — Environment management
- **[Swagger](https://swagger.io/)** — API Documentation

---

### 🛠️ Project API Structure

```plaintext
src/
├── app/        # App module
├── auth/        # Authentication module (register, login)
├── user/       # User module (user management)
├── common/      # Shared decorators, guards, interceptors
├── prisma/      # PrismaService to access the database
├── main.ts
.env
prisma/
└── schema.prisma
```

---

### 🔐 Authentication Flow

- **Registration** (`POST /auth/register`): Creates a new user with a hashed password.
- **Login** (`POST /auth/login`): Returns a signed **JWT** token / Send in response header cookie.
- **Protected Routes**: Authenticated using `Authorization: Bearer <token>`.
- **JWT Payload**: Includes `sub` (user ID) and `email`.
- **Tokens**: Configurable via `.env` (`JWT_SECRET`).

---

### 📜 Environment Variables (.env)

| Variable       | Example Value                                                      | Description                        |
| -------------- | ------------------------------------------------------------------ | ---------------------------------- |
| DATABASE_URL   | `postgresql://dev:devpass@localhost:5432/Nest Starter Kit_db?schema=public` | PostgreSQL connection string       |
| JWT_SECRET     | `your_secret_here`                                                 | Secret key for signing JWTs        |
---

### 🧪 Testing

- **Unit Tests**:
  - Controllers and Services are fully tested using Jest.
  - Mocked PrismaService and Custom Decorators.
- **E2E Tests**:
  - User registration, login, and protected route flows tested.
  - JWT tokens passed via `Authorization` headers.
  - Automatic test data cleanup between test runs.

Run tests:

```bash
npm run test
npm run test:e2e
```

---

### 🐳 Docker Database Setup

The database runs in a Docker container, isolated from the host system.

```bash
docker-compose up -d
```

**Docker Compose service:**

```yaml
services:
  db:
    image: postgres:16
    container_name: nest_starter_kit_db
    restart: always
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: dev
      POSTGRES_PASSWORD: devpass
      POSTGRES_DB: nest_starter_kit_db
    volumes:
      - postgres_data:/var/lib/postgresql/data
volumes:
  postgres_data:
```

---

### ✨ Key Features

- ⚡ Fast backend setup with NestJS
- 🔒 JWT authentication ready
- 🧹 Environment-specific configs using `.env`
- 🛡️ Modular and clean architecture
- 🧪 Full Unit + E2E testing support
- 📄 Swagger UI for API exploration

---

## 📣 Contributing

Contributions are welcome! Feel free to submit issues, fork the repo and create pull requests.
Please make sure to follow the existing code style and add necessary tests.

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).

---

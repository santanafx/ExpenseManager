# Project Documentation — DDD + Clean Architecture (English)

This document describes the architecture, design choices, modeling steps, patterns, technologies, and recommended backend skills for the ExpenseManager project. It is written for developers, reviewers, and recruiters who want a concise but complete understanding of the project organization and the engineering choices behind it.

**Audience**: backend developers, architects, technical recruiters.

**Scope**: high-level system overview, folder responsibilities, Domain-Driven Design (DDD) concepts used, Clean Architecture and SOLID application, data modeling steps (including bounded contexts), design patterns and dependency injection, technologies adopted, and a recruiter-focused "skills" checklist.

**Note**: This file is a translated and expanded English version of the original project notes describing the `user` domain and general architecture.

**System Overview**

- **Name**: ExpenseManager
- **Purpose**: Manage users, expenses and categories; provide secure APIs for creating, updating and querying expense records with role-based access control.
- **Primary domains**: `user` and `expense` (each implemented as a bounded context).

**High-level features**

- User registration, login, role management (ADMIN, BASIC_USER).
- Create / update / delete / list expenses and categories.
- Authorization and RBAC (role-based access control).
- Input validation and structured error handling.

**Repository structure (short)**

```
src/
  domain/
    common/
      entity.ts
    user/
      entities/user.ts
      enums/role.ts
      repositories/iUserRepository.ts
    expense/
      entities/
        expense.ts
        category.ts
      enums/status.ts
      repositories/
        iExpenseRepository.ts
        iCategoryRepository.ts
  application/
    user/
      input-models/
      view-models/
      use-case/
    expense/
      ...
  infrastructure/
    persistence/
      db-context/
      prisma/
      repositories/
    services/
      jwtService.ts
  presentation/
    controllers/
    middlewares/
    routes/
    validators/
```

**Layer responsibilities (Clean Architecture mapping)**

- **Domain**: Entities, value objects, domain enums, repository interfaces (pure business rules — no framework or I/O).
- **Application**: Use cases (input and output models), orchestration of domain logic, no direct DB or framework code.
- **Infrastructure**: Implementations of repository interfaces (Prisma), external services (JWT, bcrypt wrappers), DB context, migration & seed scripts.
- **Presentation**: HTTP controllers, route definitions, request validation (Zod), middlewares (auth, role checks, error handling).

**Typical request flow**

1. Client -> Controller (HTTP/Express route)
2. Controller validates input with Zod (Input Model)
3. Controller calls an Application Use Case
4. Use Case coordinates domain objects, calls repository interface methods
5. Infrastructure repository implements persistence (Prisma)
6. Use Case returns a View Model (DTO) which the controller sends as response

**Domain-Driven Design (DDD) — concepts applied**

- **Bounded Contexts**: The project separates `user` and `expense` contexts. Each context has its own domain models, repositories and use-cases so changes in one context do not leak into another.
- **Entities**: `User`, `Expense`, `Category` are entities (have identity and lifecycle).
- **Value Objects / Enums**: `Role` and `Status` are modeled as enums/value objects to capture domain invariants.
- **Repository Pattern**: Domain layer defines interfaces (e.g., `IUserRepository`) so application code depends on abstractions, not implementations.
- **Ubiquitous Language**: names like User, Expense, Category, UseCase etc. are used consistently across layers.

How to define Bounded Contexts (applied steps)

1. Identify cohesive sub-domains: authentication & user management vs expense tracking.
2. For each context, list core aggregates and entities.
3. Define clear boundaries and integration points (API contracts, events, or shared DTOs).
4. Keep domain logic inside its context; use adapters to translate when crossing boundaries.

Example contexts in this project

- `user` context: user registration, authentication, role management.
- `expense` context: categories, expenses, status transitions, reporting.

**Data modeling steps used for the database**

1. Start from domain model: identify entities and relationships (User 1:N Expense, Expense N:1 Category).
2. Choose identity strategy: UUIDs for public-facing IDs (stable across systems), auto-generated internally as needed.
3. Normalize entities to avoid redundant data and capture invariant rules in the domain layer.
4. Map enums to DB enum types (Prisma enums or small lookup tables when needed).
5. Add timestamps and audit fields (`created_at`, `updated_at`, `deleted_at` if soft deletes needed).
6. Define indexes for fields often used in queries (e.g., `user.email`, `expense.created_at`, FK columns).
7. Implement DB schema in Prisma (models + enums) and create migration files.
8. Create seed scripts for initial data (roles, admin user, default categories).
9. Run migration and seed in development: `npx prisma migrate dev` + `node prisma/seed.js`.

Example Prisma model (illustrative)

```prisma
model User {
  id          String   @id @default(uuid())
  name        String
  email       String   @unique
  passwordHash String
  role        Role     @default(BASIC_USER)
  createdAt   DateTime @default(now())
  expenses    Expense[]
}

model Category {
  id        String   @id @default(uuid())
  name      String
  expenses  Expense[]
}

model Expense {
  id          String   @id @default(uuid())
  amount      Float
  description String?
  status      Status   @default(PENDING)
  categoryId  String
  category    Category @relation(fields: [categoryId], references: [id])
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  createdAt   DateTime @default(now())
}

enum Role { ADMIN BASIC_USER }
enum Status { PENDING APPROVED REJECTED }
```

**Design Patterns & architectural patterns used**

- **Repository**: decouples domain from persistence. Domain and application layers depend on repository interfaces.
- **Factory**: `makeXxxUseCase` factory functions wire repositories and services into use case instances (used as a simple DI container).
- **Adapter / Mapper**: map between Prisma models and domain entities or view models.
- **DTO / Input-Model / View-Model**: separate transport models from domain models.
- **Middleware pattern**: auth, role checks and error handling implemented as Express middlewares.
- **Singleton (DB client)**: a single Prisma Client instance shared across repositories via the DB context.

Dependency Injection (DI)

- The project uses simple DI through factory functions. Instead of instantiating dependencies inside classes, dependencies (repositories, services) are passed into use cases or constructors.
- Example factory (simplified):

```ts
// src/application/user/factories/makeCreateUserUseCase.ts
import { PrismaUserRepository } from "../../../infrastructure/persistence/user/UserRepository";
import { BcryptService } from "../../../infrastructure/services/bcryptService";
import { CreateUserUseCase } from "../use-case/CreateUserUseCase";

export function makeCreateUserUseCase() {
  const userRepo = new PrismaUserRepository();
  const hasher = new BcryptService(10);
  return new CreateUserUseCase(userRepo, hasher);
}
```

- This style keeps constructors pure and makes unit testing straightforward by allowing mocks to be injected.

**SOLID principles — how they map to the codebase**

- **Single Responsibility**: controllers handle HTTP concerns; use cases orchestrate domain logic; repositories handle persistence.
- **Open/Closed**: new features implement new Use Cases or new repository implementations without modifying domain logic.
- **Liskov Substitution**: repository implementations conform to repository interfaces allowing substitution in tests.
- **Interface Segregation**: small, focused repository interfaces (no fat interfaces).
- **Dependency Inversion**: high-level modules depend on abstractions (repository interfaces) not concrete implementations.

**Validation & Security**

- Input validation with Zod to enforce DTO shapes and throw early on invalid input.
- Password hashing with bcrypt (salt rounds: 10) — password hashes are stored and never returned by APIs.
- Authentication with JWT tokens (short expiration for access tokens), JWT service isolated behind an interface.
- Authorization with role middleware (ADMIN vs BASIC_USER checks).
- Centralized error handling middleware converts domain errors to HTTP responses.

**Technologies adopted**

- **Language**: TypeScript (static types, better DX and safer refactorings)
- **Runtime**: Node.js
- **HTTP framework**: Express
- **ORM / DB client**: Prisma (PostgreSQL in production)
- **DB**: PostgreSQL (Docker Compose for local dev)
- **Validation**: Zod
- **Auth**: jsonwebtoken (JWT), custom JWT service wrapper
- **Password hashing**: bcrypt
- **Unique IDs**: UUIDs (via `uuid` package)
- **Linting / Formatting**: ESLint + Prettier
- **Testing**: Jest or Vitest + Supertest for integration tests (recommended)
- **Container**: Docker / docker-compose (development database)

**Developer workflow (quick commands)**

```bash
npm install
npx prisma migrate dev --name init
npm run dev
```

**Next steps & recommended improvements**

1. Add more use cases: `GetUserById`, `UpdateUser`, `DeleteUser`, `ListUsers`, `ExportExpenses`.
2. Add end-to-end tests for critical user and expense flows.
3. Add automated migration & seed steps in CI for development environments.
4. Implement rate limiting and request throttling for public endpoints.
5. Consider CQRS for complex reporting endpoints if query load grows much larger than write load.

**References and further reading**

- Patterns: Repository, Factory, Adapter, Dependency Injection, DTO
- Architecture: "Clean Architecture" by Robert C. Martin, "Domain-Driven Design" by Eric Evans
- Tools: Prisma docs, Zod docs, Express docs

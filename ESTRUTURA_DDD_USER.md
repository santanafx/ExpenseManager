# Estrutura DDD + Clean Architecture - User

Este documento explica a estrutura implementada para o cadastro de usuários seguindo os princípios de DDD (Domain-Driven Design) e Clean Architecture.

## 📁 Estrutura Criada

```
src/
├── domain/user/                              # Camada de Domínio
│   ├── entities/
│   │   └── user.ts                          # Entidade User com regras de negócio
│   ├── enums/
│   │   └── role.ts                          # Enum ROLE (ADMIN, BASIC_USER)
│   └── repositories/
│       └── IUserRepository.ts               # Interface do repositório (contrato)
│
├── application/user/                         # Camada de Aplicação (Use Cases)
│   ├── input-models/
│   │   └── CreateUserInputModel.ts          # DTO de entrada
│   ├── view-models/
│   │   └── UserViewModel.ts                 # DTO de saída (sem dados sensíveis)
│   └── use-case/
│       └── CreateUserUseCase.ts             # Lógica de criação de usuário
│
├── infrastructure/persistence/user/          # Camada de Infraestrutura
│   └── UserRepository.ts                    # Implementação do repositório com Prisma
│
└── api/controllers/                          # Camada de Apresentação
    └── user-controller.ts                   # Rotas HTTP e validação
```

## 🔄 Fluxo de Dados

1. **Controller** recebe requisição HTTP
2. **Validação** com Zod garante dados corretos
3. **Use Case** implementa lógica de negócio
4. **Repository** persiste dados no banco via Prisma
5. **View Model** retorna resposta sem dados sensíveis

## 📝 Arquivos Criados

### 1. Domain Layer

#### `IUserRepository.ts` - Interface do Repositório

Define o contrato que a implementação deve seguir:

- `create()` - Criar usuário
- `findById()` - Buscar por ID
- `findByEmail()` - Buscar por email
- `update()` - Atualizar usuário
- `delete()` - Deletar usuário
- `findAll()` - Listar todos

### 2. Application Layer

#### `CreateUserInputModel.ts` - Input Model

DTO que recebe dados para criar usuário:

- name
- email
- password (plain text - será hasheado)
- role (opcional, default: BASIC_USER)

#### `UserViewModel.ts` - View Model

DTO de retorno sem dados sensíveis:

- id
- name
- email
- role
- created_at

#### `CreateUserUseCase.ts` - Use Case

Implementa a lógica de negócio:

- ✅ Valida se email já existe
- 🔐 Hash de senha com bcrypt
- 🆔 Gera UUID para id
- 💾 Persiste no banco via repository
- 📤 Retorna UserViewModel

### 3. Infrastructure Layer

#### `UserRepository.ts` - Implementação do Repositório

- Implementa `IUserRepository`
- Usa Prisma Client para persistência
- Mapeia entre entidade de domínio e modelo do Prisma
- Converte enums entre camadas

### 4. API Layer

#### `user-controller.ts` - Controller

- Define rota `POST /api/users`
- Validação de entrada com Zod
- Tratamento de erros
- Retorna status HTTP apropriados

## 🧪 Como Testar

### 1. Executar as migrations do Prisma

\`\`\`bash
npx prisma migrate dev
\`\`\`

### 2. Iniciar o servidor

\`\`\`bash
npm run dev
\`\`\`

### 3. Criar um usuário

**Requisição:**
\`\`\`bash
curl -X POST http://localhost:3333/api/users \\
-H "Content-Type: application/json" \\
-d '{
"name": "João Silva",
"email": "joao@example.com",
"password": "senha123",
"role": "BASIC_USER"
}'
\`\`\`

**Resposta Esperada (201):**
\`\`\`json
{
"id": "uuid-gerado",
"name": "João Silva",
"email": "joao@example.com",
"role": 0,
"created_at": "2026-03-01T..."
}
\`\`\`

### 4. Criar um admin

\`\`\`bash
curl -X POST http://localhost:3333/api/users \\
-H "Content-Type: application/json" \\
-d '{
"name": "Admin",
"email": "admin@example.com",
"password": "admin123",
"role": "ADMIN"
}'
\`\`\`

## ⚠️ Validações Implementadas

- ✅ Nome mínimo de 3 caracteres
- ✅ Email no formato válido
- ✅ Senha mínima de 6 caracteres
- ✅ Email único (não permite duplicados)
- ✅ Role válido (ADMIN ou BASIC_USER)

## 🔐 Segurança

- Senha hasheada com bcrypt (salt rounds: 10)
- password_hash nunca retornado na resposta
- Validação de entrada com Zod

## 📚 Princípios Aplicados

### DDD (Domain-Driven Design)

- **Entities**: User com identidade única
- **Value Objects**: ROLE enum
- **Repository Pattern**: Abstração de persistência
- **Ubiquitous Language**: Termos do domínio em todo código

### Clean Architecture

- **Separation of Concerns**: Cada camada com responsabilidade única
- **Dependency Rule**: Dependências apontam para dentro (domain)
- **Interface Segregation**: IUserRepository desacopla domain de infra
- **Input/Output Models**: DTOs isolam camadas

## 🚀 Próximos Passos

Para expandir funcionalidades:

1. **Criar outros use cases:**
   - `GetUserByIdUseCase.ts`
   - `UpdateUserUseCase.ts`
   - `DeleteUserUseCase.ts`
   - `ListUsersUseCase.ts`

2. **Adicionar mais rotas no controller:**
   - `GET /api/users/:id`
   - `PUT /api/users/:id`
   - `DELETE /api/users/:id`
   - `GET /api/users`

3. **Implementar validações de domínio:**
   - Criar Value Objects (Email, Password)
   - Adicionar regras de negócio na entidade User

4. **Adicionar autenticação:**
   - JWT tokens
   - Login use case
   - Middleware de autenticação

5. **Testes:**
   - Unit tests para use cases
   - Integration tests para repository
   - E2E tests para controllers

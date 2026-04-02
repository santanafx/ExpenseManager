import { OpenAPIRegistry, OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi'
import z from 'zod'

import { createUserSchema } from '../validators/users/createUserSchema.js'
import { loginSchema } from '../validators/users/loginSchema.js'
import { updateUserRoleSchema } from '../validators/users/updateUserRoleSchema.js'
import { createExpenseSchema } from '../validators/expenses/createExpenseSchema.js'
import { createExpenseCategorySchema } from '../validators/expenses/createExpenseCategorySchema.js'

const registry = new OpenAPIRegistry()

// ── Security ──────────────────────────────────────────────────────────────────
registry.registerComponent('securitySchemes', 'bearerAuth', {
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'JWT',
})

const auth = [{ bearerAuth: [] }]

// ── Schemas reutilizáveis ─────────────────────────────────────────────────────
const UserResponse = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  role: z.enum(['ADMIN', 'BASIC_USER']),
})

// ── User: POST /api/user ──────────────────────────────────────────────────────
registry.registerPath({
  method: 'post',
  path: '/api/user',
  tags: ['User'],
  summary: 'Create a new user',
  security: auth,
  request: {
    body: {
      required: true,
      content: { 'application/json': { schema: createUserSchema } },
    },
  },
  responses: {
    201: {
      description: 'User created successfully',
      content: { 'application/json': { schema: UserResponse } },
    },
    400: { description: 'Validation error' },
    401: { description: 'Unauthorized' },
  },
})

// ── User: POST /api/user/login ────────────────────────────────────────────────
registry.registerPath({
  method: 'post',
  path: '/api/user/login',
  tags: ['User'],
  summary: 'Authenticate and receive a JWT token',
  request: {
    body: {
      required: true,
      content: { 'application/json': { schema: loginSchema } },
    },
  },
  responses: {
    200: {
      description: 'Login successful',
      content: {
        'application/json': { schema: z.object({ token: z.string() }) },
      },
    },
    401: { description: 'Invalid credentials' },
  },
})

// ── User: GET /api/user/all-users ─────────────────────────────────────────────
registry.registerPath({
  method: 'get',
  path: '/api/user/all-users',
  tags: ['User'],
  summary: 'List all users',
  security: auth,
  responses: {
    200: {
      description: 'Array of users',
      content: {
        'application/json': { schema: z.array(UserResponse) },
      },
    },
    401: { description: 'Unauthorized' },
  },
})

// ── User: DELETE /api/user/:id ────────────────────────────────────────────────
registry.registerPath({
  method: 'delete',
  path: '/api/user/{id}',
  tags: ['User'],
  summary: 'Delete a user (Admin only)',
  security: auth,
  request: {
    params: z.object({ id: z.string() }),
  },
  responses: {
    200: { description: 'User deleted successfully' },
    401: { description: 'Unauthorized' },
    403: { description: 'Forbidden – Admin only' },
    404: { description: 'User not found' },
  },
})

// ── User: PATCH /api/user/:id ─────────────────────────────────────────────────
registry.registerPath({
  method: 'patch',
  path: '/api/user/{id}',
  tags: ['User'],
  summary: 'Update user profile',
  security: auth,
  request: {
    params: z.object({ id: z.string() }),
    body: {
      required: true,
      content: {
        'application/json': {
          schema: z.object({
            name: z.string().min(3).optional(),
            email: z.string().email().optional(),
            password: z.string().min(6).optional(),
          }),
        },
      },
    },
  },
  responses: {
    200: {
      description: 'User updated successfully',
      content: { 'application/json': { schema: UserResponse } },
    },
    400: { description: 'Validation error' },
    401: { description: 'Unauthorized' },
  },
})

// ── User: PATCH /api/user/:id/role ───────────────────────────────────────────
registry.registerPath({
  method: 'patch',
  path: '/api/user/{id}/role',
  tags: ['User'],
  summary: 'Update user role (Admin only)',
  security: auth,
  request: {
    params: z.object({ id: z.string() }),
    body: {
      required: true,
      content: { 'application/json': { schema: updateUserRoleSchema } },
    },
  },
  responses: {
    200: {
      description: 'Role updated successfully',
      content: { 'application/json': { schema: UserResponse } },
    },
    400: { description: 'Validation error' },
    401: { description: 'Unauthorized' },
    403: { description: 'Forbidden – Admin only' },
  },
})

// ── Expense: POST /api/expense ────────────────────────────────────────────────
registry.registerPath({
  method: 'post',
  path: '/api/expense',
  tags: ['Expense'],
  summary: 'Create a new expense',
  security: auth,
  request: {
    body: {
      required: true,
      content: { 'application/json': { schema: createExpenseSchema } },
    },
  },
  responses: {
    201: { description: 'Expense created successfully' },
    400: { description: 'Validation error' },
    401: { description: 'Unauthorized' },
  },
})

// ── Expense: POST /api/expense/category ──────────────────────────────────────
registry.registerPath({
  method: 'post',
  path: '/api/expense/category',
  tags: ['Expense'],
  summary: 'Create an expense category (Admin only)',
  security: auth,
  request: {
    body: {
      required: true,
      content: { 'application/json': { schema: createExpenseCategorySchema } },
    },
  },
  responses: {
    201: { description: 'Category created successfully' },
    400: { description: 'Validation error' },
    401: { description: 'Unauthorized' },
    403: { description: 'Forbidden – Admin only' },
  },
})

// ── Generator ─────────────────────────────────────────────────────────────────
export function generateSwaggerDocument() {
  const generator = new OpenApiGeneratorV3(registry.definitions)
  return generator.generateDocument({
    openapi: '3.0.0',
    info: {
      title: 'ExpenseManager API',
      version: '1.0.0',
      description: 'REST API for managing users and expenses',
    },
    servers: [{ url: 'http://localhost:3333', description: 'Local server' }],
  })
}

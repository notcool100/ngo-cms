# NGO CMS API Architecture

This document outlines the architecture of the NGO CMS API, which follows a structured approach with controllers, services, and interfaces.

## Architecture Overview

The API follows a layered architecture:

```
Client Request → Route Handler → Controller → Service → Database
```

### Key Components

1. **Route Handlers**: Entry points for API requests (Next.js route.ts files)
2. **Controllers**: Handle request/response logic and permissions
3. **Services**: Implement business logic and data operations
4. **Interfaces**: Define contracts for data models and components
5. **Utilities**: Provide common functionality across the application

## Directory Structure

```
/lib
  /controllers      # API controllers
  /services         # Business logic services
  /interfaces       # TypeScript interfaces
  /utils            # Utility functions
  /db               # Database schema and configuration
  permissions.ts    # Permission definitions
  api-permissions.ts # Permission checking logic
  prisma.ts         # Prisma client configuration

/app
  /api              # API route handlers
    /admin          # Admin-only API endpoints
    /about          # Public API endpoints
    ...
```

## Controllers

Controllers handle HTTP requests and responses. They:
- Validate input data
- Check user permissions
- Call appropriate services
- Format responses

Example: `AboutController` in `/lib/controllers/about.controller.ts`

## Services

Services contain business logic and data access. They:
- Implement CRUD operations
- Apply business rules
- Handle data transformations

Example: `AboutSectionService` in `/lib/services/about.service.ts`

## Interfaces

Interfaces define contracts for data models and components:
- Data models (e.g., `AboutSection`, `TeamMember`)
- Input/output types
- Service and controller contracts

Example: `Controller` interface in `/lib/interfaces/controller.interface.ts`

## Permission System

The API uses a role-based permission system:
- Permissions are defined in `permissions.ts`
- Controllers check permissions before processing requests
- Each endpoint requires specific permissions

## API Response Format

Standardized response format:

**Success Response:**
```json
{
  "data": { ... },
  "success": true
}
```

**Error Response:**
```json
{
  "error": "Error message",
  "success": false
}
```

## Adding New API Endpoints

To add a new API endpoint:

1. Define interfaces in `/lib/interfaces/`
2. Create a service in `/lib/services/`
3. Create a controller in `/lib/controllers/`
4. Create route handlers in `/app/api/`
5. Add required permissions in `permissions.ts`

## Best Practices

- Use the BaseController for common controller functionality
- Implement proper error handling
- Follow consistent naming conventions
- Document all public methods and interfaces
- Use TypeScript types for better type safety
- Keep controllers thin, put business logic in services
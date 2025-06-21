# Campaign Management Backend

![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6?logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-5+-2D3748?logo=prisma)
![Swagger](https://img.shields.io/badge/Swagger-85EA2D?logo=swagger&logoColor=black)

A backend application built with Express.js, TypeScript, and Prisma ORM .

## Technologies

- **Runtime**: Node.js 18+
- **Framework**: [Express.js](https://expressjs.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Database**: MySQL 8.0
- **Caching**: [Redis](https://redis.io/)
- **Containerization**: [Docker](https://www.docker.com/)
- **Testing**: [Jest](https://jestjs.io/)
- **API Documentation**: [Swagger](https://jestjs.io/)

## Requirements

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- Node.js 18+
- npm 9+

## Quick Start

### 1. Environment Setup

Rename `.env.copy` to `.env` and configure:

```env
# Database
DATABASE_URL="mysql://root:rootpassword@127.0.0.1:3306/mydb"
MYSQL_ROOT_PASSWORD=rootpassword
MYSQL_DATABASE=mydb
MYSQL_USER=user
MYSQL_PASSWORD=password
MYSQL_PORT=3306

# Redis
REDIS_URL=redis://127.0.0.1:6379
REDIS_PORT=6379

PORT=3001
```

### 2. Start services
The application is configured with docker-compose to easily set up redis and MySQL. [docker-compose.only-db-redis.yml](https://github.com/igabice/campaign-management/blob/main/backend/docker-compose.only-db-redis.yml)

- To start database and redis services
```bash 
docker-compose -f docker-compose.only-db-redis.yml up -d 
```


- To stop database and redis services
```bash 
docker-compose -f docker-compose.only-db-redis.yml down 
```

### 3. install dependencies

```bash 
npm install
```

### 4. Database Migration
apply Prisma migrations:
```bash
 npm run db:generate  // creates changes
 npm run db:push      // commits changes
 ```

### 5. start development server

```bash 
npm run dev 
```

## Testing
Run integration tests:

```bash 
npm test
```
This spins up a mysql database using docker-compose [docker-compose.only-db.yml](https://github.com/igabice/campaign-management/blob/main/backend/docker-compose.only-db.yml) which is used for integration test and after tests are completed the database container is killed.
*Note:* [Docker](https://www.docker.com/products/docker-desktop/) must be running for integration tests.

## API Documentation

Swagger documentation & postman collection is available at this links

### Online

[swagger](https://campaign-management-0z3y.onrender.com/v1/docs/swagger)
[postman](https://campaign-management-0z3y.onrender.com/v1/docs/swagger.json)

### Local
[swagger](http://127.0.0.1:3001/v1/docs/swagger)
[postman](http://localhost:3001/v1/docs/swagger.json)

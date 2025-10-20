# Vartur

A full-stack Nuxt.js application with Prisma ORM, MySQL database, and Redis caching. Features user authentication, product and category management.

## Prerequisites

- Node.js (v18 or higher)
- npm (recommended for package management)
- Docker and Docker Compose (for database and Redis)

## Project Setup

1. **Clone the repository and install dependencies:**

   ```bash
   npm install
   ```

2. **Environment Variables:**

   Create a `.env` file in the root directory with the following variables:

   ```env
   DATABASE_URL="mysql://nuxtuser:nuxtpassword@localhost:3306/nuxtdb"
   REDIS_HOST="localhost"
   REDIS_PORT=6379
   JWT_SECRET="vartur-super-scret"
   ```

3. **Database Setup:**

   Start the MySQL and Redis services using Docker Compose:

   ```bash
   docker-compose up -d
   ```

   This will start MySQL on port 3306 and Redis on port 6379.

4. **Run Database Migrations:**

   ```bash
   npm run prisma:migrate
   ```

5. **Seed the Database:**

   ```bash
   npm run prisma:seed
   ```

   This creates an admin user with username `admin` and password `admin`.

## How to Start the Application

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## API Documentation

API documentation is available via OpenAPI:

- Swagger UI: `http://localhost:3000/_docs`
- Scalar UI: `http://localhost:3000/_docs/scalar`
- OpenAPI JSON: `http://localhost:3000/_docs/openapi.json`

## Admin Credentials

For testing purposes, use the following admin credentials:

- Username: `admin`
- Password: `admin`

## Production Build

Build the application for production:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Additional Commands

- View database in Prisma Studio: `npm run prisma:studio`
- Generate types: `npm run generate`

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

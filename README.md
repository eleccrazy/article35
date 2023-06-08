# Article35 - Blog site (Backend)

## Description

This is the backend application for the Article35 project. Aritcle35 is a blog site for advocating women's empowerment in Ethiopia. Article 35 is where the rights of women is stated in the Ethiopian constitution.

## Technologies

- Node
- Express
- PostgreSQL
- Prisma
- Bcrypt
- JWT
- jasmine
- supertest
- Docker

## Installation

1. Clone the repository

```
git clone https://github.com/eleccrazy/article35.git
```

2. Install dependencies

```
npm install
```

3. Create a .env file at the root of the project folder and add the following environment variables

```
DATABASE_URL="postgresql://prisma:prisma@localhost:5433/article35?schema=public"
PAPER=just-for-making-password-more-secure
SALT_ROUNDS=10
JWT_SECRET=secret-for-jsonwebtoken
```

4. Create a docker container for the database and start it. If you want to run the database on your local machine, you can skip step 4 and 5. Make sure to change the DATABASE_URL environment variable in the .env file to match your local database url.

```
docker compose up -d
```

5. Migrate the database

```
npx prisma migrate dev --name init
```

6. Run the application

- Test mode

```
npm run test or yarn test
```

- Watch mode

```
npm run watch or yarn watch
```

- Production mode

```
npm run start or yarn start
```

The application will be running on http://localhost:3000

## API Documentation

Api documentation can be found in the [APIDOC.md](APIDOC.md) file

## Author

Gizachew Bayness - [eleccrazy](https://github.com/eleccrazy)

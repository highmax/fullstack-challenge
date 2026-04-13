# User & Posts Management Portal

Fullstack application built with **NestJS**, **Next.js**, and **MongoDB**. Integrates with [ReqRes API](https://reqres.in/) for user data and authentication.

## Architecture
```
fullstack-challenge/
|
├── backend/ # NestJS + TypeScript (Port 4000)
├── frontend/ # Next.js + TypeScript + Tailwind (Port 3000)
├── docker-compose.yml # MongoDB
└── README.md
```

### Backend Modules

| Module   | Responsibility                                  |
| -------- | ----------------------------------------------- |
| `auth`   | Login via ReqRes API, token-based auth guard    |
| `users`  | Import users from ReqRes, local DB persistence  |
| `posts`  | Full CRUD, stored entirely in MongoDB           |
| `reqres` | Centralized ReqRes API integration (HttpModule) |
| `common` | Exception filters, response interceptors        |

### API Endpoints

| Method | Endpoint                | Auth | Description                    |
| ------ | ----------------------- | ---- | ------------------------------ |
| POST   | `/api/auth/login`       | No   | Login via ReqRes               |
| GET    | `/api/users/reqres`     | Yes  | List ReqRes users (paginated)  |
| GET    | `/api/users/reqres/:id` | Yes  | Get single ReqRes user         |
| POST   | `/api/users/import/:id` | Yes  | Import ReqRes user to local DB |
| GET    | `/api/users/saved`      | Yes  | List locally saved users       |
| GET    | `/api/users/saved/:id`  | Yes  | Get locally saved user         |
| DELETE | `/api/users/saved/:id`  | Yes  | Delete locally saved user      |
| POST   | `/api/posts`            | Yes  | Create post                    |
| GET    | `/api/posts`            | Yes  | List posts (paginated)         |
| GET    | `/api/posts/:id`        | Yes  | Get single post                |
| PUT    | `/api/posts/:id`        | Yes  | Update post                    |
| DELETE | `/api/posts/:id`        | Yes  | Delete post                    |

## Prerequisites

- Node.js >= 18
- Docker & Docker Compose
- npm

## How to Install and Run Locally

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd user-posts-portal
```

### 2. Start MongoDB

```bash
docker compose up -d
```

### 3. Backend

```bash
cd backend
cp .env.example .env
npm install
npm run start:dev
```

Backend runs at `http://localhost:4000/api`

### 4. Frontend

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

Frontend runs at `http://localhost:3000`

### Test Credentials (ReqRes)

`Email:    eve.holt@reqres.in
Password: cityslicka`

## How to Run Tests

### Backend (7 tests)

```bash
cd backend
npm test
```

Covers: AuthService (login success/failure), PostsService (findAll pagination, findById, delete).

### Frontend (5 tests)

```bash
cd frontend
npm test
```

Covers: LoginPage (form rendering, test credentials), EmptyState (title, description).

## Environment Variables

### Backend (`backend/.env`)

| Variable          | Default                                       | Description            |
| ----------------- | --------------------------------------------- | ---------------------- |
| `MONGODB_URI`     | `mongodb://localhost:27017/user-posts-portal` | MongoDB connection URI |
| `PORT`            | `4000`                                        | Server port            |
| `NODE_ENV`        | `development`                                 | Environment            |
| `REQRES_BASE_URL` | `https://reqres.in/api`                       | ReqRes API base URL    |
| `REQRES_API_KEY`  | -                                             | ReqRes API key         |
| `CORS_ORIGIN`     | `http://localhost:3000`                       | Allowed CORS origin    |

### Frontend (`frontend/.env.local`)

| Variable              | Default                     | Description     |
| --------------------- | --------------------------- | --------------- |
| `NEXT_PUBLIC_API_URL` | `http://localhost:4000/api` | Backend API URL |

## How to Deploy

### Backend → AWS Lambda

```bash
cd backend
npm run build
npx serverless deploy --stage prod
```

Required: AWS credentials configured, environment variables set in Lambda console or via `serverless.yml`. The `MONGODB_URI` should point to a cloud MongoDB instance (e.g. MongoDB Atlas).

### Frontend → Vercel

```bash
cd frontend
npx vercel
```

Set `NEXT_PUBLIC_API_URL` to your API Gateway endpoint URL in Vercel environment settings.

## Tech Stack

- **Backend**: NestJS, TypeScript, Mongoose, class-validator
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Axios
- **Database**: MongoDB 7
- **Testing**: Jest, Testing Library
- **Deployment**: AWS Lambda (Serverless Framework), Vercel
- **Code Quality**: ESLint, Prettier

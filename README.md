# USC Days Web Application

> A modern web application for managing, viewing, and ranking sports teams, scores, schedules, and champions at the University of South Carolina. Built with Next.js, TypeScript, Prisma, and Supabase.

---

## Table of Contents

-   [Features](#features)
-   [Project Structure](#project-structure)
-   [Setup & Installation](#setup--installation)
-   [Development](#development)
-   [Database](#database)
-   [Authentication](#authentication)
-   [API Routes](#api-routes)
-   [Components](#components)
-   [Deployment](#deployment)
-   [Contributing](#contributing)
-   [License](#license)

---

## Features

-   View and manage sports teams, scores, schedules, and champions
-   Rankings and advanced search for teams and scores
-   Authentication (login/logout/session)
-   Modern UI with reusable components
-   Prisma ORM for database management
-   Supabase integration for authentication and data

## Project Structure

```
usc-days/
├── prisma/           # Prisma schema and migrations
├── public/           # Static assets (logos, images)
├── src/
│   ├── app/          # Next.js app directory (routing, pages, API)
│   ├── assets/       # Project-specific assets
│   ├── components/   # UI and feature components
│   ├── constants/    # Mock data and constants
│   ├── lib/          # Utility functions and Prisma client
│   ├── services/     # Business logic and data services
│   ├── stores/       # State management (Zustand)
│   ├── types/        # TypeScript types
│   └── utils/        # Utility functions and Supabase integration
├── package.json      # Project dependencies and scripts
├── tsconfig.json     # TypeScript configuration
├── next.config.mjs   # Next.js configuration
└── README.md         # Project documentation
```

## Setup & Installation

1. **Clone the repository:**
    ```bash
    git clone https://github.com/todayscarolinian/usc-days.git
    cd usc-days
    ```
2. **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```
3. **Configure environment variables:**
    - Copy `.env.example` to `.env` and fill in required values (Supabase, database, etc).
4. **Set up the database:**
    ```bash
    npx prisma migrate dev
    ```

## Development

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database

-   **Prisma** is used for database schema and migrations (`prisma/schema.prisma`).
-   Migrations are stored in `prisma/migrations/`.
-   Update schema and run migrations with:
    ```bash
    npx prisma migrate dev
    ```

## Authentication

-   Uses Supabase for authentication and session management.
-   Related files: `src/utils/supabase/`, `src/app/user/`, `src/services/auth.service.ts`.

## API Routes

Located in `src/app/api/`:

-   `/champions` - Champions data
-   `/games` - Games data
-   `/scores` - Scores data
-   `/sports` - Sports data
-   `/teams` - Teams data
-   `/user` - User authentication and session

## Components

-   UI components: `src/components/ui/`
-   Feature components: `src/components/champions/`, `src/components/scores/`, etc.
-   Layout: `src/components/layout/navbar.tsx`, `src/app/layout.tsx`

## Deployment

-   Recommended: [Vercel](https://vercel.com/)
-   See Next.js [deployment docs](https://nextjs.org/docs/app/building-your-application/deploying)

## Contributing

Pull requests and issues are welcome! Please follow conventional commit messages and code style.

## License

MIT

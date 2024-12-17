# [Project Name](http://localhost:3000)

> **Warning** This project is still in development and is not ready for production use.

## Prerequisites

You will need [Node.js](https://nodejs.org) version 22.x.x or greater installed on your
system.

## Tech Stack

- **Core:** [React, React hooks](https://react.dev)
- **TypeScript** [TypeScript](https://www.typescriptlang.org)
- **Framework:** [Next.js, RSC, Server Actions](https://nextjs.org)
- **Landing Page:** [Astro](https://astro.build)
- **Styling:** [Tailwind CSS](https://tailwindcss.com)
- **UI Components:** [Shadcn UI](https://ui.shadcn.com)
- **Icons:** [Lucide-React](https://lucide.dev)
- **State Management:** [Nuqs](https://nuqs.47ng.com),
  [Zustand](https://zustand-demo.pmnd.rs),
  [React Query](https://tanstack.com/query/latest)
- **Validation:** [Zod](https://zod.dev)
- **ORM:** [Prisma](https://www.prisma.io)
- **Supabase (Database):** [Supabase](https://supabase.com)
- **S3 (File Storage):** [AWS S3](https://aws.amazon.com/s3)
- **Auth:** [Clerk](https://clerk.com), [Kinde](https://kinde.com)
- **Email:** [Mailjet](https://mailjet.com)
- **Payment:** [Stripe](https://stripe.com)
- **Analytics:** [PostHog](https://posthog.com)
- **Vercel (Hosting):** [Vercel](https://vercel.com)
- **Cloudflare (Doman, CDN):** [Cloudflare](https://cloudflare.com)
- **Testing:** [Vitest](https://vitest.dev),
  [React Testing Library](https://testing-library.com),
  [Playwright](https://playwright.dev)
- **CI/CD:** [GitHub Actions](https://github.com/features/actions)
- **Linting:** [ESLint](https://eslint.org), [Prettier](https://prettier.io)
- **Formatting:** [Prettier](https://prettier.io)
- **Editor:** [Cursor](https://cursor.com)
- **Package Manager:** [Bun](https://bun.sh)

## Running Locally

### 1. Install Bun

```powershell
powershell -c "irm bun.sh/install.ps1 | iex"
```

### 2. Install Rimraf

```bash
npm install -g rimraf
```

### 3. Clone the repository

```bash
git clone https://github.com/Marian1309/Next.js
```

### 4. Install dependencies

```bash
bun install
```

### 5. Create a `.env` file

Create a `.env` file in the root directory and add the environment variables as shown in
the `.env.example` file.

### 6. Run the application

```bash
bun run dev
```

The app should now be up and running at http://localhost:3000 🚀

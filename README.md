# Chatify - Real-time Chat Application

A modern real-time chat application built with Next.js, Convex, and Clerk.

## Features

- 🔐 Authentication with Clerk
- 💬 Real-time messaging with Convex
- 🎨 Beautiful UI with Tailwind CSS
- 📱 Responsive design
- 🌙 Dark mode support

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Backend**: Convex (real-time database)
- **Authentication**: Clerk
- **Styling**: Tailwind CSS
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm, yarn, pnpm, or bun package manager

### Installation

1. Clone the repository and install dependencies:

```bash
npm install
```

2. Set up environment variables:

Copy `.env.example` to `.env.local` and fill in your credentials:

```bash
cp .env.example .env.local
```

3. Set up Clerk:
   - Create an account at [clerk.com](https://clerk.com)
   - Create a new application
   - Copy your API keys to `.env.local`
   - See [docs/AUTHENTICATION.md](docs/AUTHENTICATION.md) for detailed instructions

4. Set up Convex:
   - Run `npx convex dev` to initialize Convex
   - Follow the prompts to create a Convex project
   - Copy the `NEXT_PUBLIC_CONVEX_URL` to `.env.local`
   - Configure Clerk-Convex integration (see [docs/CONVEX_SETUP.md](docs/CONVEX_SETUP.md))

5. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Project Structure

```
├── app/                  # Next.js app router pages
├── components/           # React components
├── convex/              # Convex backend functions
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions
└── docs/                # Documentation
```

## Documentation

- [Authentication Setup](docs/AUTHENTICATION.md)
- [Convex Setup Guide](docs/CONVEX_SETUP.md)

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Convex Documentation](https://docs.convex.dev)
- [Clerk Documentation](https://clerk.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

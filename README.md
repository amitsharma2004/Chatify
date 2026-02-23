# Chatify - Real-time Chat Application

A modern real-time chat application built with Next.js, Convex, and Clerk.

## Features

- 🔐 Authentication with Clerk (email/password and OAuth)
- 💬 Real-time messaging with Convex
- 👥 User list and search
- 💭 Conversation creation and management
- 🎨 Beautiful UI with Tailwind CSS
- 📱 Responsive design
- 🌙 Dark mode support

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Backend**: Convex (real-time database)
- **Authentication**: Clerk
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Icons**: Lucide React

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

Copy `.env.example` to `.env.local` and fill in your credentials.

3. Set up Clerk:
   - Create an account at [clerk.com](https://clerk.com)
   - Create a new application
   - Copy your API keys to `.env.local`

4. Set up Convex:
   - Run `npx convex dev` to initialize Convex
   - Follow the prompts to create a Convex project
   - Copy the `NEXT_PUBLIC_CONVEX_URL` to `.env.local`
   - Configure Clerk-Convex integration in both dashboards

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
└── lib/                 # Utility functions
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Convex Documentation](https://docs.convex.dev)
- [Clerk Documentation](https://clerk.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

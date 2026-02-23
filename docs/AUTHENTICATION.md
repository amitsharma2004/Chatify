# Authentication Setup

This project uses Clerk for authentication.

## Configuration

1. Sign up for a Clerk account at https://clerk.com
2. Create a new application in the Clerk dashboard
3. Copy your API keys to `.env.local`:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`

## Features

- Sign-in page at `/sign-in`
- Sign-up page at `/sign-up`
- Protected routes (all routes except sign-in/sign-up require authentication)
- User profile display with avatar and name
- Logout functionality

## Components

- `Header`: Main navigation with user profile and logout button
- `UserProfile`: Displays logged-in user's avatar, name, and email
- `LogoutButton`: Sign out button with redirect to sign-in page

## Middleware

The `middleware.ts` file protects all routes except `/sign-in` and `/sign-up`. Unauthenticated users are automatically redirected to the sign-in page.

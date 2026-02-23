# Convex Setup Guide

This guide will help you set up Convex backend and integrate it with Clerk authentication.

## Step 1: Initialize Convex

Run the following command to initialize Convex in your project:

```bash
npx convex dev
```

This will:
- Create a Convex project
- Generate the `convex/_generated` folder
- Start the Convex development server
- Provide you with a `NEXT_PUBLIC_CONVEX_URL`

## Step 2: Configure Environment Variables

Add the Convex URL to your `.env.local` file:

```env
NEXT_PUBLIC_CONVEX_URL=https://your-convex-deployment.convex.cloud
```

## Step 3: Set Up Clerk JWT Template

1. Go to your Clerk Dashboard: https://dashboard.clerk.com
2. Navigate to **JWT Templates** in the sidebar
3. Click **New Template** and select **Convex**
4. Copy the **Issuer URL** (it looks like: `https://your-clerk-domain.clerk.accounts.dev`)
5. Save the template

## Step 4: Configure Convex with Clerk

1. Go to your Convex Dashboard: https://dashboard.convex.dev
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variable:
   - Key: `CONVEX_CLERK_ISSUER_URL`
   - Value: The Issuer URL from Clerk (e.g., `https://your-clerk-domain.clerk.accounts.dev`)

## Step 5: Verify Integration

Once configured, the integration will:
- Automatically sync user data from Clerk to Convex on first login
- Store user profiles in the `users` table
- Enable authenticated Convex queries and mutations

## Database Schema

The `users` table includes:
- `clerkId`: Unique Clerk user ID
- `email`: User's email address
- `name`: User's full name
- `avatarUrl`: User's profile picture URL
- `createdAt`: Timestamp of user creation

## Available Functions

### Mutations
- `storeUser`: Syncs Clerk user data to Convex (called automatically on login)

### Queries
- `getCurrentUser`: Gets the current authenticated user
- `getUserByClerkId`: Gets a user by their Clerk ID

## Troubleshooting

If you encounter issues:
1. Ensure `NEXT_PUBLIC_CONVEX_URL` is set correctly in `.env.local`
2. Verify the JWT template is configured in Clerk
3. Check that `CONVEX_CLERK_ISSUER_URL` is set in Convex dashboard
4. Restart the Convex dev server: `npx convex dev`
5. Restart the Next.js dev server: `npm run dev`

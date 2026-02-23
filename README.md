# Chatify 💬

A modern, feature-rich real-time chat application built with Next.js, Convex, and Clerk. Experience seamless communication with real-time messaging, group chats, reactions, and more.

## ✨ Features

### Authentication & User Management
- 🔐 Secure authentication with Clerk (email/password and OAuth providers)
- 👤 User profiles with avatars
- 🟢 Real-time online/offline status indicators
- 🔍 User search functionality

### Messaging
- 💬 Real-time one-on-one messaging
- 👥 Group chat with multiple participants
- ⌨️ Typing indicators
- 📝 Message timestamps with smart formatting
- 🗑️ Soft delete for own messages
- 😊 Emoji reactions (👍, ❤️, 😂, 😮, 😢, 🎉)

### Conversations
- 📋 Conversation list with last message preview
- 🔔 Unread message badges
- 🆕 Create new conversations or groups
- 🔄 Real-time conversation updates

### User Experience
- 📱 Fully responsive design (mobile, tablet, desktop)
- 🎨 Beautiful UI with Tailwind CSS
- 🌙 Dark mode support
- ⚡ Smart auto-scroll with "new messages" indicator
- 💀 Skeleton loaders for better perceived performance
- ⚠️ Comprehensive error handling with retry options
- 🛡️ Error boundaries for graceful failure handling

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Backend**: [Convex](https://convex.dev/) (real-time database and backend)
- **Authentication**: [Clerk](https://clerk.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm, yarn, pnpm, or bun package manager
- A Clerk account ([sign up here](https://clerk.com))
- A Convex account ([sign up here](https://convex.dev))

### Installation

1. **Clone the repository**

```bash
git clone <your-repo-url>
cd chatify
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Clerk URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Convex
NEXT_PUBLIC_CONVEX_URL=your_convex_deployment_url
```

4. **Set up Clerk**

   - Go to [clerk.com](https://clerk.com) and create a new application
   - Enable email/password authentication and any OAuth providers you want
   - Copy your publishable key and secret key to `.env.local`
   - In Clerk dashboard, go to **JWT Templates** and create a new Convex template
   - Copy the Issuer URL (you'll need this for Convex)

5. **Set up Convex**

   - Run the Convex development server:

   ```bash
   npx convex dev
   ```

   - Follow the prompts to create a new Convex project
   - Copy the `NEXT_PUBLIC_CONVEX_URL` to `.env.local`
   - In your Convex dashboard, go to **Settings** → **Environment Variables**
   - Add `CONVEX_CLERK_ISSUER_URL` with the Issuer URL from Clerk's JWT template

6. **Run the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
chatify/
├── app/                      # Next.js app router
│   ├── sign-in/             # Sign in page
│   ├── sign-up/             # Sign up page
│   ├── layout.tsx           # Root layout with providers
│   ├── page.tsx             # Main chat page
│   └── globals.css          # Global styles
├── components/              # React components
│   ├── chat-area.tsx        # Main chat interface
│   ├── chat-header.tsx      # Chat header with user info
│   ├── conversation-list-item.tsx
│   ├── conversation-sidebar.tsx
│   ├── create-group-modal.tsx
│   ├── empty-state.tsx      # Empty state component
│   ├── error-boundary.tsx   # Error boundary wrapper
│   ├── header.tsx           # App header
│   ├── message-bubble.tsx   # Individual message
│   ├── message-input.tsx    # Message input field
│   ├── message-list-skeleton.tsx
│   ├── message-reactions.tsx
│   ├── online-status.tsx    # Online indicator
│   ├── reaction-picker.tsx  # Emoji picker
│   ├── typing-indicator.tsx
│   ├── unread-badge.tsx     # Unread count badge
│   ├── user-list-item.tsx
│   ├── user-list-skeleton.tsx
│   ├── user-profile.tsx
│   └── user-sidebar.tsx
├── convex/                  # Convex backend
│   ├── auth.config.ts       # Clerk integration
│   ├── conversations.ts     # Conversation queries/mutations
│   ├── messages.ts          # Message queries/mutations
│   ├── reactions.ts         # Reaction queries/mutations
│   ├── schema.ts            # Database schema
│   ├── typing.ts            # Typing indicator logic
│   └── users.ts             # User queries/mutations
├── hooks/                   # Custom React hooks
│   ├── use-store-user.tsx   # User sync hook
│   └── use-user-presence.tsx # Presence tracking
├── lib/                     # Utility functions
│   └── format-time.ts       # Time formatting
└── middleware.ts            # Auth middleware

```

## 🎯 Key Features Explained

### Real-time Messaging
Messages are delivered instantly using Convex's real-time subscriptions. No polling or manual refreshing needed.

### Group Chats
Create group conversations with multiple users. Group messages show sender names to distinguish between participants.

### Typing Indicators
See when other users are typing in real-time with a 2-second debounce to avoid excessive updates.

### Message Reactions
React to messages with emojis. Click a reaction to toggle it on/off. Hover to see who reacted.

### Smart Auto-scroll
Messages automatically scroll to the bottom when you're at the bottom. If you scroll up to read history, a "New messages" button appears.

### Unread Badges
Conversations show unread message counts that update in real-time and clear when you open the conversation.

### Online Status
See who's online with green indicators. Status updates automatically based on browser visibility and activity.

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start Next.js dev server
npx convex dev       # Start Convex backend

# Production
npm run build        # Build for production
npm start            # Start production server

# Linting
npm run lint         # Run ESLint
```

## 🌐 Environment Variables

Create a `.env.local` file with the following variables:

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key | Yes |
| `CLERK_SECRET_KEY` | Clerk secret key | Yes |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | Sign in page URL | Yes |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | Sign up page URL | Yes |
| `NEXT_PUBLIC_CONVEX_URL` | Convex deployment URL | Yes |

**Note**: Never commit `.env.local` to version control. Use `.env.example` as a template.

## 🧪 Testing

The application has been tested for:
- ✅ User authentication and authorization
- ✅ Real-time message delivery
- ✅ Group chat functionality
- ✅ Message reactions and deletion
- ✅ Typing indicators and presence
- ✅ Responsive design across devices
- ✅ Error handling and recovery
- ✅ Loading states and skeletons

## 🚢 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

### Deploy Convex

```bash
npx convex deploy
```

Update your `NEXT_PUBLIC_CONVEX_URL` in Vercel with the production URL.

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Convex Documentation](https://docs.convex.dev)
- [Clerk Documentation](https://clerk.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Real-time backend by [Convex](https://convex.dev/)
- Authentication by [Clerk](https://clerk.com/)
- UI components styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons from [Lucide](https://lucide.dev/)

---

Made with ❤️ by the Chatify team

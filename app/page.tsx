import { Header } from "@/components/header";
import { StoreUserWrapper } from "@/components/store-user-wrapper";

export default function Home() {
  return (
    <StoreUserWrapper>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center gap-6 text-center">
            <h1 className="text-4xl font-bold text-foreground">
              Welcome to Chatify
            </h1>
            <p className="max-w-md text-lg text-muted-foreground">
              Your real-time chat application is ready. Start building your chat features!
            </p>
          </div>
        </main>
      </div>
    </StoreUserWrapper>
  );
}

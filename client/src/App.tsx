import { ChatPage } from "./Pages";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  RedirectToSignIn,
} from "@clerk/clerk-react";

import { QueryClient, QueryClientProvider } from "react-query";

const clerkPubKey = import.meta.env.VITE_REACT_APP_CLERK_PUBLISHABLE_KEY;
const queryClient = new QueryClient();

if (!clerkPubKey) {
  throw new Error("Missing Publishable Key");
}

export default function Home() {


  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <SignedIn>
        <QueryClientProvider client={queryClient}>
        <div className="h-[100vh]">
          <ChatPage />
        </div>
        </QueryClientProvider>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </ClerkProvider>
  );
}

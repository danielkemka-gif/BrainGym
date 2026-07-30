import { ChatUI } from "@/components/coach/chat-ui";

export default function CoachPage() {
  return (
    <div className="mx-auto flex w-full max-w-full flex-col space-y-6 overflow-x-hidden px-4 sm:px-6 lg:px-0 touch-manipulation">
      <div>
        <h1 className="text-balance text-xl font-bold sm:text-2xl">AI Coach</h1>
        <p className="text-sm text-muted-foreground">
          Your personal brain training coach powered by AI
        </p>
      </div>
      <ChatUI />
    </div>
  );
}

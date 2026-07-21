import { ChatUI } from "@/components/coach/chat-ui";

export default function CoachPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col space-y-6">
      <div>
        <h1 className="text-2xl font-bold">AI Coach</h1>
        <p className="text-sm text-muted-foreground">
          Your personal brain training coach powered by AI
        </p>
      </div>
      <ChatUI />
    </div>
  );
}

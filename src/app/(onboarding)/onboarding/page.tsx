import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard";

export default function OnboardingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">Welcome to BrainGym</h1>
        <p className="mt-2 text-muted-foreground">
          Let&apos;s set up your personalized training plan
        </p>
      </div>
      <OnboardingWizard />
    </div>
  );
}

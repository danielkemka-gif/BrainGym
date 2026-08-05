import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard";

export default function OnboardingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-6 pb-[env(safe-area-inset-bottom)] touch-manipulation">
      <div className="mb-6 sm:mb-8 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold">Welcome to BrainGym</h1>
        <p className="mt-1 sm:mt-2 text-sm sm:text-base text-muted-foreground">
          Let&apos;s set up your personalized training plan
        </p>
      </div>
      <OnboardingWizard />
    </div>
  );
}

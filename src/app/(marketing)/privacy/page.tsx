import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8 py-12">
      <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
        &larr; Back to home
      </Link>

      <div>
        <h1 className="text-3xl font-bold">Privacy Policy</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: 24 July 2026</p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6 text-sm leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold">1. Introduction</h2>
          <p>
            Welcome to BrainGym (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We are committed to protecting your personal information and your right to privacy.
            This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our brain training application and website
            at braingym.app (the &quot;Service&quot;).
          </p>
          <p>
            By using our Service, you agree to the collection and use of information in accordance with this policy. If you do not agree, please discontinue use.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">2. Information We Collect</h2>
          <h3 className="text-lg font-medium mt-4">Personal Information</h3>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>Name, username, and email address (provided during registration)</li>
            <li>Age and gender (optional, used for personalisation)</li>
            <li>Occupation (optional)</li>
            <li>Profile picture (optional, stored as base64 data)</li>
          </ul>

          <h3 className="text-lg font-medium mt-4">Usage Data</h3>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>Brain training activity completions, scores, and progress</li>
            <li>Workout history and streak data</li>
            <li>Achievement unlocks and XP/coins earned</li>
            <li>Quiz responses and challenge results</li>
            <li>Feature usage patterns (via PostHog analytics)</li>
          </ul>

          <h3 className="text-lg font-medium mt-4">Device Information</h3>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>Browser type and version</li>
            <li>Operating system</li>
            <li>Device type (desktop, mobile, tablet)</li>
            <li>IP address (anonymised)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold">3. How We Use Your Information</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>To personalise your brain training experience based on your age group, goals, and skill level</li>
            <li>To track your progress, streaks, and achievements</li>
            <li>To provide AI-powered coaching and recommendations</li>
            <li>To process premium subscription payments (via Paystack)</li>
            <li>To send workout reminders and notifications (if enabled)</li>
            <li>To improve our Service and develop new features</li>
            <li>To ensure the security and integrity of our platform</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold">4. Data Storage and Security</h2>
          <p>
            Your data is stored securely using Supabase, a hosted PostgreSQL database service with row-level security (RLS) enabled.
            All data transmissions are encrypted via TLS. We implement industry-standard security measures to protect your personal information,
            including authentication tokens, encrypted passwords, and restricted access controls.
          </p>
          <p>
            We retain your data for as long as your account is active. You may request deletion at any time by contacting us.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">5. Third-Party Services</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Supabase</strong> &mdash; Database, authentication, and file storage</li>
            <li><strong>Vercel</strong> &mdash; Hosting and deployment</li>
            <li><strong>Paystack</strong> &mdash; Payment processing for premium subscriptions</li>
            <li><strong>OpenAI</strong> &mdash; AI coaching and decision lab features</li>
            <li><strong>PostHog</strong> &mdash; Product analytics (anonymised)</li>
            <li><strong>Vercel Analytics</strong> &mdash; Performance monitoring</li>
          </ul>
          <p className="mt-2">
            These services have access only to the minimum information necessary to provide their functionality.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">6. Cookies and Tracking</h2>
          <p>
            We use essential cookies for authentication and session management. We do not use advertising cookies.
            PostHog analytics collects anonymised usage data to help us improve the product. You may opt out of analytics tracking.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">7. Your Rights</h2>
          <p>Depending on your location, you have the right to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Access the personal data we hold about you</li>
            <li>Correct inaccurate or incomplete data</li>
            <li>Request deletion of your personal data</li>
            <li>Object to or restrict the processing of your data</li>
            <li>Data portability (receive your data in a structured, machine-readable format)</li>
            <li>Withdraw consent at any time</li>
          </ul>
          <p className="mt-2">
            To exercise any of these rights, please contact us at privacy@braingym.app.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">8. Children&apos;s Privacy</h2>
          <p>
            BrainGym is designed for users aged 13 and above. We do not knowingly collect personal information from children under 13.
            If we become aware that a child under 13 has provided us with personal information, we will take steps to delete such information promptly.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">9. International Data Transfers</h2>
          <p>
            Your data may be processed in countries outside your country of residence. We ensure appropriate safeguards are in place
            for international data transfers, including standard contractual clauses where required.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">10. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page
            and updating the &quot;Last updated&quot; date. Your continued use of the Service after changes constitutes acceptance of the updated policy.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">11. Contact Us</h2>
          <p>
            If you have questions about this Privacy Policy or our data practices, please contact us at:
          </p>
          <p className="mt-2 font-medium">privacy@braingym.app</p>
        </section>
      </div>
    </div>
  );
}

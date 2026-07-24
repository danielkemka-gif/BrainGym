import Link from "next/link";

export default function TermsOfServicePage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8 py-12">
      <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
        &larr; Back to home
      </Link>

      <div>
        <h1 className="text-3xl font-bold">Terms of Service</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: 24 July 2026</p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6 text-sm leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold">1. Acceptance of Terms</h2>
          <p>
            By accessing or using BrainGym (the &quot;Service&quot;), you agree to be bound by these Terms of Service (&quot;Terms&quot;).
            If you do not agree to these Terms, do not use the Service. We reserve the right to modify these Terms at any time,
            and continued use constitutes acceptance of any changes.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">2. Eligibility</h2>
          <p>
            The Service is intended for users aged 13 and above. By using BrainGym, you represent that you are at least 13 years old.
            Users under 18 should have parental consent before using the Service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">3. Account Registration</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>You must provide accurate and complete information when creating an account</li>
            <li>You are responsible for safeguarding your account credentials</li>
            <li>You may not share your account with others or create multiple accounts</li>
            <li>You must notify us immediately of any unauthorised use of your account</li>
            <li>We reserve the right to suspend or terminate accounts that violate these Terms</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold">4. Free and Premium Services</h2>
          <h3 className="text-lg font-medium mt-4">Free Tier</h3>
          <p>
            BrainGym offers a free tier that includes access to basic brain training activities, progress tracking,
            and community features. Free users receive a 14-day trial of premium features upon signup.
          </p>

          <h3 className="text-lg font-medium mt-4">Premium Subscription</h3>
          <p>
            Premium features include advanced AI coaching, exclusive activities, detailed analytics, and higher streak bonuses.
            Premium subscriptions are processed through Paystack and billed in Nigerian Naira (NGN).
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>Monthly: ₦3,500/month</li>
            <li>Annual: ₦33,600/year (20% savings)</li>
          </ul>

          <h3 className="text-lg font-medium mt-4">Cancellation and Refunds</h3>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>You may cancel your subscription at any time from your account settings</li>
            <li>Cancellation takes effect at the end of the current billing period</li>
            <li>No partial refunds are provided for unused portions of a billing period</li>
            <li>Free-tier access resumes after premium cancellation</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold">5. User Content</h2>
          <p>
            You retain ownership of any content you create within the Service, including journal entries,
            challenge submissions, and profile information. By using BrainGym, you grant us a limited licence
            to store, display, and process this content solely for the purpose of providing the Service.
          </p>
          <p className="mt-2">
            You agree not to create, upload, or share content that:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Violates any law or regulation</li>
            <li>Infringes on the rights of others</li>
            <li>Contains malware, viruses, or harmful code</li>
            <li>Is defamatory, harassing, or threatening</li>
            <li>Contains explicit or offensive material</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold">6. Intellectual Property</h2>
          <p>
            All content, features, designs, graphics, logos, and software associated with BrainGym are owned by or
            licensed to us and are protected by copyright, trademark, and other intellectual property laws.
            You may not reproduce, distribute, modify, or create derivative works without our express written permission.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">7. AI-Generated Content</h2>
          <p>
            BrainGym uses artificial intelligence (powered by OpenAI) to provide coaching, recommendations,
            and educational content. AI-generated content is provided for informational and educational purposes only
            and should not be considered professional medical, psychological, or educational advice.
          </p>
          <p className="mt-2">
            We do not guarantee the accuracy, completeness, or reliability of AI-generated content.
            You should consult qualified professionals for specific advice.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">8. Prohibited Conduct</h2>
          <p>You agree not to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Use the Service for any unlawful purpose</li>
            <li>Attempt to gain unauthorised access to any part of the Service</li>
            <li>Interfere with or disrupt the Service or servers</li>
            <li>Use automated tools (bots, scrapers) to access the Service</li>
            <li>Circumvent any features or limitations of the Service</li>
            <li>Impersonate another person or entity</li>
            <li>Engage in any activity that could damage or impair the Service</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold">9. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, BrainGym and its operators shall not be liable for any indirect,
            incidental, special, consequential, or punitive damages arising out of or related to your use of the Service.
            Our total liability shall not exceed the amount you paid us in the 12 months preceding the claim.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">10. Disclaimer of Warranties</h2>
          <p>
            The Service is provided on an &quot;as is&quot; and &quot;as available&quot; basis without warranties of any kind,
            whether express or implied. We do not warrant that the Service will be uninterrupted, error-free,
            or free of viruses or other harmful components.
          </p>
          <p className="mt-2">
            BrainGym is not a medical device and is not intended to diagnose, treat, cure, or prevent any disease
            or cognitive condition. Consult a healthcare professional before starting any brain training programme.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">11. Indemnification</h2>
          <p>
            You agree to indemnify and hold harmless BrainGym and its operators from any claims, losses, or damages
            arising from your use of the Service or violation of these Terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">12. Governing Law</h2>
          <p>
            These Terms are governed by and construed in accordance with the laws of the Federal Republic of Nigeria.
            Any disputes shall be resolved in the courts of competent jurisdiction in Lagos, Nigeria.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">13. Changes to These Terms</h2>
          <p>
            We reserve the right to modify these Terms at any time. Material changes will be notified via the Service
            or by email. Your continued use after changes take effect constitutes acceptance of the revised Terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">14. Contact Us</h2>
          <p>
            For questions about these Terms of Service, please contact us at:
          </p>
          <p className="mt-2 font-medium">legal@braingym.app</p>
        </section>
      </div>
    </div>
  );
}

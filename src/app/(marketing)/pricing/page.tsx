"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Sparkles, ArrowRight } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "₦0",
    description: "Start building better habits today.",
    features: [
      "Daily brain workouts",
      "7 activity categories",
      "Basic progress tracking",
      "Streak tracking",
      "Community leaderboard",
      "7-day workout history",
    ],
    cta: "Get Started Free",
    href: "/signup",
    featured: false,
  },
  {
    name: "Premium",
    price: "₦3,500",
    period: "/month",
    description: "Unlock your full cognitive potential.",
    features: [
      "Everything in Free",
      "Unlimited AI Coach sessions",
      "Decision Lab with AI evaluation",
      "Advanced analytics & reports",
      "Unlimited workout history",
      "Priority support",
    ],
    cta: "Subscribe Now",
    featured: true,
    href: undefined,
  },
  {
    name: "Annual",
    price: "₦30,000",
    period: "/year",
    description: "Best value for committed training.",
    features: [
      "Everything in Premium",
      "Billed annually (save 30%)",
      "Early access to new features",
      "Beta program access",
      "Exclusive community events",
    ],
    cta: "Subscribe Now",
    featured: false,
    href: undefined,
  },
];

export default function PricingPage() {
  const [checking, setChecking] = useState(false);

  async function handleCheckout() {
    setChecking(true);
    try {
      const res = await fetch("/api/paystack/initialize", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch { /* */ }
    setChecking(false);
  }

  return (
    <>
      <section className="border-b border-border/40 bg-muted/30 py-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Simple, transparent pricing</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Choose your plan
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              Start free. Upgrade when you&apos;re ready for AI-powered
              coaching and advanced features.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3 lg:gap-6">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`relative rounded-2xl border p-8 ${
                  plan.featured
                    ? "border-primary/30 bg-primary/5 shadow-lg shadow-primary/10"
                    : "border-border/50 bg-card"
                }`}
              >
                {plan.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                      <Sparkles className="h-3 w-3" />
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="mb-6">
                  <h2 className="text-xl font-bold">{plan.name}</h2>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.period && (
                      <span className="text-sm text-muted-foreground">
                        {plan.period}
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {plan.description}
                  </p>
                </div>

                <ul className="mb-8 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {plan.href ? (
                  <Link
                    href={plan.href}
                    className={`flex h-11 w-full items-center justify-center gap-2 rounded-xl text-sm font-medium transition-all ${
                      plan.featured
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90"
                        : "border border-border bg-background hover:bg-accent"
                    }`}
                  >
                    {plan.cta}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                ) : (
                  <button
                    onClick={handleCheckout}
                    disabled={checking}
                    className={`flex h-11 w-full items-center justify-center gap-2 rounded-xl text-sm font-medium transition-all ${
                      plan.featured
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90"
                        : "border border-border bg-background hover:bg-accent"
                    } disabled:opacity-50`}
                  >
                    {checking ? "Redirecting..." : plan.cta}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                )}
              </motion.div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <p className="text-sm text-muted-foreground">
              All plans include a 14-day free trial. No credit card required.
              Cancel anytime.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

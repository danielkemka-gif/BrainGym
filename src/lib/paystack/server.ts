import { PLANS } from "./plans";
export { PLANS } from "./plans";
export type { PlanTier } from "./plans";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY ?? "";
const PAYSTACK_API = "https://api.paystack.co";

async function paystackRequest(
  method: string,
  path: string,
  body?: Record<string, unknown>
) {
  const url = `${PAYSTACK_API}${path}`;
  const res = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  return res.json();
}

export async function createPlanIfNotExists() {
  const plan = PLANS.premium;

  // Check if plan already exists
  const { data: existingPlans } = await paystackRequest(
    "GET",
    `/plan?perPage=50`
  );

  const existing = (existingPlans ?? []).find(
    (p: any) => p.name === plan.name
  );
  if (existing) return existing.plan_code;

  // Create new plan
  const { data, status } = await paystackRequest("POST", "/plan", {
    name: plan.name,
    amount: plan.amount,
    interval: plan.interval,
    currency: plan.currency,
    description: plan.description,
  });

  if (!status) throw new Error("Failed to create Paystack plan");
  return data.plan_code;
}

export async function initializeSubscription(
  email: string,
  planCode: string,
  callbackUrl: string
) {
  const { data, status } = await paystackRequest("POST", "/transaction/initialize", {
    email,
    plan: planCode,
    callback_url: callbackUrl,
    currency: PLANS.premium.currency,
  });

  if (!status) throw new Error("Failed to initialize payment");
  return {
    authorizationUrl: data.authorization_url,
    reference: data.reference,
    accessCode: data.access_code,
  };
}

export async function verifyTransaction(reference: string) {
  const { data, status } = await paystackRequest(
    "GET",
    `/transaction/verify/${reference}`
  );

  if (!status) throw new Error("Transaction verification failed");
  return data;
}

export async function listSubscriptions(customerCode: string) {
  const { data, status } = await paystackRequest(
    "GET",
    `/subscription?customer=${customerCode}&perPage=10`
  );

  if (!status) return [];
  return data ?? [];
}

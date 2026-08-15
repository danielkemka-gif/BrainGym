import { createClient } from "@/lib/supabase/client";

export function urlBase64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function isPushSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window
  );
}

export async function getRegistration(): Promise<ServiceWorkerRegistration | null> {
  if (!("serviceWorker" in navigator)) return null;
  let reg = (await navigator.serviceWorker.getRegistration()) ?? null;
  if (!reg) {
    await navigator.serviceWorker.register("/sw.js");
    reg = (await navigator.serviceWorker.getRegistration()) ?? null;
  }
  return reg;
}

export async function subscribeToPush(userId: string): Promise<boolean> {
  const supabase = createClient();
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  if (!isPushSupported() || !publicKey) return false;

  try {
    let permission = Notification.permission;
    if (permission === "default") {
      permission = await Notification.requestPermission();
    }
    if (permission !== "granted") return false;

    const reg = await getRegistration();
    if (!reg) return false;

    let sub = await reg.pushManager.getSubscription();
    if (!sub) {
      sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      });
    }

    const { error } = await supabase.from("push_subscriptions").upsert(
      {
        user_id: userId,
        endpoint: sub.endpoint,
        keys_json: JSON.stringify(sub.toJSON().keys ?? {}),
        user_agent: navigator.userAgent,
        last_seen_at: new Date().toISOString(),
      },
      { onConflict: "endpoint" }
    );
    return !error;
  } catch {
    return false;
  }
}

export async function unsubscribeFromPush(userId: string): Promise<boolean> {
  const supabase = createClient();
  try {
    const reg = await getRegistration();
    const sub = await reg?.pushManager.getSubscription();
    if (sub) {
      await supabase
        .from("push_subscriptions")
        .delete()
        .eq("user_id", userId)
        .eq("endpoint", sub.endpoint);
      await sub.unsubscribe();
    } else {
      await supabase.from("push_subscriptions").delete().eq("user_id", userId);
    }
    return true;
  } catch {
    return false;
  }
}

export async function getPushEnabled(userId: string): Promise<boolean> {
  const supabase = createClient();
  try {
    const reg = await getRegistration();
    const sub = await reg?.pushManager.getSubscription();
    if (!sub) return false;
    const { data } = await supabase
      .from("push_subscriptions")
      .select("id")
      .eq("user_id", userId)
      .eq("endpoint", sub.endpoint)
      .maybeSingle();
    return !!data;
  } catch {
    return false;
  }
}

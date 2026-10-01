import { Linking } from 'react-native';
import { isSupabaseConfigured, supabase } from './supabase';

// This URL is intentionally public configuration only. Merchant keys,
// passphrases and database credentials must never be Expo environment values.
const rawApiUrl = process.env.EXPO_PUBLIC_YAMI_API_URL || '';
const apiUrl = rawApiUrl.replace(/\/$/, '');

export const isYamiWalletApiConfigured = () =>
  /^https:\/\//i.test(apiUrl) && isSupabaseConfigured();

const makeIdempotencyKey = () =>
  globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;

async function getAccessToken() {
  if (!isYamiWalletApiConfigured()) return null;
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token || null;
}

async function request(path, { method = 'GET', body, idempotencyKey } = {}) {
  const token = await getAccessToken();
  if (!token) return { ok: false, unavailable: true, error: 'Sign in is required before using ANC Member Money.' };

  try {
    const response = await fetch(`${apiUrl}${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        ...(body ? { 'Content-Type': 'application/json' } : {}),
        ...(idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {}),
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
    const data = await response.json().catch(() => ({}));
    return response.ok
      ? { ok: true, data }
      : { ok: false, status: response.status, error: data.error || 'ANC Member Money is temporarily unavailable.' };
  } catch {
    return { ok: false, error: 'Cannot reach ANC Member Money. Please try again later.' };
  }
}

export async function provisionMemberWallet(user) {
  if (!isYamiWalletApiConfigured() || !user) return { ok: false, unavailable: true };
  const profile = user.user_metadata || {};
  return request('/api/v1/wallets/me/provision', {
    method: 'POST',
    body: {
      phoneNumber: profile.phone_number || user.phone || '',
      email: user.email || '',
      displayName: profile.full_name || '',
    },
  });
}

export const getMemberWallet = () => request('/api/v1/wallets/me');
export const getMemberWalletTransactions = () => request('/api/v1/wallets/me/transactions');

export async function createPayFastTopUp(amount) {
  const numericAmount = Number(amount);
  if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
    return { ok: false, error: 'Enter a valid top-up amount.' };
  }
  if (!isYamiWalletApiConfigured()) {
    return { ok: false, unavailable: true, error: 'PayFast is not configured for this app yet. No funds were added.' };
  }
  return request('/api/v1/payments/payfast/checkout', {
    method: 'POST',
    body: { amount: numericAmount },
    idempotencyKey: makeIdempotencyKey(),
  });
}

export async function openPayFastCheckout(checkoutLaunchUrl) {
  if (!checkoutLaunchUrl || !/^https:\/\//i.test(checkoutLaunchUrl)) {
    return { ok: false, error: 'Secure checkout could not be opened.' };
  }
  try {
    const supported = await Linking.canOpenURL(checkoutLaunchUrl);
    if (!supported) return { ok: false, error: 'This device cannot open the secure checkout.' };
    await Linking.openURL(checkoutLaunchUrl);
    return { ok: true };
  } catch {
    return { ok: false, error: 'Secure checkout could not be opened. Please try again.' };
  }
}

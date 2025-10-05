import { authClient } from "../lib/auth-client";

export const subscriptionService = {
  upgrade: async (data: {
    plan: string;
    annual?: boolean;
    successUrl: string;
    cancelUrl: string;
  }) => {
    return authClient.subscription.upgrade(data);
  },

  list: async (referenceId?: string) => {
    return authClient.subscription.list({ query: { referenceId } });
  },

  getActive: async () => {
    const response = await fetch('/api/subscriptions/active', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch active subscription');
    }

    return response.json();
  },

  cancel: async (data: {
    subscriptionId?: string;
    returnUrl: string;
  }) => {
    return authClient.subscription.cancel(data);
  },

  restore: async (data: {
    subscriptionId?: string;
  }) => {
    return authClient.subscription.restore(data);
  },

  billingPortal: async (data: {
    returnUrl?: string;
  }) => {
    return authClient.subscription.billingPortal(data);
  },
};
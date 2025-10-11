import { authClient } from "../lib/auth-client";

export const subscriptionService = {
  upgrade: async (data: {
    plan: string;
    annual?: boolean;
    subscriptionId?: string;
    metadata?: Record<string, any>;
    seats?: number;
    successUrl: string;
    cancelUrl: string;
    returnUrl?: string;
  }) => {
    const response = await fetch('/subscriptions/upgrade', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to upgrade subscription');
    }

    return response.json();
  },

  list: async (referenceId?: string) => {
    return authClient.subscription.list({ query: { referenceId } });
  },

  getActive: async () => {
    const response = await fetch('/subscriptions/active', {
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
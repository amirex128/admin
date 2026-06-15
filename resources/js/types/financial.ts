export type WalletTransactionTypeValue = 'credit' | 'debit';

export type WalletTransaction = {
    id: number;
    type: WalletTransactionTypeValue;
    type_label: string;
    reason: string;
    reason_label: string;
    amount: number;
    signed_amount: number;
    balance_after: number;
    description: string | null;
    performed_by?: string | null;
    created_at: string;
};

export type Plan = {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    price: number;
    discounted_price: number;
    billing_period: string;
    duration_days: number;
    features: string[];
    discount_percent: number | null;
    discount_badge: string | null;
    is_active: boolean;
    is_featured: boolean;
    sort_order: number;
    subscriptions_count?: number;
};

export type Subscription = {
    id: number;
    status: string;
    is_active: boolean;
    price_paid: number;
    starts_at: string | null;
    ends_at: string | null;
    created_at: string;
    plan?: Plan;
};

export type AdminUserRow = {
    id: number;
    name: string;
    phone: string;
    email: string | null;
    is_admin: boolean;
    balance: number;
    subscriptions_count: number;
    created_at: string;
};

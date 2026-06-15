export type Coupon = {
    id: number;
    code: string;
    type: string;
    type_label: string;
    value: number;
    min_order_amount: number | null;
    max_discount_amount: number | null;
    usage_limit: number | null;
    used_count: number;
    applies_to_all: boolean;
    starts_at: string | null;
    ends_at: string | null;
    is_active: boolean;
    is_valid: boolean;
    product_ids?: number[];
    products_count?: number;
    owner?: { id: number; name: string };
};

export type DiscountTypeOption = {
    value: string;
    label: string;
};

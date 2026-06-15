export type OrderItem = {
    id: number;
    product_id: number | null;
    name: string;
    sales_unit: string | null;
    sales_unit_label: string | null;
    unit_price: number;
    quantity: number;
    discount_percent: number;
    total: number;
};

export type OrderHistory = {
    id: number;
    status: string;
    status_label: string;
    note: string | null;
    created_at: string | null;
};

export type Order = {
    id: number;
    code: string;
    status: string;
    status_label: string;
    status_color: string;
    payment_status: string;
    payment_status_label: string;
    customer_name: string;
    customer_phone: string | null;
    province: string | null;
    city: string | null;
    address: string | null;
    shipping_method: string | null;
    shipping_method_label: string | null;
    payment_method: string | null;
    payment_method_label: string | null;
    tracking_code: string | null;
    subtotal: number;
    tax_percent: number;
    tax_amount: number;
    shipping_cost: number;
    total: number;
    note: string | null;
    items_count?: number;
    shipped_at: string | null;
    delivered_at: string | null;
    paid_at: string | null;
    created_at: string | null;
    items?: OrderItem[];
    histories?: OrderHistory[];
    owner?: { id: number; name: string; phone: string };
};

export type OrderStatusTab = {
    value: string;
    label: string;
    count: number;
};

export type OrderStatusOption = {
    value: string;
    label: string;
    color: string;
};

export type OrderFilterState = {
    status: string | null;
    search: string;
    city: string | null;
    shipping_method: string | null;
    payment_method: string | null;
    date_from: string | null;
    date_to: string | null;
    ship_from: string | null;
    ship_to: string | null;
    price_min: number | null;
    price_max: number | null;
    sort: string | null;
    user?: string | null;
};

export type OrderProductOption = {
    id: number;
    name: string;
    price: number;
    sales_unit: string;
};

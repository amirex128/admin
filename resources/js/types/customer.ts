export type Customer = {
    id: number;
    name: string;
    phone: string | null;
    email: string | null;
    national_code: string | null;
    province: string | null;
    city: string | null;
    address: string | null;
    postal_code: string | null;
    status: string;
    status_label: string;
    status_color: string;
    note: string | null;
    orders_count?: number;
    orders_total?: number;
    owner?: { id: number; name: string };
    created_at: string | null;
};

export type CustomerStatusOption = {
    value: string;
    label: string;
};

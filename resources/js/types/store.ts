export type GeoOption = {
    id: number;
    name: string;
};

export type ShippingMethodConfig = {
    enabled?: boolean;
    intra_cost?: number | string | null;
    inter_cost?: number | string | null;
};

export type StoreTemplateOption = {
    key: string;
    name: string;
    description: string;
    preview: string | null;
};

export type StoreFaq = {
    question: string;
    answer: string;
};

export type StoreBadge = {
    title: string;
    description: string;
    html: string;
    enabled: boolean;
};

export type StoreSocials = {
    telegram?: string | null;
    whatsapp?: string | null;
    instagram?: string | null;
    eitaa?: string | null;
    rubika?: string | null;
    bale?: string | null;
};

export type StoreSettings = {
    id: number;
    persian_name: string | null;
    business_type: string | null;
    store_phone: string | null;
    province_id: number | null;
    city_id: number | null;
    postal_code: string | null;
    latitude: string | null;
    longitude: string | null;
    socials: StoreSocials;
    about_us: string | null;
    buying_guide: string | null;
    return_policy: string | null;
    terms: string | null;
    faqs: StoreFaq[];
    badges: StoreBadge[];
    subdomain: string | null;
    custom_domain: string | null;
    domain_status: string;
    template: string;
    card_to_card_enabled: boolean;
    card_holder_name: string | null;
    card_number: string | null;
    sheba_number: string | null;
    zarinpal_enabled: boolean;
    zarinpal_merchant_id: string | null;
    zarinpal_access_token: string | null;
    vat_percent: number;
    refund_window_minutes: number;
    shipping_methods: Record<string, ShippingMethodConfig>;
    intra_city_days: number;
    inter_city_days: number;
};

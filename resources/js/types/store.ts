export type GeoOption = {
    id: number;
    name: string;
};

export type ShippingMethodConfig = {
    enabled?: boolean;
    intra_cost?: number | string | null;
    inter_cost?: number | string | null;
};

export type StoreSettings = {
    id: number;
    province_id: number | null;
    city_id: number | null;
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

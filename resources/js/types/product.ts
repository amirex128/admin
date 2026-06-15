export type MediaItem = {
    id: number;
    collection: 'image' | 'video' | 'editor';
    url: string;
    original_name: string | null;
    mime_type: string | null;
    size: number;
    sort_order: number;
};

export type Category = {
    id: number;
    parent_id: number | null;
    name: string;
    slug: string;
    parent_name?: string | null;
    products_count?: number;
};

export type PackagingType = {
    id: number;
    name: string;
    description: string | null;
};

export type ProductAttribute = {
    id: number;
    name: string;
    values: { id: number; value: string }[];
};

export type ProductVariation = {
    id: number;
    name: string;
    sku: string | null;
    price: number;
    discounted_price: number;
    stock: number;
    discount_percent: number | null;
    is_active: boolean;
    variation_attributes: Record<string, string> | null;
    images: MediaItem[];
};

export type Product = {
    id: number;
    parent_id: number | null;
    user_id: number;
    name: string;
    sku: string | null;
    description: string | null;
    weight: number | null;
    sales_unit: string;
    sales_unit_label: string;
    is_special_offer: boolean;
    order_mode: string;
    order_mode_label: string;
    is_active: boolean;
    price: number;
    discounted_price: number;
    stock: number;
    discount_percent: number | null;
    variation_attributes: Record<string, string> | null;
    category_id: number | null;
    packaging_type_id: number | null;
    category?: Category | null;
    packaging_type?: PackagingType | null;
    owner?: { id: number; name: string };
    images: MediaItem[];
    video?: MediaItem | null;
    attributes?: ProductAttribute[];
    variations?: Product[];
    variations_count?: number;
    created_at: string | null;
};

export type SelectOption = {
    value: string;
    label: string;
};

export type AiModel = {
    id: number;
    name: string;
    provider: string;
    model_identifier: string;
    description: string | null;
    price_per_1k_tokens: number;
    is_active: boolean;
    sort_order: number;
    users_count?: number;
};

export type ImportField = {
    key: string;
    label: string;
    required: boolean;
};

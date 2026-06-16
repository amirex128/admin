export type StorefrontSocials = Record<string, string | null>;

export type StorefrontBadge = {
    title: string;
    description: string;
    html: string;
    enabled: boolean;
};

export type StorefrontStore = {
    key: string;
    name: string;
    business_type: string | null;
    phone: string | null;
    address: string;
    socials: StorefrontSocials;
    badges: StorefrontBadge[];
    categories: { id: number; name: string }[];
    customer: { id: number; name: string } | null;
    pages: Record<string, boolean>;
};

export type CartItem = {
    product_id: number;
    name: string;
    price: number;
    quantity: number;
    image: string | null;
};

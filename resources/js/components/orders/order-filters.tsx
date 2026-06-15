import { router } from '@inertiajs/react';
import { Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatToman } from '@/lib/format';
import type { OrderFilterState, OrderStatusTab, SelectOption } from '@/types';

const ALL = '__all__';

type SortOption = { value: string; label: string };

const SORT_OPTIONS: SortOption[] = [
    { value: 'newest', label: 'جدیدترین' },
    { value: 'oldest', label: 'قدیمی‌ترین' },
    { value: 'cheapest', label: 'ارزان‌ترین' },
    { value: 'expensive', label: 'گران‌ترین' },
];

/**
 * Status tabs + advanced filters for the order list, shared by the seller and
 * admin order pages.
 */
export function OrderFilters({
    indexUrl,
    filters,
    statusTabs,
    shippingMethods,
    paymentMethods,
    showUserFilter = false,
}: {
    indexUrl: string;
    filters: OrderFilterState;
    statusTabs: OrderStatusTab[];
    shippingMethods: SelectOption[];
    paymentMethods: SelectOption[];
    showUserFilter?: boolean;
}) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [city, setCity] = useState(filters.city ?? '');
    const [user, setUser] = useState(filters.user ?? '');

    function apply(overrides: Partial<OrderFilterState>) {
        const next: Record<string, string | number> = {};
        const merged = { ...filters, search, city, user, ...overrides };

        for (const [key, value] of Object.entries(merged)) {
            if (value !== null && value !== undefined && value !== '') {
                next[key] = value as string | number;
            }
        }

        router.get(indexUrl, next, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    }

    useEffect(() => {
        const current = filters.search ?? '';
        const currentCity = filters.city ?? '';
        const currentUser = filters.user ?? '';

        if (
            search === current &&
            city === currentCity &&
            user === currentUser
        ) {
            return;
        }

        const timeout = setTimeout(() => apply({}), 400);

        return () => clearTimeout(timeout);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search, city, user]);

    const activeTab = filters.status ?? 'all';

    const hasAdvanced = Boolean(
        filters.shipping_method ||
        filters.payment_method ||
        filters.date_from ||
        filters.date_to ||
        filters.ship_from ||
        filters.ship_to ||
        filters.price_min ||
        filters.price_max ||
        filters.sort,
    );

    return (
        <div className="flex flex-col gap-4">
            <Tabs
                defaultValue={activeTab}
                value={activeTab}
                onValueChange={(value) =>
                    apply({ status: value === 'all' ? null : value })
                }
            >
                <TabsList className="h-auto flex-wrap justify-start gap-1">
                    {statusTabs.map((tab) => (
                        <TabsTrigger
                            key={tab.value}
                            value={tab.value}
                            className="flex-none gap-1.5"
                        >
                            {tab.label}
                            <span className="rounded bg-background/60 px-1 text-[10px] tabular-nums">
                                {formatToman(tab.count)}
                            </span>
                        </TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>

            <div className="flex flex-wrap items-end gap-3">
                <div className="relative max-w-xs flex-1">
                    <Search className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="جستجو بر اساس کد یا نام سفارش‌دهنده"
                        className="pr-9"
                    />
                </div>

                {showUserFilter && (
                    <Input
                        value={user}
                        onChange={(event) => setUser(event.target.value)}
                        placeholder="کاربر (نام، موبایل یا شناسه)"
                        className="w-56"
                    />
                )}

                <Input
                    value={city}
                    onChange={(event) => setCity(event.target.value)}
                    placeholder="شهر"
                    className="w-32"
                />

                <FilterSelect
                    value={filters.shipping_method}
                    onChange={(value) => apply({ shipping_method: value })}
                    options={shippingMethods}
                    placeholder="روش ارسال"
                />

                <FilterSelect
                    value={filters.payment_method}
                    onChange={(value) => apply({ payment_method: value })}
                    options={paymentMethods}
                    placeholder="روش پرداخت"
                />

                <Select
                    value={filters.sort ?? ALL}
                    onValueChange={(value) =>
                        apply({ sort: value === ALL ? null : value })
                    }
                >
                    <SelectTrigger className="w-36">
                        <SelectValue placeholder="مرتب‌سازی" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value={ALL}>پیش‌فرض</SelectItem>
                        {SORT_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="flex flex-wrap items-end gap-4">
                <DateRange
                    label="تاریخ ثبت"
                    from={filters.date_from}
                    to={filters.date_to}
                    onFrom={(value) => apply({ date_from: value })}
                    onTo={(value) => apply({ date_to: value })}
                />
                <DateRange
                    label="تاریخ ارسال"
                    from={filters.ship_from}
                    to={filters.ship_to}
                    onFrom={(value) => apply({ ship_from: value })}
                    onTo={(value) => apply({ ship_to: value })}
                />
                <div className="flex flex-col gap-1.5">
                    <Label className="text-xs text-muted-foreground">
                        بازه قیمت (تومان)
                    </Label>
                    <div className="flex items-center gap-2">
                        <Input
                            type="number"
                            min={0}
                            value={filters.price_min ?? ''}
                            onChange={(event) =>
                                apply({
                                    price_min: event.target.value
                                        ? Number(event.target.value)
                                        : null,
                                })
                            }
                            placeholder="از"
                            className="w-28"
                        />
                        <Input
                            type="number"
                            min={0}
                            value={filters.price_max ?? ''}
                            onChange={(event) =>
                                apply({
                                    price_max: event.target.value
                                        ? Number(event.target.value)
                                        : null,
                                })
                            }
                            placeholder="تا"
                            className="w-28"
                        />
                    </div>
                </div>

                {(hasAdvanced || filters.search || filters.city) && (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1.5"
                        onClick={() => {
                            setSearch('');
                            setCity('');
                            setUser('');
                            router.get(
                                indexUrl,
                                filters.status && filters.status !== 'all'
                                    ? { status: filters.status }
                                    : {},
                                {
                                    preserveState: true,
                                    preserveScroll: true,
                                    replace: true,
                                },
                            );
                        }}
                    >
                        <X className="size-4" />
                        پاک کردن فیلترها
                    </Button>
                )}
            </div>
        </div>
    );
}

function FilterSelect({
    value,
    onChange,
    options,
    placeholder,
}: {
    value: string | null;
    onChange: (value: string | null) => void;
    options: SelectOption[];
    placeholder: string;
}) {
    return (
        <Select
            value={value ?? ALL}
            onValueChange={(next) => onChange(next === ALL ? null : next)}
        >
            <SelectTrigger className="w-36">
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value={ALL}>{placeholder}</SelectItem>
                {options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                        {option.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}

function DateRange({
    label,
    from,
    to,
    onFrom,
    onTo,
}: {
    label: string;
    from: string | null;
    to: string | null;
    onFrom: (value: string | null) => void;
    onTo: (value: string | null) => void;
}) {
    return (
        <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-muted-foreground">{label}</Label>
            <div className="flex items-center gap-2" dir="ltr">
                <Input
                    type="date"
                    value={from ?? ''}
                    onChange={(event) => onFrom(event.target.value || null)}
                    className="w-36"
                />
                <Input
                    type="date"
                    value={to ?? ''}
                    onChange={(event) => onTo(event.target.value || null)}
                    className="w-36"
                />
            </div>
        </div>
    );
}

import { router, useForm } from '@inertiajs/react';
import { CreditCard, MapPin, Percent, Truck } from 'lucide-react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { GeoOption, StoreSettings } from '@/types';

const SHIPPING_LABELS: Record<string, string> = {
    tipax: 'تیپاکس',
    post: 'پست',
    courier: 'پیک',
};

type MethodForm = {
    enabled: boolean;
    intra_cost: string;
    inter_cost: string;
};

type StoreForm = {
    province_id: number | null;
    city_id: number | null;
    card_to_card_enabled: boolean;
    card_holder_name: string;
    card_number: string;
    sheba_number: string;
    zarinpal_enabled: boolean;
    zarinpal_merchant_id: string;
    zarinpal_access_token: string;
    vat_percent: string;
    refund_window_minutes: string;
    intra_city_days: string;
    inter_city_days: string;
    shipping_methods: Record<string, MethodForm>;
};

/**
 * Shared store settings form with vertical tabs, reused by the seller settings
 * page and the admin user hub.
 */
export function StoreSettingsForm({
    settings,
    provinces,
    cities,
    shippingMethods,
    updateUrl,
}: {
    settings: StoreSettings;
    provinces: GeoOption[];
    cities: GeoOption[];
    shippingMethods: string[];
    updateUrl: string;
}) {
    const form = useForm<StoreForm>({
        province_id: settings.province_id,
        city_id: settings.city_id,
        card_to_card_enabled: settings.card_to_card_enabled,
        card_holder_name: settings.card_holder_name ?? '',
        card_number: settings.card_number ?? '',
        sheba_number: settings.sheba_number ?? '',
        zarinpal_enabled: settings.zarinpal_enabled,
        zarinpal_merchant_id: settings.zarinpal_merchant_id ?? '',
        zarinpal_access_token: settings.zarinpal_access_token ?? '',
        vat_percent: String(settings.vat_percent ?? 0),
        refund_window_minutes: String(settings.refund_window_minutes ?? 30),
        intra_city_days: String(settings.intra_city_days ?? 1),
        inter_city_days: String(settings.inter_city_days ?? 3),
        shipping_methods: Object.fromEntries(
            shippingMethods.map((method) => {
                const config = settings.shipping_methods?.[method] ?? {};

                return [
                    method,
                    {
                        enabled: Boolean(config.enabled),
                        intra_cost: String(config.intra_cost ?? ''),
                        inter_cost: String(config.inter_cost ?? ''),
                    },
                ];
            }),
        ),
    });

    function changeProvince(provinceId: number | null) {
        form.setData('province_id', provinceId);
        form.setData('city_id', null);

        router.reload({
            only: ['cities'],
            data: { province_id: provinceId ?? undefined },
        });
    }

    function setMethod(method: string, patch: Partial<MethodForm>) {
        form.setData('shipping_methods', {
            ...form.data.shipping_methods,
            [method]: { ...form.data.shipping_methods[method], ...patch },
        });
    }

    function submit(event: React.FormEvent) {
        event.preventDefault();
        form.put(updateUrl, { preserveScroll: true });
    }

    return (
        <form onSubmit={submit}>
            <Tabs
                defaultValue="location"
                className="flex-row items-start gap-6"
            >
                <TabsList className="h-auto w-52 shrink-0 flex-col gap-1 bg-transparent p-0">
                    <TabTrigger
                        value="location"
                        icon={<MapPin className="size-4" />}
                    >
                        موقعیت فروشگاه
                    </TabTrigger>
                    <TabTrigger
                        value="payment"
                        icon={<CreditCard className="size-4" />}
                    >
                        پرداخت
                    </TabTrigger>
                    <TabTrigger
                        value="shipping"
                        icon={<Truck className="size-4" />}
                    >
                        ارسال
                    </TabTrigger>
                    <TabTrigger
                        value="finance"
                        icon={<Percent className="size-4" />}
                    >
                        مالی و مالیات
                    </TabTrigger>
                </TabsList>

                <div className="flex-1 space-y-6">
                    <TabsContent value="location">
                        <Card>
                            <CardHeader>
                                <CardTitle>موقعیت فروشگاه</CardTitle>
                                <CardDescription>
                                    استان و شهر فروشگاه برای تشخیص ارسال
                                    درون‌شهری یا برون‌شهری استفاده می‌شود.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-4 sm:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label>استان</Label>
                                    <Select
                                        value={
                                            form.data.province_id
                                                ? String(form.data.province_id)
                                                : undefined
                                        }
                                        onValueChange={(value) =>
                                            changeProvince(Number(value))
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="انتخاب استان" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {provinces.map((province) => (
                                                <SelectItem
                                                    key={province.id}
                                                    value={String(province.id)}
                                                >
                                                    {province.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError
                                        message={form.errors.province_id}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label>شهر</Label>
                                    <Select
                                        value={
                                            form.data.city_id
                                                ? String(form.data.city_id)
                                                : undefined
                                        }
                                        onValueChange={(value) =>
                                            form.setData(
                                                'city_id',
                                                Number(value),
                                            )
                                        }
                                        disabled={cities.length === 0}
                                    >
                                        <SelectTrigger>
                                            <SelectValue
                                                placeholder={
                                                    cities.length === 0
                                                        ? 'ابتدا استان را انتخاب کنید'
                                                        : 'انتخاب شهر'
                                                }
                                            />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {cities.map((city) => (
                                                <SelectItem
                                                    key={city.id}
                                                    value={String(city.id)}
                                                >
                                                    {city.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={form.errors.city_id} />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="payment">
                        <Card>
                            <CardHeader>
                                <CardTitle>کارت به کارت</CardTitle>
                                <CardDescription>
                                    دریافت وجه از طریق شماره کارت یا شبا.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <ToggleRow
                                    label="فعال‌سازی کارت به کارت"
                                    checked={form.data.card_to_card_enabled}
                                    onChange={(value) =>
                                        form.setData(
                                            'card_to_card_enabled',
                                            value,
                                        )
                                    }
                                />
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <TextField
                                        label="نام صاحب حساب"
                                        value={form.data.card_holder_name}
                                        onChange={(value) =>
                                            form.setData(
                                                'card_holder_name',
                                                value,
                                            )
                                        }
                                    />
                                    <TextField
                                        label="شماره کارت"
                                        value={form.data.card_number}
                                        onChange={(value) =>
                                            form.setData('card_number', value)
                                        }
                                        ltr
                                    />
                                    <TextField
                                        label="شماره شبا"
                                        value={form.data.sheba_number}
                                        onChange={(value) =>
                                            form.setData('sheba_number', value)
                                        }
                                        ltr
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="mt-6">
                            <CardHeader>
                                <CardTitle>درگاه اختصاصی زرین‌پال</CardTitle>
                                <CardDescription>
                                    درگاه پرداخت فروشگاه شما؛ مستقل از درگاه
                                    شارژ کیف پول پلتفرم.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <ToggleRow
                                    label="فعال‌سازی درگاه زرین‌پال فروشگاه"
                                    checked={form.data.zarinpal_enabled}
                                    onChange={(value) =>
                                        form.setData('zarinpal_enabled', value)
                                    }
                                />
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <TextField
                                        label="مرچنت کد"
                                        value={form.data.zarinpal_merchant_id}
                                        onChange={(value) =>
                                            form.setData(
                                                'zarinpal_merchant_id',
                                                value,
                                            )
                                        }
                                        ltr
                                    />
                                    <TextField
                                        label="توکن دسترسی (Access Token)"
                                        value={form.data.zarinpal_access_token}
                                        onChange={(value) =>
                                            form.setData(
                                                'zarinpal_access_token',
                                                value,
                                            )
                                        }
                                        ltr
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="shipping">
                        <Card>
                            <CardHeader>
                                <CardTitle>روش‌های ارسال</CardTitle>
                                <CardDescription>
                                    هزینه ارسال درون‌شهری و برون‌شهری هر روش را
                                    تعیین کنید.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-5">
                                {shippingMethods.map((method) => {
                                    const config =
                                        form.data.shipping_methods[method];

                                    return (
                                        <div
                                            key={method}
                                            className="rounded-lg border p-4"
                                        >
                                            <ToggleRow
                                                label={
                                                    SHIPPING_LABELS[method] ??
                                                    method
                                                }
                                                checked={config.enabled}
                                                onChange={(value) =>
                                                    setMethod(method, {
                                                        enabled: value,
                                                    })
                                                }
                                            />
                                            {config.enabled && (
                                                <div className="mt-3 grid gap-4 sm:grid-cols-2">
                                                    <NumberField
                                                        label="هزینه درون‌شهری"
                                                        value={
                                                            config.intra_cost
                                                        }
                                                        onChange={(value) =>
                                                            setMethod(method, {
                                                                intra_cost:
                                                                    value,
                                                            })
                                                        }
                                                    />
                                                    <NumberField
                                                        label="هزینه برون‌شهری"
                                                        value={
                                                            config.inter_cost
                                                        }
                                                        onChange={(value) =>
                                                            setMethod(method, {
                                                                inter_cost:
                                                                    value,
                                                            })
                                                        }
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </CardContent>
                        </Card>

                        <Card className="mt-6">
                            <CardHeader>
                                <CardTitle>زمان‌بندی ارسال</CardTitle>
                                <CardDescription>
                                    سفارش‌های درون‌شهری و برون‌شهری چند روز کاری
                                    ارسال می‌شوند.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-4 sm:grid-cols-2">
                                <NumberField
                                    label="ارسال درون‌شهری (روز کاری)"
                                    value={form.data.intra_city_days}
                                    onChange={(value) =>
                                        form.setData('intra_city_days', value)
                                    }
                                />
                                <NumberField
                                    label="ارسال برون‌شهری (روز کاری)"
                                    value={form.data.inter_city_days}
                                    onChange={(value) =>
                                        form.setData('inter_city_days', value)
                                    }
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="finance">
                        <Card>
                            <CardHeader>
                                <CardTitle>مالیات و قوانین مالی</CardTitle>
                                <CardDescription>
                                    درصد مالیات بر ارزش افزوده و بازه بازگشت وجه
                                    بدون کارمزد.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-4 sm:grid-cols-2">
                                <NumberField
                                    label="درصد مالیات بر ارزش افزوده"
                                    value={form.data.vat_percent}
                                    onChange={(value) =>
                                        form.setData('vat_percent', value)
                                    }
                                />
                                <NumberField
                                    label="بازگشت وجه بدون کارمزد (دقیقه)"
                                    value={form.data.refund_window_minutes}
                                    onChange={(value) =>
                                        form.setData(
                                            'refund_window_minutes',
                                            value,
                                        )
                                    }
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <div className="flex justify-end">
                        <Button type="submit" disabled={form.processing}>
                            ذخیره تنظیمات
                        </Button>
                    </div>
                </div>
            </Tabs>
        </form>
    );
}

function TabTrigger({
    value,
    icon,
    children,
}: {
    value: string;
    icon: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <TabsTrigger
            value={value}
            className="w-full justify-start gap-2 data-[state=active]:bg-muted"
        >
            {icon}
            {children}
        </TabsTrigger>
    );
}

function ToggleRow({
    label,
    checked,
    onChange,
}: {
    label: string;
    checked: boolean;
    onChange: (value: boolean) => void;
}) {
    return (
        <div className="flex items-center justify-between gap-4">
            <Label className="cursor-pointer">{label}</Label>
            <Switch checked={checked} onCheckedChange={onChange} />
        </div>
    );
}

function TextField({
    label,
    value,
    onChange,
    ltr = false,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    ltr?: boolean;
}) {
    return (
        <div className="grid gap-2">
            <Label>{label}</Label>
            <Input
                value={value}
                onChange={(event) => onChange(event.target.value)}
                dir={ltr ? 'ltr' : undefined}
            />
        </div>
    );
}

function NumberField({
    label,
    value,
    onChange,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
}) {
    return (
        <div className="grid gap-2">
            <Label>{label}</Label>
            <Input
                type="number"
                min={0}
                value={value}
                onChange={(event) => onChange(event.target.value)}
            />
        </div>
    );
}

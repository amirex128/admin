import { Plus, Trash2 } from 'lucide-react';

import { RichTextEditor } from '@/components/products/rich-text-editor';
import type { StoreForm } from '@/components/settings/store-settings-form';
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
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import type { StoreBadge, StoreFaq, StoreTemplateOption } from '@/types';

type SetField = <K extends keyof StoreForm>(key: K, value: StoreForm[K]) => void;

type TabProps = {
    data: StoreForm;
    setField: SetField;
};

const SOCIAL_FIELDS: { key: string; label: string }[] = [
    { key: 'telegram', label: 'تلگرام' },
    { key: 'whatsapp', label: 'واتس‌اپ' },
    { key: 'instagram', label: 'اینستاگرام' },
    { key: 'eitaa', label: 'ایتا' },
    { key: 'rubika', label: 'روبیکا' },
    { key: 'bale', label: 'بله' },
];

/**
 * General store identity & contact information used across the storefront.
 */
export function StoreInfoTab({ data, setField }: TabProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>اطلاعات فروشگاه</CardTitle>
                <CardDescription>
                    این اطلاعات در فروشگاه اینترنتی شما نمایش داده می‌شود.
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
                <Text label="نام فارسی فروشگاه" value={data.persian_name} onChange={(v) => setField('persian_name', v)} />
                <Text label="نوع خدمات / کالا" value={data.business_type} onChange={(v) => setField('business_type', v)} />
                <Text label="تلفن فروشگاه" value={data.store_phone} onChange={(v) => setField('store_phone', v)} ltr />
                <Text label="کد پستی (اختیاری)" value={data.postal_code} onChange={(v) => setField('postal_code', v)} ltr />
                <Text label="عرض جغرافیایی (map.ir)" value={data.latitude} onChange={(v) => setField('latitude', v)} ltr />
                <Text label="طول جغرافیایی (map.ir)" value={data.longitude} onChange={(v) => setField('longitude', v)} ltr />
                <p className="text-xs text-muted-foreground sm:col-span-2">
                    موقعیت مکانی را می‌توانید از نقشه map.ir کپی کرده و مختصات آن
                    را اینجا وارد کنید.
                </p>
            </CardContent>
        </Card>
    );
}

/**
 * Social network links shown in the storefront header/footer.
 */
export function StoreSocialsTab({ data, setField }: TabProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>شبکه‌های اجتماعی</CardTitle>
                <CardDescription>
                    نشانی صفحات شبکه‌های اجتماعی فروشگاه.
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
                {SOCIAL_FIELDS.map((social) => (
                    <Text
                        key={social.key}
                        label={social.label}
                        value={data.socials[social.key] ?? ''}
                        onChange={(v) =>
                            setField('socials', {
                                ...data.socials,
                                [social.key]: v,
                            })
                        }
                        ltr
                    />
                ))}
            </CardContent>
        </Card>
    );
}

/**
 * Rich-text content pages plus a managed FAQ list.
 */
export function StoreContentTab({ data, setField }: TabProps) {
    const pages: { key: keyof StoreForm; label: string }[] = [
        { key: 'about_us', label: 'درباره ما' },
        { key: 'buying_guide', label: 'راهنمای خرید' },
        { key: 'return_policy', label: 'شرایط بازگشت (مرجوعی)' },
        { key: 'terms', label: 'قوانین و مقررات' },
    ];

    function addFaq() {
        setField('faqs', [...data.faqs, { question: '', answer: '' }]);
    }

    function updateFaq(index: number, patch: Partial<StoreFaq>) {
        setField(
            'faqs',
            data.faqs.map((faq, i) => (i === index ? { ...faq, ...patch } : faq)),
        );
    }

    function removeFaq(index: number) {
        setField(
            'faqs',
            data.faqs.filter((_, i) => i !== index),
        );
    }

    return (
        <div className="space-y-6">
            {pages.map((page) => (
                <Card key={page.key}>
                    <CardHeader>
                        <CardTitle>{page.label}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <RichTextEditor
                            value={(data[page.key] as string) ?? ''}
                            onChange={(html) => setField(page.key, html as never)}
                            hasAiModel={false}
                        />
                    </CardContent>
                </Card>
            ))}

            <Card>
                <CardHeader className="flex-row items-center justify-between">
                    <div>
                        <CardTitle>سوالات متداول</CardTitle>
                        <CardDescription>
                            پرسش‌های پرتکرار مشتریان را اضافه کنید.
                        </CardDescription>
                    </div>
                    <Button type="button" onClick={addFaq} className="gap-1.5">
                        <Plus className="size-4" />
                        افزودن سوال
                    </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                    {data.faqs.length === 0 && (
                        <p className="text-sm text-muted-foreground">
                            هنوز سوالی اضافه نشده است.
                        </p>
                    )}
                    {data.faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="space-y-2 rounded-lg border p-3"
                        >
                            <div className="flex items-center gap-2">
                                <Input
                                    value={faq.question}
                                    onChange={(e) =>
                                        updateFaq(index, {
                                            question: e.target.value,
                                        })
                                    }
                                    placeholder="پرسش"
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeFaq(index)}
                                    className="text-destructive hover:text-destructive"
                                >
                                    <Trash2 className="size-4" />
                                </Button>
                            </div>
                            <Textarea
                                value={faq.answer}
                                onChange={(e) =>
                                    updateFaq(index, { answer: e.target.value })
                                }
                                placeholder="پاسخ"
                                rows={2}
                            />
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}

/**
 * Trust badges / licenses entered as embeddable HTML snippets.
 */
export function StoreBadgesTab({ data, setField }: TabProps) {
    function addBadge() {
        setField('badges', [
            ...data.badges,
            { title: '', description: '', html: '', enabled: true },
        ]);
    }

    function updateBadge(index: number, patch: Partial<StoreBadge>) {
        setField(
            'badges',
            data.badges.map((badge, i) =>
                i === index ? { ...badge, ...patch } : badge,
            ),
        );
    }

    function removeBadge(index: number) {
        setField(
            'badges',
            data.badges.filter((_, i) => i !== index),
        );
    }

    return (
        <Card>
            <CardHeader className="flex-row items-center justify-between">
                <div>
                    <CardTitle>نمادها و مجوزها</CardTitle>
                    <CardDescription>
                        نماد اعتماد الکترونیک، مجوز اتحادیه کسب‌وکارهای مجازی،
                        ساماندهی و ... را به‌صورت کد HTML اضافه کنید.
                    </CardDescription>
                </div>
                <Button type="button" onClick={addBadge} className="gap-1.5">
                    <Plus className="size-4" />
                    افزودن نماد
                </Button>
            </CardHeader>
            <CardContent className="space-y-4">
                {data.badges.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                        هنوز نمادی اضافه نشده است.
                    </p>
                )}
                {data.badges.map((badge, index) => (
                    <div key={index} className="space-y-3 rounded-lg border p-4">
                        <div className="flex items-center justify-between gap-2">
                            <Input
                                value={badge.title}
                                onChange={(e) =>
                                    updateBadge(index, { title: e.target.value })
                                }
                                placeholder="عنوان نماد"
                                className="max-w-sm"
                            />
                            <div className="flex items-center gap-2">
                                <Label className="text-sm">فعال</Label>
                                <Switch
                                    checked={badge.enabled}
                                    onCheckedChange={(checked) =>
                                        updateBadge(index, { enabled: checked })
                                    }
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeBadge(index)}
                                    className="text-destructive hover:text-destructive"
                                >
                                    <Trash2 className="size-4" />
                                </Button>
                            </div>
                        </div>
                        <Textarea
                            value={badge.description}
                            onChange={(e) =>
                                updateBadge(index, {
                                    description: e.target.value,
                                })
                            }
                            placeholder="توضیح کوتاه"
                            rows={2}
                        />
                        <Textarea
                            value={badge.html}
                            onChange={(e) =>
                                updateBadge(index, { html: e.target.value })
                            }
                            placeholder="کد HTML نماد (مثلاً اسکریپت یا تصویر نماد اعتماد)"
                            rows={3}
                            dir="ltr"
                        />
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}

/**
 * Domain & template selection with a DNS connection guide for custom domains.
 */
export function StoreDomainTab({
    data,
    setField,
    templates,
    baseDomain,
    nameservers,
    domainStatus,
}: TabProps & {
    templates: StoreTemplateOption[];
    baseDomain: string;
    nameservers: string[];
    domainStatus: string;
}) {
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>آدرس فروشگاه</CardTitle>
                    <CardDescription>
                        از ساب‌دامنه رایگان ما استفاده کنید یا دامنه اختصاصی خود
                        را متصل کنید.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <Label>ساب‌دامنه</Label>
                        <div className="flex items-center gap-2" dir="ltr">
                            <Input
                                value={data.subdomain}
                                onChange={(e) =>
                                    setField(
                                        'subdomain',
                                        e.target.value.toLowerCase(),
                                    )
                                }
                                placeholder="myshop"
                                className="max-w-xs"
                            />
                            <span className="text-muted-foreground">
                                .{baseDomain}
                            </span>
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label>دامنه اختصاصی</Label>
                        <Input
                            value={data.custom_domain}
                            onChange={(e) =>
                                setField(
                                    'custom_domain',
                                    e.target.value.toLowerCase(),
                                )
                            }
                            placeholder="shop.example.com"
                            dir="ltr"
                            className="max-w-sm"
                        />
                        <p className="text-xs text-muted-foreground">
                            وضعیت اتصال:{' '}
                            {domainStatus === 'connected'
                                ? 'متصل'
                                : domainStatus === 'pending'
                                  ? 'در انتظار تأیید DNS'
                                  : 'متصل نشده'}
                        </p>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>راهنمای اتصال دامنه اختصاصی</CardTitle>
                    <CardDescription>
                        برای اتصال دامنه اختصاصی مراحل زیر را انجام دهید.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Step number={1} title="خرید دامنه">
                        اگر دامنه ندارید، آن را از یکی از ارائه‌دهندگان دامنه
                        خریداری کنید (پارس‌پک، ایران‌سرور، هاست ایران و ...).
                    </Step>
                    <Step number={2} title="تنظیم نیم‌سرورها">
                        نیم‌سرورهای زیر را در پنل ثبت‌کننده دامنه وارد و ذخیره
                        کنید.
                        <div className="mt-2 space-y-1" dir="ltr">
                            {nameservers.map((ns, index) => (
                                <div
                                    key={ns}
                                    className="flex items-center justify-between rounded-md border bg-muted/40 px-3 py-1.5 text-sm"
                                >
                                    <span>{ns}</span>
                                    <span className="text-xs text-muted-foreground">
                                        NS{index + 1}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </Step>
                    <Step number={3} title="پرداخت هزینه میزبانی">
                        شارژ کیف پول بابت میزبانی سالانه دامنه (این مبلغ به
                        شرکت‌های زیرساختی پرداخت می‌شود).
                    </Step>
                    <Step number={4} title="ثبت درخواست اتصال">
                        پس از اعمال تنظیمات، دامنه اختصاصی را در همین بخش وارد و
                        تنظیمات را ذخیره کنید تا درخواست اتصال ثبت شود.
                    </Step>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>قالب فروشگاه</CardTitle>
                    <CardDescription>
                        قالب نمایش فروشگاه خود را انتخاب کنید.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2">
                    {templates.map((template) => (
                        <button
                            key={template.key}
                            type="button"
                            onClick={() => setField('template', template.key)}
                            className={`rounded-lg border p-4 text-right transition hover:border-primary ${
                                data.template === template.key
                                    ? 'border-primary ring-1 ring-primary'
                                    : ''
                            }`}
                        >
                            <span className="font-medium">{template.name}</span>
                            <p className="mt-1 text-xs text-muted-foreground">
                                {template.description}
                            </p>
                        </button>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}

function Step({
    number,
    title,
    children,
}: {
    number: number;
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div className="flex gap-3">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                {number}
            </span>
            <div className="space-y-1">
                <p className="text-sm font-medium">{title}</p>
                <div className="text-sm text-muted-foreground">{children}</div>
            </div>
        </div>
    );
}

function Text({
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
                onChange={(e) => onChange(e.target.value)}
                dir={ltr ? 'ltr' : undefined}
            />
        </div>
    );
}

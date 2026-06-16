import { Layers, Plus, Trash2, Upload } from 'lucide-react';
import { useState } from 'react';

import { HelpTooltip } from '@/components/help-tooltip';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import type { MediaItem } from '@/types';

export type AttributeDraft = {
    name: string;
    values: string[];
};

export type VariationDraft = {
    id?: number;
    sku: string;
    price: string;
    stock: string;
    discount_percent: string;
    is_active: boolean;
    variation_attributes: Record<string, string>;
    image: File | null;
    existingImage?: MediaItem | null;
    remove_image: boolean;
};

export function emptyVariation(
    attributeName: string,
    value: string,
): VariationDraft {
    return {
        sku: '',
        price: '',
        stock: '0',
        discount_percent: '',
        is_active: true,
        variation_attributes: { [attributeName]: value },
        image: null,
        existingImage: null,
        remove_image: false,
    };
}

/**
 * Inline variation builder: the seller adds an attribute (e.g. «گارانتی»),
 * then types each value (e.g. «یک ساله»). Adding a value immediately reveals an
 * inline card right beneath it where price, stock, discount, the variation's own
 * product SKU and image are entered — because every variation is itself a
 * product record in the system.
 */
export function VariationsManager({
    attributes,
    onAttributesChange,
    variations,
    onVariationsChange,
}: {
    attributes: AttributeDraft[];
    onAttributesChange: (attributes: AttributeDraft[]) => void;
    variations: VariationDraft[];
    onVariationsChange: (variations: VariationDraft[]) => void;
}) {
    const [attributeName, setAttributeName] = useState('');
    const [valueInputs, setValueInputs] = useState<Record<number, string>>({});

    function findVariationIndex(name: string, value: string): number {
        return variations.findIndex(
            (variation) => variation.variation_attributes[name] === value,
        );
    }

    function addAttribute() {
        const name = attributeName.trim();

        if (name === '' || attributes.some((a) => a.name === name)) {
            return;
        }

        onAttributesChange([...attributes, { name, values: [] }]);
        setAttributeName('');
    }

    function removeAttribute(index: number) {
        const removed = attributes[index];
        onAttributesChange(attributes.filter((_, i) => i !== index));
        onVariationsChange(
            variations.filter(
                (variation) => !(removed.name in variation.variation_attributes),
            ),
        );
    }

    function addValue(index: number) {
        const value = (valueInputs[index] ?? '').trim();
        const attribute = attributes[index];

        if (value === '' || attribute.values.includes(value)) {
            return;
        }

        const nextAttributes = [...attributes];
        nextAttributes[index] = {
            ...attribute,
            values: [...attribute.values, value],
        };
        onAttributesChange(nextAttributes);

        // Inline-create the matching variation card.
        onVariationsChange([
            ...variations,
            emptyVariation(attribute.name, value),
        ]);

        setValueInputs({ ...valueInputs, [index]: '' });
    }

    function removeValue(attrIndex: number, value: string) {
        const attribute = attributes[attrIndex];
        const next = [...attributes];
        next[attrIndex] = {
            ...attribute,
            values: attribute.values.filter((v) => v !== value),
        };
        onAttributesChange(next);
        onVariationsChange(
            variations.filter(
                (variation) =>
                    variation.variation_attributes[attribute.name] !== value,
            ),
        );
    }

    function updateVariation(
        name: string,
        value: string,
        patch: Partial<VariationDraft>,
    ) {
        const idx = findVariationIndex(name, value);

        if (idx === -1) {
            return;
        }

        const next = [...variations];
        next[idx] = { ...next[idx], ...patch };
        onVariationsChange(next);
    }

    return (
        <div className="space-y-4">
            <div className="flex gap-2">
                <Input
                    value={attributeName}
                    onChange={(event) => setAttributeName(event.target.value)}
                    onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                            event.preventDefault();
                            addAttribute();
                        }
                    }}
                    placeholder="نام ویژگی (مثلاً رنگ یا گارانتی)"
                />
                <Button
                    type="button"
                    variant="outline"
                    className="gap-1.5"
                    onClick={addAttribute}
                >
                    <Plus className="size-4" />
                    افزودن ویژگی
                </Button>
            </div>

            {attributes.length === 0 ? (
                <p className="flex flex-col items-center gap-2 rounded-xl border border-dashed py-8 text-center text-sm text-muted-foreground">
                    <Layers className="size-6" />
                    هنوز ویژگی‌ای اضافه نشده است. برای ساخت تنوع، یک ویژگی اضافه
                    کنید.
                </p>
            ) : (
                <div className="space-y-4">
                    {attributes.map((attribute, index) => (
                        <Card
                            key={attribute.name}
                            className="border-primary/20 bg-primary/5"
                        >
                            <CardHeader className="flex-row items-center justify-between gap-2 pb-3">
                                <span className="flex items-center gap-1.5 font-semibold">
                                    <Layers className="size-4 text-primary" />
                                    {attribute.name}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => removeAttribute(index)}
                                    className="text-muted-foreground transition-colors hover:text-destructive"
                                    aria-label="حذف ویژگی"
                                >
                                    <Trash2 className="size-4" />
                                </button>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex gap-2">
                                    <Input
                                        value={valueInputs[index] ?? ''}
                                        onChange={(event) =>
                                            setValueInputs({
                                                ...valueInputs,
                                                [index]: event.target.value,
                                            })
                                        }
                                        onKeyDown={(event) => {
                                            if (event.key === 'Enter') {
                                                event.preventDefault();
                                                addValue(index);
                                            }
                                        }}
                                        placeholder="افزودن مقدار (مثلاً یک ساله)"
                                        className="bg-background"
                                    />
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        className="gap-1.5"
                                        onClick={() => addValue(index)}
                                    >
                                        <Plus className="size-4" />
                                        افزودن تنوع
                                    </Button>
                                </div>

                                {attribute.values.length === 0 ? (
                                    <p className="text-xs text-muted-foreground">
                                        یک مقدار وارد کنید تا کارت تنوع برای ورود
                                        قیمت، موجودی، تخفیف و تصویر ساخته شود.
                                    </p>
                                ) : (
                                    <div className="space-y-3">
                                        {attribute.values.map((value) => {
                                            const variation =
                                                variations[
                                                    findVariationIndex(
                                                        attribute.name,
                                                        value,
                                                    )
                                                ];

                                            if (!variation) {
                                                return null;
                                            }

                                            return (
                                                <VariationCard
                                                    key={value}
                                                    label={value}
                                                    variation={variation}
                                                    onChange={(patch) =>
                                                        updateVariation(
                                                            attribute.name,
                                                            value,
                                                            patch,
                                                        )
                                                    }
                                                    onRemove={() =>
                                                        removeValue(
                                                            index,
                                                            value,
                                                        )
                                                    }
                                                />
                                            );
                                        })}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}

function VariationCard({
    label,
    variation,
    onChange,
    onRemove,
}: {
    label: string;
    variation: VariationDraft;
    onChange: (patch: Partial<VariationDraft>) => void;
    onRemove: () => void;
}) {
    return (
        <Card className="bg-background">
            <CardContent className="space-y-3 pt-4">
                <div className="flex items-center justify-between gap-2">
                    <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-sm font-medium text-primary">
                        {label}
                    </span>
                    <label className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Switch
                            checked={variation.is_active}
                            onCheckedChange={(checked) =>
                                onChange({ is_active: checked })
                            }
                        />
                        فعال
                        <button
                            type="button"
                            onClick={onRemove}
                            className="text-muted-foreground transition-colors hover:text-destructive"
                            aria-label="حذف تنوع"
                        >
                            <Trash2 className="size-4" />
                        </button>
                    </label>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="grid gap-1">
                        <Label className="text-xs">قیمت (تومان)</Label>
                        <Input
                            type="number"
                            min={0}
                            value={variation.price}
                            onChange={(event) =>
                                onChange({ price: event.target.value })
                            }
                            required
                        />
                    </div>
                    <div className="grid gap-1">
                        <Label className="text-xs">موجودی</Label>
                        <Input
                            type="number"
                            min={0}
                            value={variation.stock}
                            onChange={(event) =>
                                onChange({ stock: event.target.value })
                            }
                            required
                        />
                    </div>
                    <div className="grid gap-1">
                        <Label className="text-xs">تخفیف (٪)</Label>
                        <Input
                            type="number"
                            min={0}
                            max={100}
                            value={variation.discount_percent}
                            onChange={(event) =>
                                onChange({
                                    discount_percent: event.target.value,
                                })
                            }
                        />
                    </div>
                    <div className="grid gap-1">
                        <Label className="flex items-center gap-1 text-xs">
                            شناسه محصول (SKU)
                            <HelpTooltip text="هر تنوع یک محصول مستقل در سیستم است و می‌تواند شناسه اختصاصی خود را داشته باشد." />
                        </Label>
                        <Input
                            value={variation.sku}
                            onChange={(event) =>
                                onChange({ sku: event.target.value })
                            }
                            dir="ltr"
                        />
                    </div>
                    <div className="grid gap-1 sm:col-span-2">
                        <Label className="text-xs">تصویر تنوع</Label>
                        <label className="flex h-9 cursor-pointer items-center gap-1.5 rounded-md border px-3 text-sm text-muted-foreground hover:bg-muted">
                            <Upload className="size-4" />
                            {variation.image
                                ? variation.image.name
                                : (variation.existingImage?.original_name ??
                                  'انتخاب تصویر')}
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(event) =>
                                    onChange({
                                        image: event.target.files?.[0] ?? null,
                                        remove_image: true,
                                    })
                                }
                            />
                        </label>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

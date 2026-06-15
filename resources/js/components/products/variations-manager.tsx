import { Plus, Trash2, Upload, X } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
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

export function emptyVariation(): VariationDraft {
    return {
        sku: '',
        price: '',
        stock: '0',
        discount_percent: '',
        is_active: true,
        variation_attributes: {},
        image: null,
        existingImage: null,
        remove_image: false,
    };
}

/**
 * Manages the attribute definitions (color, warranty, …) shown as individual
 * cards, and the resulting product variations with their own price, stock,
 * discount and image.
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

    function addAttribute() {
        const name = attributeName.trim();

        if (name === '') {
            return;
        }

        onAttributesChange([...attributes, { name, values: [] }]);
        setAttributeName('');
    }

    function removeAttribute(index: number) {
        onAttributesChange(attributes.filter((_, i) => i !== index));
    }

    function addValue(index: number) {
        const value = (valueInputs[index] ?? '').trim();

        if (value === '') {
            return;
        }

        const next = [...attributes];

        if (!next[index].values.includes(value)) {
            next[index] = {
                ...next[index],
                values: [...next[index].values, value],
            };
            onAttributesChange(next);
        }

        setValueInputs({ ...valueInputs, [index]: '' });
    }

    function removeValue(attrIndex: number, value: string) {
        const next = [...attributes];
        next[attrIndex] = {
            ...next[attrIndex],
            values: next[attrIndex].values.filter((v) => v !== value),
        };
        onAttributesChange(next);
    }

    function updateVariation(index: number, patch: Partial<VariationDraft>) {
        const next = [...variations];
        next[index] = { ...next[index], ...patch };
        onVariationsChange(next);
    }

    return (
        <div className="space-y-6">
            <div className="space-y-3">
                <Label>ویژگی‌ها</Label>
                <div className="flex gap-2">
                    <Input
                        value={attributeName}
                        onChange={(event) =>
                            setAttributeName(event.target.value)
                        }
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
                        size="icon"
                        onClick={addAttribute}
                    >
                        <Plus className="size-4" />
                    </Button>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                    {attributes.map((attribute, index) => (
                        <Card key={index}>
                            <CardHeader className="flex-row items-center justify-between gap-2 pb-2">
                                <span className="font-medium">
                                    {attribute.name}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => removeAttribute(index)}
                                    className="text-muted-foreground hover:text-destructive"
                                >
                                    <Trash2 className="size-4" />
                                </button>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="flex flex-wrap gap-1.5">
                                    {attribute.values.map((value) => (
                                        <span
                                            key={value}
                                            className="flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs"
                                        >
                                            {value}
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeValue(index, value)
                                                }
                                            >
                                                <X className="size-3" />
                                            </button>
                                        </span>
                                    ))}
                                </div>
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
                                        placeholder="افزودن مقدار"
                                        className="h-8 text-sm"
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        className="size-8"
                                        onClick={() => addValue(index)}
                                    >
                                        <Plus className="size-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <Label>تنوع‌ها</Label>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="gap-1.5"
                        onClick={() =>
                            onVariationsChange([
                                ...variations,
                                emptyVariation(),
                            ])
                        }
                    >
                        <Plus className="size-4" />
                        افزودن تنوع
                    </Button>
                </div>

                {variations.length === 0 ? (
                    <p className="rounded-md border border-dashed py-6 text-center text-sm text-muted-foreground">
                        این محصول تنوعی ندارد.
                    </p>
                ) : (
                    <div className="space-y-3">
                        {variations.map((variation, index) => (
                            <Card key={index}>
                                <CardContent className="space-y-3 pt-4">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="grid flex-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                            {attributes.map((attribute) => (
                                                <div
                                                    key={attribute.name}
                                                    className="grid gap-1"
                                                >
                                                    <Label className="text-xs">
                                                        {attribute.name}
                                                    </Label>
                                                    <Select
                                                        value={
                                                            variation
                                                                .variation_attributes[
                                                                attribute.name
                                                            ] ?? ''
                                                        }
                                                        onValueChange={(value) =>
                                                            updateVariation(
                                                                index,
                                                                {
                                                                    variation_attributes:
                                                                        {
                                                                            ...variation.variation_attributes,
                                                                            [attribute.name]:
                                                                                value,
                                                                        },
                                                                },
                                                            )
                                                        }
                                                    >
                                                        <SelectTrigger className="h-9">
                                                            <SelectValue placeholder="انتخاب" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {attribute.values.map(
                                                                (value) => (
                                                                    <SelectItem
                                                                        key={
                                                                            value
                                                                        }
                                                                        value={
                                                                            value
                                                                        }
                                                                    >
                                                                        {value}
                                                                    </SelectItem>
                                                                ),
                                                            )}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            ))}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                onVariationsChange(
                                                    variations.filter(
                                                        (_, i) => i !== index,
                                                    ),
                                                )
                                            }
                                            className="text-muted-foreground hover:text-destructive"
                                        >
                                            <Trash2 className="size-4" />
                                        </button>
                                    </div>

                                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                                        <div className="grid gap-1">
                                            <Label className="text-xs">
                                                قیمت
                                            </Label>
                                            <Input
                                                type="number"
                                                min={0}
                                                value={variation.price}
                                                onChange={(event) =>
                                                    updateVariation(index, {
                                                        price: event.target
                                                            .value,
                                                    })
                                                }
                                            />
                                        </div>
                                        <div className="grid gap-1">
                                            <Label className="text-xs">
                                                موجودی
                                            </Label>
                                            <Input
                                                type="number"
                                                min={0}
                                                value={variation.stock}
                                                onChange={(event) =>
                                                    updateVariation(index, {
                                                        stock: event.target
                                                            .value,
                                                    })
                                                }
                                            />
                                        </div>
                                        <div className="grid gap-1">
                                            <Label className="text-xs">
                                                تخفیف (٪)
                                            </Label>
                                            <Input
                                                type="number"
                                                min={0}
                                                max={100}
                                                value={
                                                    variation.discount_percent
                                                }
                                                onChange={(event) =>
                                                    updateVariation(index, {
                                                        discount_percent:
                                                            event.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                        <div className="grid gap-1">
                                            <Label className="text-xs">
                                                تصویر
                                            </Label>
                                            <label className="flex h-9 cursor-pointer items-center gap-1.5 rounded-md border px-3 text-sm text-muted-foreground hover:bg-muted">
                                                <Upload className="size-4" />
                                                {variation.image
                                                    ? variation.image.name
                                                    : 'انتخاب'}
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={(event) =>
                                                        updateVariation(index, {
                                                            image:
                                                                event.target
                                                                    .files?.[0] ??
                                                                null,
                                                            remove_image: true,
                                                        })
                                                    }
                                                />
                                            </label>
                                        </div>
                                    </div>

                                    <label className="flex items-center gap-2 text-sm">
                                        <Switch
                                            checked={variation.is_active}
                                            onCheckedChange={(checked) =>
                                                updateVariation(index, {
                                                    is_active: checked,
                                                })
                                            }
                                        />
                                        فعال
                                    </label>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

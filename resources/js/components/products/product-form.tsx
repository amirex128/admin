import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';

import ProductController from '@/actions/App/Http/Controllers/User/ProductController';
import { HelpTooltip } from '@/components/help-tooltip';
import InputError from '@/components/input-error';
import { CategorySelect } from '@/components/products/category-select';
import { MediaUploader } from '@/components/products/media-uploader';
import { PackagingSelect } from '@/components/products/packaging-select';
import { RichTextEditor } from '@/components/products/rich-text-editor';
import {
    
    
    VariationsManager
} from '@/components/products/variations-manager';
import type {AttributeDraft, VariationDraft} from '@/components/products/variations-manager';
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
import type { Category, PackagingType, Product, SelectOption } from '@/types';

type ProductFormData = {
    name: string;
    sku: string;
    category_id: number | null;
    packaging_type_id: number | null;
    description: string;
    weight: string;
    sales_unit: string;
    order_mode: string;
    is_special_offer: boolean;
    is_active: boolean;
    has_variations: boolean;
    price: string;
    stock: string;
    discount_percent: string;
    attributes: AttributeDraft[];
    variations: VariationDraft[];
    images: File[];
    video: File | null;
    remove_video: boolean;
    removed_media_ids: number[];
};

export function ProductForm({
    product,
    categories,
    packagingTypes,
    salesUnits,
    orderModes,
    hasAiModel,
}: {
    product: Product | null;
    categories: Category[];
    packagingTypes: PackagingType[];
    salesUnits: SelectOption[];
    orderModes: SelectOption[];
    hasAiModel: boolean;
}) {
    const isEditing = product !== null;

    const form = useForm<ProductFormData>({
        name: product?.name ?? '',
        sku: product?.sku ?? '',
        category_id: product?.category_id ?? null,
        packaging_type_id: product?.packaging_type_id ?? null,
        description: product?.description ?? '',
        weight: product?.weight ? String(product.weight) : '',
        sales_unit: product?.sales_unit ?? salesUnits[0]?.value ?? 'piece',
        order_mode: product?.order_mode ?? orderModes[0]?.value ?? 'direct',
        is_special_offer: product?.is_special_offer ?? false,
        is_active: product?.is_active ?? true,
        has_variations: (product?.variations?.length ?? 0) > 0,
        price: product ? String(product.price) : '',
        stock: product ? String(product.stock) : '0',
        discount_percent: product?.discount_percent
            ? String(product.discount_percent)
            : '',
        attributes:
            product?.attributes?.map((attribute) => ({
                name: attribute.name,
                values: attribute.values.map((value) => value.value),
            })) ?? [],
        variations:
            product?.variations?.map((variation) => ({
                id: variation.id,
                sku: variation.sku ?? '',
                price: String(variation.price),
                stock: String(variation.stock),
                discount_percent: variation.discount_percent
                    ? String(variation.discount_percent)
                    : '',
                is_active: variation.is_active,
                variation_attributes: variation.variation_attributes ?? {},
                image: null,
                existingImage: variation.images?.[0] ?? null,
                remove_image: false,
            })) ?? [],
        images: [],
        video: null,
        remove_video: false,
        removed_media_ids: [],
    });

    function submit(event: React.FormEvent) {
        event.preventDefault();

        form.transform((data) => {
            const usesVariations = data.has_variations;

            return {
                ...data,
                is_special_offer: data.is_special_offer ? 1 : 0,
                is_active: data.is_active ? 1 : 0,
                remove_video: data.remove_video ? 1 : 0,
                attributes: usesVariations ? data.attributes : [],
                variations: usesVariations
                    ? data.variations.map((variation) => ({
                          id: variation.id,
                          sku: variation.sku,
                          price: variation.price,
                          stock: variation.stock,
                          discount_percent: variation.discount_percent,
                          is_active: variation.is_active ? 1 : 0,
                          remove_image: variation.remove_image ? 1 : 0,
                          variation_attributes: variation.variation_attributes,
                          image: variation.image,
                      }))
                    : [],
            };
        });

        const url = isEditing
            ? ProductController.update(product.id).url
            : ProductController.store().url;

        form.post(url, {
            forceFormData: true,
            onError: (errors) => {
                const first = Object.values(errors)[0];

                toast.error(
                    first ??
                        'ثبت محصول با خطا مواجه شد. لطفاً فیلدهای مشخص‌شده را بررسی کنید.',
                );
            },
        });
    }

    const aiContext = [form.data.name, product?.category?.name]
        .filter(Boolean)
        .join(' - ');

    return (
        <form onSubmit={submit} className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>اطلاعات محصول</CardTitle>
                        <CardDescription>
                            مشخصات اصلی محصول را وارد کنید.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">نام محصول</Label>
                            <Input
                                id="name"
                                value={form.data.name}
                                onChange={(event) =>
                                    form.setData('name', event.target.value)
                                }
                                required
                            />
                            <InputError message={form.errors.name} />
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="sku">شناسه محصول</Label>
                                <Input
                                    id="sku"
                                    value={form.data.sku}
                                    onChange={(event) =>
                                        form.setData('sku', event.target.value)
                                    }
                                />
                                <InputError message={form.errors.sku} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="weight">وزن (گرم)</Label>
                                <Input
                                    id="weight"
                                    type="number"
                                    min={0}
                                    value={form.data.weight}
                                    onChange={(event) =>
                                        form.setData(
                                            'weight',
                                            event.target.value,
                                        )
                                    }
                                />
                                <InputError message={form.errors.weight} />
                            </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="grid gap-2">
                                <Label>دسته‌بندی</Label>
                                <CategorySelect
                                    categories={categories}
                                    value={form.data.category_id}
                                    onChange={(value) =>
                                        form.setData('category_id', value)
                                    }
                                />
                                <InputError message={form.errors.category_id} />
                            </div>
                            <div className="grid gap-2">
                                <Label>نوع بسته‌بندی</Label>
                                <PackagingSelect
                                    packagingTypes={packagingTypes}
                                    value={form.data.packaging_type_id}
                                    onChange={(value) =>
                                        form.setData(
                                            'packaging_type_id',
                                            value,
                                        )
                                    }
                                />
                                <InputError
                                    message={form.errors.packaging_type_id}
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                            <Label className="text-sm font-medium">
                                قیمت، موجودی و تخفیف محصول اصلی
                            </Label>
                            <HelpTooltip text="این مقادیر مربوط به خود محصول اصلی است. اگر محصول تنوع داشته باشد، قیمت و موجودی هر تنوع جداگانه در بخش «تنوع محصول» مشخص می‌شود." />
                        </div>
                        <div className="grid gap-4 sm:grid-cols-3">
                            <div className="grid gap-2">
                                <Label htmlFor="price">قیمت (تومان)</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    min={0}
                                    value={form.data.price}
                                    onChange={(event) =>
                                        form.setData('price', event.target.value)
                                    }
                                    required
                                />
                                <InputError message={form.errors.price} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="stock">موجودی</Label>
                                <Input
                                    id="stock"
                                    type="number"
                                    min={0}
                                    value={form.data.stock}
                                    onChange={(event) =>
                                        form.setData('stock', event.target.value)
                                    }
                                    required
                                />
                                <InputError message={form.errors.stock} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="discount_percent">
                                    تخفیف (٪)
                                </Label>
                                <Input
                                    id="discount_percent"
                                    type="number"
                                    min={0}
                                    max={100}
                                    value={form.data.discount_percent}
                                    onChange={(event) =>
                                        form.setData(
                                            'discount_percent',
                                            event.target.value,
                                        )
                                    }
                                />
                                <InputError
                                    message={form.errors.discount_percent}
                                />
                            </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="grid gap-2">
                                <Label>واحد فروش</Label>
                                <Select
                                    value={form.data.sales_unit}
                                    onValueChange={(value) =>
                                        form.setData('sales_unit', value)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {salesUnits.map((unit) => (
                                            <SelectItem
                                                key={unit.value}
                                                value={unit.value}
                                            >
                                                {unit.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label>وضعیت سفارش‌گیری</Label>
                                <Select
                                    value={form.data.order_mode}
                                    onValueChange={(value) =>
                                        form.setData('order_mode', value)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {orderModes.map((mode) => (
                                            <SelectItem
                                                key={mode.value}
                                                value={mode.value}
                                            >
                                                {mode.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label>توضیحات</Label>
                            <RichTextEditor
                                value={form.data.description}
                                onChange={(html) =>
                                    form.setData('description', html)
                                }
                                productId={product?.id}
                                aiContext={aiContext}
                                hasAiModel={hasAiModel}
                            />
                            <InputError message={form.errors.description} />
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>وضعیت</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <label className="flex items-center justify-between">
                                <span className="text-sm">محصول فعال</span>
                                <Switch
                                    checked={form.data.is_active}
                                    onCheckedChange={(checked) =>
                                        form.setData('is_active', checked)
                                    }
                                />
                            </label>
                            <label className="flex items-center justify-between">
                                <span className="text-sm">پیشنهاد ویژه</span>
                                <Switch
                                    checked={form.data.is_special_offer}
                                    onCheckedChange={(checked) =>
                                        form.setData(
                                            'is_special_offer',
                                            checked,
                                        )
                                    }
                                />
                            </label>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>رسانه</CardTitle>
                            <CardDescription>
                                حداکثر ۲۰ تصویر و ۱ ویدیو.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <MediaUploader
                                existingImages={product?.images ?? []}
                                images={form.data.images}
                                onImagesChange={(files) =>
                                    form.setData('images', files)
                                }
                                existingVideo={product?.video ?? null}
                                video={form.data.video}
                                onVideoChange={(file) =>
                                    form.setData('video', file)
                                }
                                removedMediaIds={form.data.removed_media_ids}
                                onRemovedMediaIdsChange={(ids) =>
                                    form.setData('removed_media_ids', ids)
                                }
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1.5">
                            <CardTitle className="flex items-center gap-1.5">
                                تنوع محصول
                                <HelpTooltip text="اگر این محصول در چند حالت مختلف عرضه می‌شود (مثلاً گارانتی یک‌ساله و دوساله)، این گزینه را فعال کنید. هر تنوع یک محصول مستقل با قیمت، موجودی و تصویر خودش است." />
                            </CardTitle>
                            <CardDescription>
                                آیا این محصول تنوع‌های مختلفی دارد؟ در صورت فعال
                                بودن، ویژگی‌ها و تنوع‌ها را اینجا تعریف کنید.
                            </CardDescription>
                        </div>
                        <label className="flex shrink-0 items-center gap-2 text-sm">
                            <Switch
                                checked={form.data.has_variations}
                                onCheckedChange={(checked) =>
                                    form.setData('has_variations', checked)
                                }
                            />
                            تنوع دارد
                        </label>
                    </div>
                </CardHeader>
                {form.data.has_variations && (
                    <CardContent>
                        <VariationsManager
                            attributes={form.data.attributes}
                            onAttributesChange={(attributes) =>
                                form.setData('attributes', attributes)
                            }
                            variations={form.data.variations}
                            onVariationsChange={(variations) =>
                                form.setData('variations', variations)
                            }
                        />
                    </CardContent>
                )}
            </Card>

            <div className="flex justify-end gap-2">
                <Button
                    type="submit"
                    loading={form.processing}
                    className="gap-1.5"
                >
                    {isEditing ? 'ذخیره تغییرات' : 'ایجاد محصول'}
                </Button>
            </div>
        </form>
    );
}

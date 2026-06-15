import { Head } from '@inertiajs/react';

import Heading from '@/components/heading';
import { ProductForm } from '@/components/products/product-form';
import { index as productsIndex } from '@/routes/products';
import type { Category, PackagingType, Product, SelectOption } from '@/types';

type PageProps = {
    product: Product | null;
    categories: Category[];
    packagingTypes: PackagingType[];
    salesUnits: SelectOption[];
    orderModes: SelectOption[];
    hasAiModel: boolean;
};

export default function ProductFormPage({
    product,
    categories,
    packagingTypes,
    salesUnits,
    orderModes,
    hasAiModel,
}: PageProps) {
    const isEditing = product !== null;

    return (
        <>
            <Head title={isEditing ? 'ویرایش محصول' : 'محصول جدید'} />

            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <Heading
                    title={isEditing ? 'ویرایش محصول' : 'ایجاد محصول'}
                    description="اطلاعات، رسانه و تنوع‌های محصول را مدیریت کنید."
                />

                <ProductForm
                    product={product}
                    categories={categories}
                    packagingTypes={packagingTypes}
                    salesUnits={salesUnits}
                    orderModes={orderModes}
                    hasAiModel={hasAiModel}
                />
            </div>
        </>
    );
}

ProductFormPage.layout = {
    breadcrumbs: [
        {
            title: 'محصولات',
            href: productsIndex(),
        },
    ],
};

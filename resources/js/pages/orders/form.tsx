import { Head } from '@inertiajs/react';

import OrderController from '@/actions/App/Http/Controllers/User/OrderController';
import Heading from '@/components/heading';
import { OrderForm } from '@/components/orders/order-form';
import { index as ordersIndex } from '@/routes/orders';
import type { OrderProductOption, SelectOption } from '@/types';

type PageProps = {
    products: OrderProductOption[];
    shippingMethods: SelectOption[];
    paymentMethods: SelectOption[];
    paymentStatusOptions: SelectOption[];
};

export default function OrderFormPage({
    products,
    shippingMethods,
    paymentMethods,
    paymentStatusOptions,
}: PageProps) {
    return (
        <>
            <Head title="ثبت سفارش جدید" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <Heading
                    title="ثبت سفارش / پیش‌فاکتور"
                    description="سفارش را به صورت دستی ثبت کنید یا پیش‌فاکتور صادر نمایید."
                />

                <OrderForm
                    products={products}
                    submitUrl={OrderController.store().url}
                    shippingMethods={shippingMethods}
                    paymentMethods={paymentMethods}
                    paymentStatusOptions={paymentStatusOptions}
                />
            </div>
        </>
    );
}

OrderFormPage.layout = {
    breadcrumbs: [
        {
            title: 'سفارشات',
            href: ordersIndex(),
        },
    ],
};

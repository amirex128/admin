import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

import OrderController from '@/actions/App/Http/Controllers/Admin/OrderController';
import Heading from '@/components/heading';
import { OrderForm } from '@/components/orders/order-form';
import { Combobox } from '@/components/products/combobox';
import {
    create as adminOrdersCreate,
    index as adminOrdersIndex,
} from '@/routes/admin/orders';
import type { OrderProductOption, SelectOption } from '@/types';

type AdminUserOption = {
    id: number;
    name: string;
    phone: string;
};

type PageProps = {
    users: AdminUserOption[];
    selectedUserId: number | null;
    products: OrderProductOption[];
    shippingMethods: SelectOption[];
    paymentMethods: SelectOption[];
    paymentStatusOptions: SelectOption[];
};

export default function AdminOrderFormPage({
    users,
    selectedUserId,
    products,
    shippingMethods,
    paymentMethods,
    paymentStatusOptions,
}: PageProps) {
    const [userId, setUserId] = useState<number | null>(selectedUserId);

    function selectUser(value: number | null) {
        setUserId(value);

        router.get(adminOrdersCreate().url, value ? { user_id: value } : {}, {
            only: ['products', 'selectedUserId'],
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    }

    return (
        <>
            <Head title="ثبت سفارش جدید" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <Heading
                    title="ثبت سفارش / پیش‌فاکتور"
                    description="ابتدا فروشنده را انتخاب کنید، سپس سفارش را ثبت نمایید."
                />

                <OrderForm
                    products={products}
                    submitUrl={OrderController.store().url}
                    shippingMethods={shippingMethods}
                    paymentMethods={paymentMethods}
                    paymentStatusOptions={paymentStatusOptions}
                    requireUser
                    userId={userId}
                    userSelect={
                        <Combobox
                            options={users.map((user) => ({
                                value: user.id,
                                label: user.name,
                                hint: user.phone,
                            }))}
                            value={userId}
                            onChange={selectUser}
                            placeholder="انتخاب فروشنده"
                            searchPlaceholder="جستجوی نام یا موبایل..."
                        />
                    }
                />
            </div>
        </>
    );
}

AdminOrderFormPage.layout = {
    breadcrumbs: [
        {
            title: 'سفارشات',
            href: adminOrdersIndex(),
        },
    ],
};

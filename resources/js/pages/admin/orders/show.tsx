import { Head } from '@inertiajs/react';

import Heading from '@/components/heading';
import { OrderDetail } from '@/components/orders/order-detail';
import {
    index as adminOrdersIndex,
    payment as adminOrdersPayment,
    pdf as adminOrdersPdf,
    status as adminOrdersStatus,
} from '@/routes/admin/orders';
import type { Order, OrderStatusOption, SelectOption } from '@/types';

type PageProps = {
    order: Order;
    statusOptions: OrderStatusOption[];
    paymentStatusOptions: SelectOption[];
};

export default function AdminOrderShow({
    order,
    statusOptions,
    paymentStatusOptions,
}: PageProps) {
    return (
        <>
            <Head title={`سفارش ${order.code}`} />

            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <Heading
                    title={`سفارش ${order.code}`}
                    description="مدیریت سفارش فروشنده با همان امکانات پنل کاربر."
                />

                <OrderDetail
                    order={order}
                    statusOptions={statusOptions}
                    paymentStatusOptions={paymentStatusOptions}
                    statusUrl={adminOrdersStatus(order.id).url}
                    paymentUrl={adminOrdersPayment(order.id).url}
                    pdfUrl={adminOrdersPdf(order.id).url}
                />
            </div>
        </>
    );
}

AdminOrderShow.layout = {
    breadcrumbs: [
        {
            title: 'سفارشات',
            href: adminOrdersIndex(),
        },
    ],
};

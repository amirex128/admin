import { Head } from '@inertiajs/react';

import Heading from '@/components/heading';
import { OrderDetail } from '@/components/orders/order-detail';
import {
    index as ordersIndex,
    payment as ordersPayment,
    pdf as ordersPdf,
    status as ordersStatus,
} from '@/routes/orders';
import type { Order, OrderStatusOption, SelectOption } from '@/types';

type PageProps = {
    order: Order;
    statusOptions: OrderStatusOption[];
    paymentStatusOptions: SelectOption[];
};

export default function OrderShow({
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
                    description="مراحل سفارش را پیگیری و وضعیت آن را بروزرسانی کنید."
                />

                <OrderDetail
                    order={order}
                    statusOptions={statusOptions}
                    paymentStatusOptions={paymentStatusOptions}
                    statusUrl={ordersStatus(order.id).url}
                    paymentUrl={ordersPayment(order.id).url}
                    pdfUrl={ordersPdf(order.id).url}
                />
            </div>
        </>
    );
}

OrderShow.layout = {
    breadcrumbs: [
        {
            title: 'سفارشات',
            href: ordersIndex(),
        },
    ],
};

import { Head, Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';

import Heading from '@/components/heading';
import { OrderFilters } from '@/components/orders/order-filters';
import { OrderTable } from '@/components/orders/order-table';
import { PaginationNav } from '@/components/pagination-nav';
import { Button } from '@/components/ui/button';
import { formatToman } from '@/lib/format';
import {
    create as ordersCreate,
    index as ordersIndex,
    show as ordersShow,
} from '@/routes/orders';
import type {
    Order,
    OrderFilterState,
    OrderStatusTab,
    Paginated,
    SelectOption,
} from '@/types';

type PageProps = {
    orders: Paginated<Order>;
    filters: OrderFilterState;
    statusTabs: OrderStatusTab[];
    shippingMethods: SelectOption[];
    paymentMethods: SelectOption[];
};

export default function OrdersIndex({
    orders,
    filters,
    statusTabs,
    shippingMethods,
    paymentMethods,
}: PageProps) {
    return (
        <>
            <Head title="مدیریت سفارشات" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <Heading
                        title="سفارشات"
                        description="سفارش‌ها و پیش‌فاکتورها را مدیریت و پیگیری کنید."
                    />
                    <Button asChild className="gap-1.5">
                        <Link href={ordersCreate()}>
                            <Plus className="size-4" />
                            ثبت سفارش جدید
                        </Link>
                    </Button>
                </div>

                <OrderFilters
                    indexUrl={ordersIndex().url}
                    filters={filters}
                    statusTabs={statusTabs}
                    shippingMethods={shippingMethods}
                    paymentMethods={paymentMethods}
                />

                <OrderTable
                    orders={orders.data}
                    showOrderUrl={(id) => ordersShow(id).url}
                />

                <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                        {formatToman(orders.total)} سفارش
                    </p>
                    <PaginationNav links={orders.links} />
                </div>
            </div>
        </>
    );
}

OrdersIndex.layout = {
    breadcrumbs: [
        {
            title: 'سفارشات',
            href: ordersIndex(),
        },
    ],
};

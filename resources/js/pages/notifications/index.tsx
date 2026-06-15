import { Head, router } from '@inertiajs/react';
import { Bell, CheckCheck, Trash2 } from 'lucide-react';

import NotificationController from '@/actions/App/Http/Controllers/User/NotificationController';
import Heading from '@/components/heading';
import { PaginationNav } from '@/components/pagination-nav';
import { Button } from '@/components/ui/button';
import { formatDateTime } from '@/lib/format';
import { index as notificationsIndex } from '@/routes/notifications';
import type { AppNotification, Paginated } from '@/types';

type PageProps = {
    notifications: Paginated<AppNotification>;
};

export default function NotificationsIndex({ notifications }: PageProps) {
    function markAll() {
        router.post(
            NotificationController.markAllAsRead().url,
            {},
            { preserveScroll: true },
        );
    }

    function open(item: AppNotification) {
        if (!item.read_at) {
            router.patch(
                NotificationController.markAsRead(item.id).url,
                {},
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        if (item.url) {
                            router.visit(item.url);
                        }
                    },
                },
            );

            return;
        }

        if (item.url) {
            router.visit(item.url);
        }
    }

    function destroy(item: AppNotification) {
        router.delete(NotificationController.destroy(item.id).url, {
            preserveScroll: true,
        });
    }

    return (
        <>
            <Head title="اعلان‌ها" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <Heading
                        title="اعلان‌ها"
                        description="رویدادهای مهم فروشگاه شما در یک نگاه."
                    />
                    <Button
                        variant="outline"
                        onClick={markAll}
                        className="gap-1.5"
                    >
                        <CheckCheck className="size-4" />
                        خواندن همه
                    </Button>
                </div>

                <div className="rounded-xl border">
                    {notifications.data.length === 0 && (
                        <div className="flex flex-col items-center gap-2 py-16 text-muted-foreground">
                            <Bell className="size-8" />
                            <p className="text-sm">اعلانی وجود ندارد.</p>
                        </div>
                    )}
                    {notifications.data.map((item) => (
                        <div
                            key={item.id}
                            className={`flex items-start gap-3 border-b px-4 py-3 last:border-b-0 ${
                                item.read_at ? '' : 'bg-primary/5'
                            }`}
                        >
                            <button
                                type="button"
                                onClick={() => open(item)}
                                className="flex flex-1 flex-col items-start gap-0.5 text-right"
                            >
                                <span className="flex items-center gap-2 text-sm font-medium">
                                    {!item.read_at && (
                                        <span className="size-2 rounded-full bg-primary" />
                                    )}
                                    {item.title}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                    {item.body}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                    {formatDateTime(item.created_at)}
                                </span>
                            </button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => destroy(item)}
                                className="text-destructive hover:text-destructive"
                                title="حذف"
                            >
                                <Trash2 className="size-4" />
                            </Button>
                        </div>
                    ))}
                </div>

                <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                        {notifications.total} اعلان
                    </p>
                    <PaginationNav links={notifications.links} />
                </div>
            </div>
        </>
    );
}

NotificationsIndex.layout = {
    breadcrumbs: [
        {
            title: 'اعلان‌ها',
            href: notificationsIndex(),
        },
    ],
};

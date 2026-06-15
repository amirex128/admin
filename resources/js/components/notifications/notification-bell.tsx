import { Link, router, usePage, usePoll } from '@inertiajs/react';
import { Bell, CheckCheck } from 'lucide-react';
import { useEffect, useRef } from 'react';

import NotificationController from '@/actions/App/Http/Controllers/User/NotificationController';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatDateTime } from '@/lib/format';
import { index as notificationsIndex } from '@/routes/notifications';
import type { AppNotification, SharedNotifications } from '@/types';

/**
 * Header bell showing recent notifications with an unread badge. Refreshes via
 * polling and mirrors new notifications to the browser's native notification
 * center (after the user grants permission).
 */
export function NotificationBell() {
    const { notifications } = usePage<{
        notifications: SharedNotifications;
    }>().props;

    // Keep the shared notifications fresh in the background.
    usePoll(30000, { only: ['notifications'] });

    const seenUnread = useRef<Set<string>>(new Set());

    useEffect(() => {
        if (typeof window === 'undefined' || !('Notification' in window)) {
            return;
        }

        if (Notification.permission === 'default') {
            void Notification.requestPermission();
        }
    }, []);

    useEffect(() => {
        if (!notifications) {
            return;
        }

        const unread = notifications.items.filter((item) => !item.read_at);

        if (typeof window !== 'undefined' && 'Notification' in window) {
            unread.forEach((item) => {
                if (
                    !seenUnread.current.has(item.id) &&
                    Notification.permission === 'granted'
                ) {
                    new Notification(item.title, { body: item.body });
                }
            });
        }

        seenUnread.current = new Set(unread.map((item) => item.id));
    }, [notifications]);

    if (!notifications) {
        return null;
    }

    const { items, unread_count: unreadCount } = notifications;

    function open(item: AppNotification) {
        if (!item.read_at) {
            router.patch(
                NotificationController.markAsRead(item.id).url,
                {},
                {
                    preserveScroll: true,
                    preserveState: true,
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

    function markAll() {
        router.post(
            NotificationController.markAllAsRead().url,
            {},
            { preserveScroll: true, preserveState: true },
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="relative"
                    aria-label="اعلان‌ها"
                >
                    <Bell className="size-5" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-white">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 p-0">
                <div className="flex items-center justify-between border-b px-3 py-2">
                    <span className="text-sm font-medium">اعلان‌ها</span>
                    {unreadCount > 0 && (
                        <button
                            type="button"
                            onClick={markAll}
                            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                        >
                            <CheckCheck className="size-3.5" />
                            خواندن همه
                        </button>
                    )}
                </div>

                <div className="max-h-80 overflow-y-auto">
                    {items.length === 0 && (
                        <p className="px-3 py-6 text-center text-sm text-muted-foreground">
                            اعلانی وجود ندارد.
                        </p>
                    )}
                    {items.map((item) => (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() => open(item)}
                            className={`flex w-full flex-col items-start gap-0.5 border-b px-3 py-2 text-right last:border-b-0 hover:bg-muted ${
                                item.read_at ? '' : 'bg-primary/5'
                            }`}
                        >
                            <span className="flex w-full items-center justify-between gap-2">
                                <span className="text-sm font-medium">
                                    {item.title}
                                </span>
                                {!item.read_at && (
                                    <span className="size-2 shrink-0 rounded-full bg-primary" />
                                )}
                            </span>
                            <span className="text-xs text-muted-foreground">
                                {item.body}
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                                {formatDateTime(item.created_at)}
                            </span>
                        </button>
                    ))}
                </div>

                <div className="border-t px-3 py-2 text-center">
                    <Link
                        href={notificationsIndex()}
                        className="text-xs text-primary hover:underline"
                    >
                        مشاهده همه اعلان‌ها
                    </Link>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

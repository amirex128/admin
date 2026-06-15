export type AppNotification = {
    id: string;
    title: string;
    body: string;
    url: string | null;
    icon: string | null;
    read_at: string | null;
    created_at: string | null;
};

export type SharedNotifications = {
    items: AppNotification[];
    unread_count: number;
} | null;

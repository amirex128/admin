import { Link, usePage } from '@inertiajs/react';
import {
    BookOpen,
    ClipboardList,
    CreditCard,
    FolderGit2,
    LayoutGrid,
    Package,
    Receipt,
    ShoppingCart,
    Sparkles,
    Ticket,
    Users,
    Wallet,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { index as adminAiModelsIndex } from '@/routes/admin/ai-models';
import { index as adminCouponsIndex } from '@/routes/admin/coupons';
import { index as adminCustomersIndex } from '@/routes/admin/customers';
import { index as adminOrdersIndex } from '@/routes/admin/orders';
import { index as adminPaymentsIndex } from '@/routes/admin/payments';
import { index as adminPlansIndex } from '@/routes/admin/plans';
import { index as adminProductsIndex } from '@/routes/admin/products';
import { index as adminUsersIndex } from '@/routes/admin/users';
import { index as couponsIndex } from '@/routes/coupons';
import { index as customersIndex } from '@/routes/customers';
import { index as ordersIndex } from '@/routes/orders';
import { index as plansIndex } from '@/routes/plans';
import { index as productsIndex } from '@/routes/products';
import { index as walletIndex } from '@/routes/wallet';
import type { Auth, NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'داشبورد',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'محصولات',
        href: productsIndex(),
        icon: Package,
    },
    {
        title: 'سفارشات',
        href: ordersIndex(),
        icon: ShoppingCart,
    },
    {
        title: 'مشتریان',
        href: customersIndex(),
        icon: Users,
    },
    {
        title: 'کدهای تخفیف',
        href: couponsIndex(),
        icon: Ticket,
    },
];

const financialNavItems: NavItem[] = [
    {
        title: 'کیف پول',
        href: walletIndex(),
        icon: Wallet,
    },
    {
        title: 'پلن‌های اشتراک',
        href: plansIndex(),
        icon: Sparkles,
    },
];

const adminNavItems: NavItem[] = [
    {
        title: 'کاربران',
        href: adminUsersIndex(),
        icon: Users,
    },
    {
        title: 'محصولات',
        href: adminProductsIndex(),
        icon: Package,
    },
    {
        title: 'سفارشات',
        href: adminOrdersIndex(),
        icon: ClipboardList,
    },
    {
        title: 'مشتریان',
        href: adminCustomersIndex(),
        icon: Users,
    },
    {
        title: 'کدهای تخفیف',
        href: adminCouponsIndex(),
        icon: Ticket,
    },
    {
        title: 'تراکنش‌های پرداخت',
        href: adminPaymentsIndex(),
        icon: Receipt,
    },
    {
        title: 'پلن‌های اشتراک',
        href: adminPlansIndex(),
        icon: CreditCard,
    },
    {
        title: 'تنظیمات هوش مصنوعی',
        href: adminAiModelsIndex(),
        icon: Sparkles,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'مخزن',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: FolderGit2,
    },
    {
        title: 'مستندات',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    const { auth } = usePage<{ auth: Auth }>().props;
    const isAdmin = auth.user?.is_admin ?? false;

    return (
        <Sidebar collapsible="icon" variant="inset" side="right">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
                <NavMain items={financialNavItems} label="مالی" />
                {isAdmin && <NavMain items={adminNavItems} label="مدیریت" />}
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}

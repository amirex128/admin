import { Head } from '@inertiajs/react';

import Heading from '@/components/heading';
import { StoreSettingsForm } from '@/components/settings/store-settings-form';
import { index as adminUsersIndex } from '@/routes/admin/users';
import type { GeoOption, StoreSettings } from '@/types';

type PageProps = {
    targetUser: { id: number; name: string; phone: string };
    settings: StoreSettings;
    provinces: GeoOption[];
    cities: GeoOption[];
    shippingMethods: string[];
    updateUrl: string;
};

export default function AdminUserStoreSettings({
    targetUser,
    settings,
    provinces,
    cities,
    shippingMethods,
    updateUrl,
}: PageProps) {
    return (
        <>
            <Head title={`تنظیمات فروشگاه ${targetUser.name}`} />

            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <Heading
                    title={`تنظیمات فروشگاه ${targetUser.name}`}
                    description="ویرایش تنظیمات فروشگاه کاربر از هاب مدیریت."
                />

                <StoreSettingsForm
                    settings={settings}
                    provinces={provinces}
                    cities={cities}
                    shippingMethods={shippingMethods}
                    updateUrl={updateUrl}
                />
            </div>
        </>
    );
}

AdminUserStoreSettings.layout = {
    breadcrumbs: [
        {
            title: 'کاربران',
            href: adminUsersIndex(),
        },
    ],
};

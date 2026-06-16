import { Head } from '@inertiajs/react';

import Heading from '@/components/heading';
import { StoreSettingsForm } from '@/components/settings/store-settings-form';
import type {
    Category,
    GeoOption,
    PackagingType,
    StoreSettings,
    StoreTemplateOption,
} from '@/types';

type PageProps = {
    settings: StoreSettings;
    provinces: GeoOption[];
    cities: GeoOption[];
    shippingMethods: string[];
    updateUrl: string;
    taxonomy: { categories: Category[]; packagingTypes: PackagingType[] };
    templates: StoreTemplateOption[];
    storeBaseDomain: string;
    nameservers: string[];
};

export default function StoreSettingsPage({
    settings,
    provinces,
    cities,
    shippingMethods,
    updateUrl,
    taxonomy,
    templates,
    storeBaseDomain,
    nameservers,
}: PageProps) {
    return (
        <>
            <Head title="تنظیمات فروشگاه" />

            <div className="space-y-6">
                <Heading
                    title="تنظیمات فروشگاه"
                    description="پرداخت، ارسال، موقعیت و قوانین مالی فروشگاه خود را تنظیم کنید."
                    variant="small"
                />

                <StoreSettingsForm
                    settings={settings}
                    provinces={provinces}
                    cities={cities}
                    shippingMethods={shippingMethods}
                    updateUrl={updateUrl}
                    taxonomy={taxonomy}
                    templates={templates}
                    storeBaseDomain={storeBaseDomain}
                    nameservers={nameservers}
                />
            </div>
        </>
    );
}

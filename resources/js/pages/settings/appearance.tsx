import { Head } from '@inertiajs/react';
import AppearanceTabs from '@/components/appearance-tabs';
import Heading from '@/components/heading';
import { edit as editAppearance } from '@/routes/appearance';

export default function Appearance() {
    return (
        <>
            <Head title="تنظیمات ظاهر" />

            <h1 className="sr-only">تنظیمات ظاهر</h1>

            <div className="space-y-6">
                <Heading
                    variant="small"
                    title="تنظیمات ظاهر"
                    description="تنظیمات ظاهری حساب خود را بروزرسانی کنید"
                />
                <AppearanceTabs />
            </div>
        </>
    );
}

Appearance.layout = {
    breadcrumbs: [
        {
            title: 'تنظیمات ظاهر',
            href: editAppearance(),
        },
    ],
};

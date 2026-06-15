import { Form, Head, router, usePage } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import { useState } from 'react';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import DeleteUser from '@/components/delete-user';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { edit } from '@/routes/profile';
import { send } from '@/routes/verification';
import type { Auth, GeoOption } from '@/types';

const NONE = '__none__';

type PageProps = {
    auth: Auth;
};

export default function Profile({
    mustVerifyEmail,
    status,
    provinces,
    cities,
    location,
}: {
    mustVerifyEmail: boolean;
    status?: string;
    provinces: GeoOption[];
    cities: GeoOption[];
    location: { province_id: number | null; city_id: number | null };
}) {
    const { auth } = usePage<PageProps>().props;
    const [provinceId, setProvinceId] = useState<number | null>(
        location.province_id,
    );
    const [cityId, setCityId] = useState<number | null>(location.city_id);

    function changeProvince(value: string) {
        const next = value === NONE ? null : Number(value);
        setProvinceId(next);
        setCityId(null);

        router.reload({
            only: ['cities', 'location'],
            data: { province_id: next ?? undefined },
        });
    }

    return (
        <>
            <Head title="تنظیمات پروفایل" />

            <h1 className="sr-only">تنظیمات پروفایل</h1>

            <div className="space-y-6">
                <Heading
                    variant="small"
                    title="پروفایل"
                    description="نام، شماره موبایل و ایمیل خود را ویرایش کنید"
                />

                <Form
                    {...ProfileController.update.form()}
                    options={{
                        preserveScroll: true,
                    }}
                    className="space-y-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="name">نام و نام خانوادگی</Label>

                                <Input
                                    id="name"
                                    className="mt-1 block w-full"
                                    defaultValue={auth.user.name}
                                    name="name"
                                    required
                                    autoComplete="name"
                                    placeholder="نام کامل"
                                />

                                <InputError
                                    className="mt-2"
                                    message={errors.name}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="phone">شماره موبایل</Label>

                                <Input
                                    id="phone"
                                    type="tel"
                                    className="mt-1 block w-full"
                                    defaultValue={auth.user.phone}
                                    name="phone"
                                    required
                                    autoComplete="tel"
                                    inputMode="numeric"
                                    dir="ltr"
                                    placeholder="09xxxxxxxxx"
                                />

                                <InputError
                                    className="mt-2"
                                    message={errors.phone}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">ایمیل (اختیاری)</Label>

                                <Input
                                    id="email"
                                    type="email"
                                    className="mt-1 block w-full"
                                    defaultValue={auth.user.email ?? ''}
                                    name="email"
                                    autoComplete="email"
                                    placeholder="ایمیل"
                                />

                                <InputError
                                    className="mt-2"
                                    message={errors.email}
                                />
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="province">استان</Label>
                                    <input
                                        type="hidden"
                                        name="province_id"
                                        value={provinceId ?? ''}
                                    />
                                    <Select
                                        value={
                                            provinceId
                                                ? String(provinceId)
                                                : NONE
                                        }
                                        onValueChange={changeProvince}
                                    >
                                        <SelectTrigger id="province">
                                            <SelectValue placeholder="انتخاب استان" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value={NONE}>
                                                — انتخاب نشده —
                                            </SelectItem>
                                            {provinces.map((province) => (
                                                <SelectItem
                                                    key={province.id}
                                                    value={String(province.id)}
                                                >
                                                    {province.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.province_id} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="city">شهر</Label>
                                    <input
                                        type="hidden"
                                        name="city_id"
                                        value={cityId ?? ''}
                                    />
                                    <Select
                                        value={cityId ? String(cityId) : NONE}
                                        onValueChange={(value) =>
                                            setCityId(
                                                value === NONE
                                                    ? null
                                                    : Number(value),
                                            )
                                        }
                                        disabled={!provinceId}
                                    >
                                        <SelectTrigger id="city">
                                            <SelectValue placeholder="انتخاب شهر" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value={NONE}>
                                                — انتخاب نشده —
                                            </SelectItem>
                                            {cities.map((city) => (
                                                <SelectItem
                                                    key={city.id}
                                                    value={String(city.id)}
                                                >
                                                    {city.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.city_id} />
                                </div>
                            </div>

                            {mustVerifyEmail &&
                                auth.user.email_verified_at === null && (
                                    <div>
                                        <p className="-mt-4 text-sm text-muted-foreground">
                                            آدرس ایمیل شما تایید نشده است.{' '}
                                            <Link
                                                href={send()}
                                                as="button"
                                                className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                                            >
                                                برای ارسال مجدد ایمیل تایید
                                                اینجا کلیک کنید.
                                            </Link>
                                        </p>

                                        {status ===
                                            'verification-link-sent' && (
                                            <div className="mt-2 text-sm font-medium text-green-600">
                                                یک لینک تایید جدید به آدرس ایمیل
                                                شما ارسال شد.
                                            </div>
                                        )}
                                    </div>
                                )}

                            <div className="flex items-center gap-4">
                                <Button
                                    disabled={processing}
                                    data-test="update-profile-button"
                                >
                                    ذخیره
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </div>

            <DeleteUser />
        </>
    );
}

Profile.layout = {
    breadcrumbs: [
        {
            title: 'تنظیمات پروفایل',
            href: edit(),
        },
    ],
};

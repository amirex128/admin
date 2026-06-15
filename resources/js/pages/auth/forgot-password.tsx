import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { login } from '@/routes';
import { store, update } from '@/routes/password';

type Step = 'request' | 'reset';

export default function ForgotPassword({ status }: { status?: string }) {
    const [step, setStep] = useState<Step>('request');

    const requestForm = useForm({ phone: '' });
    const resetForm = useForm({
        phone: '',
        code: '',
        password: '',
        password_confirmation: '',
    });

    const submitRequest = (event: React.FormEvent) => {
        event.preventDefault();
        requestForm.post(store().url, {
            preserveScroll: true,
            onSuccess: () => {
                resetForm.setData('phone', requestForm.data.phone);
                setStep('reset');
            },
        });
    };

    const submitReset = (event: React.FormEvent) => {
        event.preventDefault();
        resetForm.post(update().url, {
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title="فراموشی رمز عبور" />

            {status && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    {status}
                </div>
            )}

            {step === 'request' ? (
                <form className="space-y-6" onSubmit={submitRequest}>
                    <div className="grid gap-2">
                        <Label htmlFor="phone">شماره موبایل</Label>
                        <Input
                            id="phone"
                            type="tel"
                            name="phone"
                            required
                            autoFocus
                            autoComplete="tel"
                            inputMode="numeric"
                            dir="ltr"
                            placeholder="09xxxxxxxxx"
                            value={requestForm.data.phone}
                            onChange={(e) =>
                                requestForm.setData('phone', e.target.value)
                            }
                        />
                        <InputError message={requestForm.errors.phone} />
                    </div>

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={requestForm.processing}
                        data-test="send-reset-code-button"
                    >
                        {requestForm.processing && <Spinner />}
                        ارسال کد بازیابی
                    </Button>
                </form>
            ) : (
                <form className="space-y-6" onSubmit={submitReset}>
                    <div className="grid gap-2">
                        <Label htmlFor="code">کد بازیابی</Label>
                        <Input
                            id="code"
                            type="text"
                            name="code"
                            required
                            autoFocus
                            inputMode="numeric"
                            dir="ltr"
                            placeholder="کد ارسال شده"
                            value={resetForm.data.code}
                            onChange={(e) =>
                                resetForm.setData('code', e.target.value)
                            }
                        />
                        <InputError message={resetForm.errors.code} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password">رمز عبور جدید</Label>
                        <PasswordInput
                            id="password"
                            name="password"
                            required
                            autoComplete="new-password"
                            placeholder="رمز عبور جدید"
                            value={resetForm.data.password}
                            onChange={(e) =>
                                resetForm.setData('password', e.target.value)
                            }
                        />
                        <InputError message={resetForm.errors.password} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password_confirmation">
                            تکرار رمز عبور جدید
                        </Label>
                        <PasswordInput
                            id="password_confirmation"
                            name="password_confirmation"
                            required
                            autoComplete="new-password"
                            placeholder="تکرار رمز عبور جدید"
                            value={resetForm.data.password_confirmation}
                            onChange={(e) =>
                                resetForm.setData(
                                    'password_confirmation',
                                    e.target.value,
                                )
                            }
                        />
                        <InputError
                            message={resetForm.errors.password_confirmation}
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={resetForm.processing}
                        data-test="reset-password-button"
                    >
                        {resetForm.processing && <Spinner />}
                        تغییر رمز عبور
                    </Button>

                    <button
                        type="button"
                        className="w-full text-center text-sm text-muted-foreground hover:underline"
                        onClick={() => setStep('request')}
                    >
                        ارسال مجدد کد
                    </button>
                </form>
            )}

            <div className="mt-6 space-x-1 text-center text-sm text-muted-foreground">
                <span>بازگشت به</span>
                <TextLink href={login()}>صفحه ورود</TextLink>
            </div>
        </>
    );
}

ForgotPassword.layout = {
    title: 'فراموشی رمز عبور',
    description:
        'شماره موبایل خود را وارد کنید تا کد بازیابی برایتان ارسال شود',
};

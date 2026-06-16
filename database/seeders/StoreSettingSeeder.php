<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class StoreSettingSeeder extends Seeder
{
    /**
     * Configure a demo storefront for the test user so the public store is
     * reachable at /shop/demo.
     */
    public function run(): void
    {
        $user = User::query()->where('email', 'test@example.com')->first();

        if ($user === null) {
            return;
        }

        $user->storeSetting()->updateOrCreate([], [
            'persian_name' => 'فروشگاه نمونه دیجی‌فای',
            'business_type' => 'پوشاک و لوازم خانگی',
            'store_phone' => '02112345678',
            'subdomain' => 'demo',
            'domain_status' => 'connected',
            'template' => 'classic',
            'card_to_card_enabled' => true,
            'card_holder_name' => 'فروشگاه نمونه',
            'card_number' => '6037997412345678',
            'sheba_number' => 'IR123456789012345678901234',
            'vat_percent' => 9,
            'socials' => [
                'telegram' => 'https://t.me/example',
                'instagram' => 'https://instagram.com/example',
                'whatsapp' => '',
                'eitaa' => '',
                'rubika' => '',
                'bale' => '',
            ],
            'about_us' => '<p>فروشگاه نمونه دیجی‌فای، ارائه‌دهنده محصولات با کیفیت و ارسال سریع به سراسر کشور.</p>',
            'buying_guide' => '<p>برای خرید، محصول مورد نظر را به سبد اضافه کرده و فرآیند پرداخت را تکمیل کنید.</p>',
            'return_policy' => '<p>امکان بازگشت کالا تا ۷ روز پس از دریافت وجود دارد.</p>',
            'terms' => '<p>با خرید از این فروشگاه، قوانین و مقررات را می‌پذیرید.</p>',
            'faqs' => [
                ['question' => 'هزینه ارسال چقدر است؟', 'answer' => 'هزینه ارسال بر اساس روش انتخابی و مقصد محاسبه می‌شود.'],
                ['question' => 'چطور سفارشم را پیگیری کنم؟', 'answer' => 'از بخش پیگیری سفارش با کد سفارش و شماره موبایل اقدام کنید.'],
            ],
            'badges' => [
                ['title' => 'نماد اعتماد الکترونیک', 'description' => 'فروشگاه دارای نماد اعتماد است.', 'html' => '<div class="enamad">نماد اعتماد</div>', 'enabled' => true],
            ],
            'shipping_methods' => [
                'tipax' => ['enabled' => true, 'intra_cost' => 40000, 'inter_cost' => 80000],
                'post' => ['enabled' => true, 'intra_cost' => 25000, 'inter_cost' => 50000],
                'courier' => ['enabled' => true, 'intra_cost' => 30000, 'inter_cost' => 0],
            ],
        ]);
    }
}

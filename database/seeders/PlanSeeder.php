<?php

namespace Database\Seeders;

use App\Models\Plan;
use Illuminate\Database\Seeder;

class PlanSeeder extends Seeder
{
    /**
     * Seed a realistic set of subscription plans.
     */
    public function run(): void
    {
        $plans = [
            [
                'name' => 'پلن برنزی',
                'slug' => 'bronze',
                'description' => 'مناسب برای شروع و کسب‌وکارهای کوچک',
                'price' => 99000,
                'billing_period' => 'monthly',
                'duration_days' => 30,
                'features' => ['۱ کاربر', '۵ گیگابایت فضا', 'پشتیبانی ایمیلی'],
                'discount_percent' => null,
                'discount_badge' => null,
                'is_active' => true,
                'is_featured' => false,
                'sort_order' => 1,
            ],
            [
                'name' => 'پلن نقره‌ای',
                'slug' => 'silver',
                'description' => 'محبوب‌ترین انتخاب کاربران حرفه‌ای',
                'price' => 249000,
                'billing_period' => 'monthly',
                'duration_days' => 30,
                'features' => ['۵ کاربر', '۵۰ گیگابایت فضا', 'پشتیبانی تلفنی', 'گزارش‌های پیشرفته'],
                'discount_percent' => 20,
                'discount_badge' => 'پرفروش',
                'is_active' => true,
                'is_featured' => true,
                'sort_order' => 2,
            ],
            [
                'name' => 'پلن طلایی',
                'slug' => 'gold',
                'description' => 'تمام امکانات برای سازمان‌های بزرگ',
                'price' => 599000,
                'billing_period' => 'yearly',
                'duration_days' => 365,
                'features' => ['کاربر نامحدود', 'فضای نامحدود', 'پشتیبانی اختصاصی ۲۴/۷', 'API اختصاصی'],
                'discount_percent' => 35,
                'discount_badge' => 'پیشنهاد ویژه',
                'is_active' => true,
                'is_featured' => false,
                'sort_order' => 3,
            ],
        ];

        foreach ($plans as $plan) {
            Plan::query()->updateOrCreate(['slug' => $plan['slug']], $plan);
        }
    }
}

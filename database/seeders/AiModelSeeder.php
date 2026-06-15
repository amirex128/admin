<?php

namespace Database\Seeders;

use App\Models\AiModel;
use Illuminate\Database\Seeder;
use Laravel\Ai\Enums\Lab;

class AiModelSeeder extends Seeder
{
    /**
     * Seed a set of ready-to-use AI models across several providers.
     */
    public function run(): void
    {
        $models = [
            ['name' => 'هوش اقتصادی', 'provider' => Lab::OpenAI->value, 'model_identifier' => 'gpt-4o-mini', 'description' => 'سریع و مقرون به صرفه برای توضیحات کوتاه', 'price_per_1k_tokens' => 150, 'sort_order' => 1],
            ['name' => 'هوش پیشرفته', 'provider' => Lab::Anthropic->value, 'model_identifier' => 'claude-haiku-4-5-20251001', 'description' => 'کیفیت بالا برای محتوای حرفه‌ای', 'price_per_1k_tokens' => 600, 'sort_order' => 2],
            ['name' => 'هوش سریع گوگل', 'provider' => Lab::Gemini->value, 'model_identifier' => 'gemini-2.0-flash', 'description' => 'تعادل میان سرعت و کیفیت', 'price_per_1k_tokens' => 300, 'sort_order' => 3],
        ];

        foreach ($models as $model) {
            AiModel::query()->updateOrCreate(
                ['provider' => $model['provider'], 'model_identifier' => $model['model_identifier']],
                $model + ['is_active' => true],
            );
        }
    }
}

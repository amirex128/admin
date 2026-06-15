<?php

namespace Tests\Feature\Products;

use App\Enums\WalletTransactionReason;
use App\Models\AiModel;
use App\Models\User;
use App\Services\Ai\Contracts\ContentGenerator;
use App\Services\Ai\GeneratedContent;
use App\Services\Wallet\WalletService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductAiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->withoutVite();

        $this->app->bind(ContentGenerator::class, fn (): ContentGenerator => new class implements ContentGenerator
        {
            public function generate(string $prompt, AiModel $model): GeneratedContent
            {
                return new GeneratedContent('<p>توضیحات تولید شده</p>', promptTokens: 100, completionTokens: 300);
            }
        });
    }

    public function test_generating_a_description_charges_the_wallet_and_records_token_usage(): void
    {
        $model = AiModel::factory()->create(['price_per_1k_tokens' => 1000]);
        $user = User::factory()->create(['ai_model_id' => $model->id]);
        app(WalletService::class)->deposit($user, 100000, WalletTransactionReason::Charge);

        $response = $this->actingAs($user)->postJson(route('products.ai-description'), [
            'prompt' => 'یک تیشرت نخی قرمز',
        ]);

        $response->assertOk()
            ->assertJson(['tokens' => 400, 'cost' => 400])
            ->assertJsonPath('text', '<p>توضیحات تولید شده</p>');

        $this->assertSame(100000 - 400, app(WalletService::class)->balance($user));

        $transaction = $user->walletTransactions()->latest('id')->first();
        $this->assertSame(WalletTransactionReason::AiContentGeneration, $transaction->reason);
        $this->assertStringContainsString('400 توکن', $transaction->description);
    }

    public function test_generation_fails_without_a_selected_model(): void
    {
        $user = User::factory()->create(['ai_model_id' => null]);

        $this->actingAs($user)->postJson(route('products.ai-description'), ['prompt' => 'متن'])
            ->assertStatus(422)
            ->assertJsonValidationErrorFor('prompt');
    }

    public function test_generation_fails_when_balance_is_insufficient(): void
    {
        $model = AiModel::factory()->create(['price_per_1k_tokens' => 1000]);
        $user = User::factory()->create(['ai_model_id' => $model->id]);

        $this->actingAs($user)->postJson(route('products.ai-description'), ['prompt' => 'متن'])
            ->assertStatus(422)
            ->assertJsonValidationErrorFor('prompt');
    }
}

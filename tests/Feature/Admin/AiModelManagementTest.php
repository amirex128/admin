<?php

namespace Tests\Feature\Admin;

use App\Models\AiModel;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Ai\Enums\Lab;
use Tests\TestCase;

class AiModelManagementTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->withoutVite();
    }

    public function test_an_admin_can_create_an_ai_model(): void
    {
        $admin = User::factory()->admin()->create();

        $this->actingAs($admin)->post(route('admin.ai-models.store'), [
            'name' => 'مدل تست',
            'provider' => Lab::OpenAI->value,
            'model_identifier' => 'gpt-4o-mini',
            'price_per_1k_tokens' => 500,
            'is_active' => true,
        ])->assertRedirect(route('admin.ai-models.index'));

        $this->assertDatabaseHas('ai_models', ['name' => 'مدل تست', 'price_per_1k_tokens' => 500]);
    }

    public function test_a_non_admin_cannot_manage_ai_models(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->get(route('admin.ai-models.index'))->assertForbidden();
    }

    public function test_a_user_can_select_an_active_ai_model(): void
    {
        $model = AiModel::factory()->create();
        $user = User::factory()->create();

        $this->actingAs($user)->get(route('settings.ai.edit'))->assertOk();

        $this->actingAs($user)->put(route('settings.ai.update'), ['ai_model_id' => $model->id])
            ->assertRedirect(route('settings.ai.edit'));

        $this->assertSame($model->id, $user->fresh()->ai_model_id);
    }
}

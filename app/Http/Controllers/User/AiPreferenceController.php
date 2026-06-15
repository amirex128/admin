<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\UpdateAiPreferenceRequest;
use App\Http\Resources\AiModelResource;
use App\Models\AiModel;
use App\Services\Wallet\WalletService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AiPreferenceController extends Controller
{
    public function __construct(private readonly WalletService $walletService) {}

    /**
     * Show the user's AI settings: available models and the current selection.
     */
    public function edit(Request $request): Response
    {
        $user = $request->user();

        return Inertia::render('settings/ai', [
            'models' => AiModelResource::collection(
                AiModel::query()->active()->orderBy('sort_order')->orderBy('name')->get()
            ),
            'selectedModelId' => $user->ai_model_id,
            'balance' => $this->walletService->balance($user),
        ]);
    }

    /**
     * Persist the user's selected AI model.
     */
    public function update(UpdateAiPreferenceRequest $request): RedirectResponse
    {
        $request->user()->update(['ai_model_id' => $request->validated('ai_model_id')]);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'مدل هوش مصنوعی پنل شما بروزرسانی شد.']);

        return to_route('settings.ai.edit');
    }
}

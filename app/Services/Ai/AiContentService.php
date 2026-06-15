<?php

namespace App\Services\Ai;

use App\Enums\WalletTransactionReason;
use App\Models\AiModel;
use App\Models\User;
use App\Services\Ai\Contracts\ContentGenerator;
use App\Services\Wallet\InsufficientBalanceException;
use App\Services\Wallet\WalletService;

/**
 * Orchestrates AI content generation for a user: it resolves the user's chosen
 * model, runs the generation, and bills the wallet for the tokens consumed.
 */
class AiContentService
{
    public function __construct(
        private readonly ContentGenerator $generator,
        private readonly WalletService $walletService,
    ) {}

    /**
     * Generate a product description for the user, charging their wallet for the
     * tokens consumed by the request.
     *
     * @return array{text: string, tokens: int, cost: int, model: string}
     *
     * @throws AiModelNotSelectedException
     * @throws InsufficientBalanceException
     */
    public function generateProductDescription(User $user, string $prompt): array
    {
        $model = $this->resolveModel($user);

        $result = $this->generator->generate($prompt, $model);

        $tokens = $result->totalTokens();
        $cost = $model->costForTokens($tokens);

        if ($cost > 0) {
            $this->walletService->withdraw(
                user: $user,
                amount: $cost,
                reason: WalletTransactionReason::AiContentGeneration,
                description: "تولید محتوا با هوش مصنوعی — مصرف {$tokens} توکن",
                reference: $model,
                meta: [
                    'tokens' => $tokens,
                    'prompt_tokens' => $result->promptTokens,
                    'completion_tokens' => $result->completionTokens,
                    'model' => $model->name,
                ],
            );
        }

        return [
            'text' => $result->text,
            'tokens' => $tokens,
            'cost' => $cost,
            'model' => $model->name,
        ];
    }

    /**
     * Resolve the active AI model selected by the user.
     *
     * @throws AiModelNotSelectedException
     */
    protected function resolveModel(User $user): AiModel
    {
        $model = $user->aiModel;

        if ($model === null || ! $model->is_active) {
            throw new AiModelNotSelectedException;
        }

        return $model;
    }
}

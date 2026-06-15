<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\GenerateProductDescriptionRequest;
use App\Services\Ai\AiContentService;
use App\Services\Ai\AiModelNotSelectedException;
use App\Services\Wallet\InsufficientBalanceException;
use Illuminate\Http\JsonResponse;

class ProductAiController extends Controller
{
    public function __construct(private readonly AiContentService $aiContentService) {}

    /**
     * Generate a product description with AI, charging the user's wallet.
     *
     * The application only renders JSON exceptions for `api/*` routes, so
     * validation-style failures are returned explicitly here as 422 JSON.
     */
    public function generateDescription(GenerateProductDescriptionRequest $request): JsonResponse
    {
        try {
            $result = $this->aiContentService->generateProductDescription(
                $request->user(),
                $request->validated('prompt'),
            );
        } catch (AiModelNotSelectedException $exception) {
            return $this->error($exception->getMessage());
        } catch (InsufficientBalanceException) {
            return $this->error('موجودی کیف پول شما برای استفاده از هوش مصنوعی کافی نیست.');
        }

        return response()->json($result);
    }

    /**
     * Build a validation-shaped 422 JSON error response.
     */
    protected function error(string $message): JsonResponse
    {
        return response()->json([
            'message' => $message,
            'errors' => ['prompt' => [$message]],
        ], 422);
    }
}

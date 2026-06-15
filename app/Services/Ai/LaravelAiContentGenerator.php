<?php

namespace App\Services\Ai;

use App\Models\AiModel;
use App\Services\Ai\Contracts\ContentGenerator;

use function Laravel\Ai\agent;

/**
 * Generates content through the first-party Laravel AI SDK, dispatching the
 * request to whichever provider and model the administrator configured.
 */
class LaravelAiContentGenerator implements ContentGenerator
{
    /**
     * The system instructions guiding product description generation.
     */
    protected string $instructions = 'You are an expert Persian e-commerce copywriter. '
        .'Write a clear, attractive and SEO friendly product description in Persian. '
        .'Return clean HTML using only <p>, <ul>, <li>, <strong> and <br> tags.';

    /**
     * Generate text for the given prompt using the provided model.
     */
    public function generate(string $prompt, AiModel $model): GeneratedContent
    {
        $response = agent(instructions: $this->instructions)
            ->prompt($prompt, provider: $model->lab(), model: $model->model_identifier);

        return new GeneratedContent(
            text: $response->text,
            promptTokens: $response->usage->promptTokens,
            completionTokens: $response->usage->completionTokens,
        );
    }
}

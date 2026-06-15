<?php

namespace App\Services\Ai\Contracts;

use App\Models\AiModel;
use App\Services\Ai\GeneratedContent;

/**
 * Abstraction over the underlying AI provider used to generate text content.
 *
 * Implementations translate a prompt and a configured model into generated
 * text along with the token usage required to bill the request.
 */
interface ContentGenerator
{
    /**
     * Generate text for the given prompt using the provided model.
     */
    public function generate(string $prompt, AiModel $model): GeneratedContent;
}

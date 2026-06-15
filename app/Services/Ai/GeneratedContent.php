<?php

namespace App\Services\Ai;

/**
 * The result of an AI content generation request.
 */
class GeneratedContent
{
    public function __construct(
        public readonly string $text,
        public readonly int $promptTokens,
        public readonly int $completionTokens,
    ) {}

    /**
     * The total number of tokens consumed by the request.
     */
    public function totalTokens(): int
    {
        return $this->promptTokens + $this->completionTokens;
    }
}

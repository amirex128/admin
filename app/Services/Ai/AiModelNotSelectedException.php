<?php

namespace App\Services\Ai;

use RuntimeException;

/**
 * Thrown when a user attempts an AI operation without having selected a model.
 */
class AiModelNotSelectedException extends RuntimeException
{
    public function __construct(string $message = 'هیچ مدل هوش مصنوعی برای پنل شما انتخاب نشده است.')
    {
        parent::__construct($message);
    }
}

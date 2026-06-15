<?php

namespace App\Services\Wallet;

use RuntimeException;

/**
 * Thrown when a withdrawal would push a wallet below a zero balance.
 */
class InsufficientBalanceException extends RuntimeException
{
    public function __construct(string $message = 'موجودی کیف پول کافی نیست.')
    {
        parent::__construct($message);
    }
}

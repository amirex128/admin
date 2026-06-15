<?php

namespace App\Services\Payment;

use RuntimeException;

/**
 * Thrown when a payment gateway operation fails (network, validation or a
 * non-successful response from the provider).
 */
class GatewayException extends RuntimeException {}

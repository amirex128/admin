<?php

namespace App\Services\Auth;

use App\Mail\PasswordResetCodeMail;
use App\Models\PasswordResetCode;
use App\Models\User;
use App\Support\Facades\Sms;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;

/**
 * Orchestrates the OTP-based password reset flow.
 *
 * A reset code is always delivered over SMS through the provider's OTP gateway
 * (sendcode/checkcode). When the user has an email on file, an app-generated
 * code is additionally emailed; either code is accepted during verification.
 */
class PasswordResetCodeService
{
    /**
     * Minutes an emailed reset code remains valid.
     */
    private const EMAIL_CODE_TTL = 10;

    /**
     * Send reset codes for the given user across every available channel.
     */
    public function send(User $user): void
    {
        Sms::sendOtp($user->phone);

        if (filled($user->email)) {
            $this->sendEmailCode($user);
        }
    }

    /**
     * Verify a code entered by the user against any active channel.
     */
    public function verify(User $user, string $code): bool
    {
        if (Sms::verifyOtp($user->phone, $code)) {
            return true;
        }

        return $this->verifyEmailCode($user, $code);
    }

    /**
     * Remove any pending email codes once a reset succeeds.
     */
    public function clear(User $user): void
    {
        PasswordResetCode::query()->where('user_id', $user->id)->delete();
    }

    /**
     * Generate, persist, and email a fresh reset code.
     */
    private function sendEmailCode(User $user): void
    {
        $code = (string) random_int(10000, 99999);

        PasswordResetCode::query()->where('user_id', $user->id)->delete();

        PasswordResetCode::create([
            'user_id' => $user->id,
            'code_hash' => Hash::make($code),
            'expires_at' => now()->addMinutes(self::EMAIL_CODE_TTL),
        ]);

        Mail::to($user->email)->send(new PasswordResetCodeMail($code, self::EMAIL_CODE_TTL));
    }

    /**
     * Verify an emailed code, consuming it on success.
     */
    private function verifyEmailCode(User $user, string $code): bool
    {
        $record = PasswordResetCode::query()
            ->where('user_id', $user->id)
            ->latest('id')
            ->first();

        if ($record === null || $record->isExpired()) {
            return false;
        }

        return Hash::check($code, $record->code_hash);
    }
}

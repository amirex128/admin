<?php

namespace App\Actions\Fortify;

use App\Concerns\PasswordValidationRules;
use App\Concerns\PhoneValidationRules;
use App\Concerns\ProfileValidationRules;
use App\Models\User;
use App\Support\Facades\Sms;
use Illuminate\Support\Facades\Validator;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules, PhoneValidationRules, ProfileValidationRules;

    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        $input['referral_code'] = blank($input['referral_code'] ?? null) ? null : $input['referral_code'];

        Validator::make($input, [
            'name' => $this->nameRules(),
            'phone' => $this->phoneRules(),
            'password' => $this->passwordRules(),
            'referral_code' => ['nullable', 'string', 'exists:users,referral_code'],
        ], [
            'referral_code.exists' => __('The referral code is invalid.'),
        ])->validate();

        $referrer = $input['referral_code'] === null
            ? null
            : User::query()->where('referral_code', $input['referral_code'])->first();

        $user = User::create([
            'name' => $input['name'],
            'phone' => $input['phone'],
            'password' => $input['password'],
            'referral_code' => User::generateReferralCode(),
            'referred_by' => $referrer?->id,
        ]);

        Sms::sendWelcome($user->phone, $user->name);

        return $user;
    }
}

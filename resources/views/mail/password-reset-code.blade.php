<x-mail::message>
# {{ __('Password reset code') }}

{{ __('Use the following code to reset your account password:') }}

<x-mail::panel>
# {{ $code }}
</x-mail::panel>

{{ __('This code is valid for :minutes minutes.', ['minutes' => $expiresInMinutes]) }}

{{ __('If you did not request a password reset, no further action is required.') }}

{{ __('Thanks') }},<br>
{{ config('app.name') }}
</x-mail::message>

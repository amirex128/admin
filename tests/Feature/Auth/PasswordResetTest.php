<?php

namespace Tests\Feature\Auth;

use App\Mail\PasswordResetCodeMail;
use App\Models\PasswordResetCode;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class PasswordResetTest extends TestCase
{
    use RefreshDatabase;

    public function test_forgot_password_screen_can_be_rendered()
    {
        $response = $this->get(route('password.request'));

        $response->assertOk();
    }

    public function test_a_reset_code_is_sent_over_sms()
    {
        Http::fake(['*' => Http::response(['Success' => true])]);

        $user = User::factory()->create(['phone' => '09121112233', 'email' => null]);

        $this->post(route('password.store'), ['phone' => $user->phone])
            ->assertSessionHasNoErrors();

        Http::assertSent(fn ($request) => str_contains($request->url(), 'sendcode')
            && $request['Mobile'] === '09121112233',
        );
    }

    public function test_a_reset_code_is_emailed_when_the_user_has_an_email()
    {
        Http::fake(['*' => Http::response(['Success' => true])]);
        Mail::fake();

        $user = User::factory()->create(['phone' => '09121112244', 'email' => 'reset@example.com']);

        $this->post(route('password.store'), ['phone' => $user->phone]);

        Mail::assertSent(PasswordResetCodeMail::class);
        $this->assertDatabaseHas('password_reset_codes', ['user_id' => $user->id]);
    }

    public function test_password_can_be_reset_with_a_valid_sms_code()
    {
        Http::fake(function ($request) {
            $success = ! str_contains($request->url(), 'checkcode') || $request['Code'] === '12345';

            return Http::response(['Success' => $success]);
        });

        $user = User::factory()->create(['phone' => '09121112255']);

        $response = $this->post(route('password.update'), [
            'phone' => $user->phone,
            'code' => '12345',
            'password' => 'new-password',
            'password_confirmation' => 'new-password',
        ]);

        $response->assertSessionHasNoErrors()->assertRedirect(route('login'));
        $this->assertTrue(Hash::check('new-password', $user->fresh()->password));
    }

    public function test_password_can_be_reset_with_a_valid_email_code()
    {
        Http::fake(['*' => Http::response(['Success' => false])]);

        $user = User::factory()->create(['phone' => '09121112266', 'email' => 'reset@example.com']);

        PasswordResetCode::create([
            'user_id' => $user->id,
            'code_hash' => Hash::make('54321'),
            'expires_at' => now()->addMinutes(10),
        ]);

        $response = $this->post(route('password.update'), [
            'phone' => $user->phone,
            'code' => '54321',
            'password' => 'new-password',
            'password_confirmation' => 'new-password',
        ]);

        $response->assertSessionHasNoErrors()->assertRedirect(route('login'));
        $this->assertTrue(Hash::check('new-password', $user->fresh()->password));
        $this->assertDatabaseMissing('password_reset_codes', ['user_id' => $user->id]);
    }

    public function test_password_cannot_be_reset_with_an_invalid_code()
    {
        Http::fake(['*' => Http::response(['Success' => false])]);

        $user = User::factory()->create(['phone' => '09121112277']);

        $response = $this->from(route('password.request'))->post(route('password.update'), [
            'phone' => $user->phone,
            'code' => '00000',
            'password' => 'new-password',
            'password_confirmation' => 'new-password',
        ]);

        $response->assertSessionHasErrors('code');
        $this->assertFalse(Hash::check('new-password', $user->fresh()->password));
    }
}

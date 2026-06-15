<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Laravel\Fortify\Features;
use Tests\TestCase;

class RegistrationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->skipUnlessFortifyHas(Features::registration());

        Http::fake([
            '*' => Http::response(['Success' => true, 'Message' => 'ok']),
        ]);
    }

    public function test_registration_screen_can_be_rendered()
    {
        $response = $this->get(route('register'));

        $response->assertOk();
    }

    public function test_new_users_can_register_with_phone()
    {
        $response = $this->post(route('register.store'), [
            'name' => 'Test User',
            'phone' => '09121234567',
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect(route('dashboard', absolute: false));

        $user = User::query()->where('phone', '09121234567')->first();
        $this->assertNotNull($user);
        $this->assertNotNull($user->referral_code);
        $this->assertNull($user->referred_by);
    }

    public function test_registration_requires_a_valid_iranian_mobile_number()
    {
        $response = $this->from(route('register'))->post(route('register.store'), [
            'name' => 'Test User',
            'phone' => '12345',
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        $response->assertSessionHasErrors('phone');
        $this->assertGuest();
    }

    public function test_a_welcome_sms_is_sent_after_registration()
    {
        $this->post(route('register.store'), [
            'name' => 'Test User',
            'phone' => '09121234567',
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        Http::assertSent(fn ($request) => str_contains($request->url(), 'sendpatternmessage')
            && $request['MobileNumber'] === '09121234567',
        );
    }

    public function test_a_referral_code_links_the_new_user_to_the_referrer()
    {
        $referrer = User::factory()->create(['referral_code' => 'INVITE10']);

        $this->post(route('register.store'), [
            'name' => 'Referred User',
            'phone' => '09120000001',
            'password' => 'password',
            'password_confirmation' => 'password',
            'referral_code' => 'INVITE10',
        ]);

        $user = User::query()->where('phone', '09120000001')->first();
        $this->assertNotNull($user);
        $this->assertSame($referrer->id, $user->referred_by);
        $this->assertTrue($referrer->referrals()->whereKey($user->id)->exists());
    }

    public function test_registration_fails_with_an_unknown_referral_code()
    {
        $response = $this->from(route('register'))->post(route('register.store'), [
            'name' => 'Referred User',
            'phone' => '09120000002',
            'password' => 'password',
            'password_confirmation' => 'password',
            'referral_code' => 'DOESNOTEXIST',
        ]);

        $response->assertSessionHasErrors('referral_code');
        $this->assertGuest();
    }
}

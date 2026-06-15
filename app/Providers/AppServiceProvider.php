<?php

namespace App\Providers;

use App\Services\Ai\Contracts\ContentGenerator;
use App\Services\Ai\LaravelAiContentGenerator;
use App\Services\Sms\Contracts\SmsProvider;
use App\Services\Sms\Providers\LimoSmsProvider;
use App\Services\Sms\SmsManager;
use Carbon\CarbonImmutable;
use Illuminate\Http\Client\Factory as HttpClient;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->registerSmsServices();

        $this->app->bind(ContentGenerator::class, LaravelAiContentGenerator::class);
    }

    /**
     * Bind the central SMS service and its configured gateway.
     */
    protected function registerSmsServices(): void
    {
        $this->app->singleton(SmsProvider::class, fn ($app): LimoSmsProvider => new LimoSmsProvider(
            $app->make(HttpClient::class),
            $app->make('config')->get('services.limosms'),
        ));

        $this->app->singleton('sms', fn ($app): SmsManager => new SmsManager(
            $app->make(SmsProvider::class),
            $app->make('config')->get('services.limosms.patterns', []),
        ));

        $this->app->alias('sms', SmsManager::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureDefaults();
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null,
        );
    }
}

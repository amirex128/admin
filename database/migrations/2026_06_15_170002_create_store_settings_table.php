<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('store_settings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained()->cascadeOnDelete();

            // Store location (used to decide intra vs inter-city shipping).
            $table->foreignId('province_id')->nullable()->constrained('provinces')->nullOnDelete();
            $table->foreignId('city_id')->nullable()->constrained('cities')->nullOnDelete();

            // Card-to-card payment.
            $table->boolean('card_to_card_enabled')->default(false);
            $table->string('card_holder_name')->nullable();
            $table->string('card_number')->nullable();
            $table->string('sheba_number')->nullable();

            // Per-store ZarinPal gateway (separate from the platform gateway used
            // for wallet top-ups, which is read from config/env).
            $table->boolean('zarinpal_enabled')->default(false);
            $table->string('zarinpal_merchant_id')->nullable();
            $table->text('zarinpal_access_token')->nullable();

            // Finance.
            $table->unsignedInteger('vat_percent')->default(0);
            $table->unsignedInteger('refund_window_minutes')->default(30);

            // Shipping: per-method config + intra/inter-city delivery timing.
            $table->json('shipping_methods')->nullable();
            $table->unsignedInteger('intra_city_days')->default(1);
            $table->unsignedInteger('inter_city_days')->default(3);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('store_settings');
    }
};

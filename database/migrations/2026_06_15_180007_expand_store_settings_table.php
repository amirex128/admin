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
        Schema::table('store_settings', function (Blueprint $table) {
            // Storefront identity & contact.
            $table->string('persian_name')->nullable()->after('user_id');
            $table->string('business_type')->nullable()->after('persian_name');
            $table->string('store_phone')->nullable()->after('business_type');
            $table->string('postal_code')->nullable()->after('city_id');
            $table->decimal('latitude', 10, 7)->nullable()->after('postal_code');
            $table->decimal('longitude', 10, 7)->nullable()->after('latitude');

            // Social networks (telegram, whatsapp, instagram, eitaa, rubika, bale).
            $table->json('socials')->nullable()->after('longitude');

            // Rich-text content pages.
            $table->longText('about_us')->nullable();
            $table->longText('buying_guide')->nullable();
            $table->longText('return_policy')->nullable();
            $table->longText('terms')->nullable();

            // FAQ entries and trust badges/licenses (stored as JSON arrays).
            $table->json('faqs')->nullable();
            $table->json('badges')->nullable();

            // Domain & template.
            $table->string('subdomain')->nullable()->unique();
            $table->string('custom_domain')->nullable()->unique();
            $table->string('domain_status')->default('none');
            $table->string('template')->default('classic');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('store_settings', function (Blueprint $table) {
            $table->dropColumn([
                'persian_name', 'business_type', 'store_phone', 'postal_code',
                'latitude', 'longitude', 'socials', 'about_us', 'buying_guide',
                'return_policy', 'terms', 'faqs', 'badges', 'subdomain',
                'custom_domain', 'domain_status', 'template',
            ]);
        });
    }
};

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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('parent_id')->nullable()->constrained('products')->cascadeOnDelete();
            $table->foreignId('category_id')->nullable()->constrained('categories')->nullOnDelete();
            $table->foreignId('packaging_type_id')->nullable()->constrained('packaging_types')->nullOnDelete();
            $table->string('name');
            $table->string('sku')->nullable();
            $table->longText('description')->nullable();
            $table->unsignedInteger('weight')->nullable();
            $table->string('sales_unit')->default('piece');
            $table->boolean('is_special_offer')->default(false);
            $table->string('order_mode')->default('direct');
            $table->boolean('is_active')->default(true);
            $table->unsignedBigInteger('price')->default(0);
            $table->unsignedInteger('stock')->default(0);
            $table->unsignedInteger('discount_percent')->nullable();
            $table->json('variation_attributes')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();

            $table->index(['user_id', 'parent_id']);
            $table->index(['user_id', 'sku']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};

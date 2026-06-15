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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('code')->unique();
            $table->string('status')->default('proforma');
            $table->string('payment_status')->default('unpaid');

            $table->string('customer_name');
            $table->string('customer_phone')->nullable();
            $table->string('province')->nullable();
            $table->string('city')->nullable();
            $table->text('address')->nullable();

            $table->string('shipping_method')->nullable();
            $table->string('payment_method')->nullable();
            $table->string('tracking_code')->nullable();

            $table->unsignedBigInteger('subtotal')->default(0)->comment('Items total before tax/shipping, in Toman');
            $table->unsignedInteger('tax_percent')->default(0);
            $table->unsignedBigInteger('tax_amount')->default(0)->comment('In Toman');
            $table->unsignedBigInteger('shipping_cost')->default(0)->comment('In Toman');
            $table->unsignedBigInteger('total')->default(0)->comment('Grand total, in Toman');

            $table->text('note')->nullable();

            $table->timestamp('shipped_at')->nullable();
            $table->timestamp('delivered_at')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'status']);
            $table->index(['user_id', 'payment_status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};

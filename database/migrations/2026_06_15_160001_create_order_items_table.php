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
        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->cascadeOnDelete();
            $table->foreignId('product_id')->nullable()->constrained('products')->nullOnDelete();
            $table->string('name');
            $table->string('sales_unit')->nullable();
            $table->unsignedBigInteger('unit_price')->default(0)->comment('In Toman');
            $table->unsignedInteger('quantity')->default(1);
            $table->unsignedInteger('discount_percent')->default(0);
            $table->unsignedBigInteger('total')->default(0)->comment('Line total after discount, in Toman');
            $table->timestamps();

            $table->index('order_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_items');
    }
};

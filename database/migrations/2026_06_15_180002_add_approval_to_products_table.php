<?php

use App\Enums\ProductApprovalStatus;
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
        Schema::table('products', function (Blueprint $table) {
            $table->string('approval_status')
                ->default(ProductApprovalStatus::Pending->value)
                ->after('is_active');
            $table->string('rejection_reason', 1000)->nullable()->after('approval_status');
            $table->timestamp('reviewed_at')->nullable()->after('rejection_reason');

            $table->index(['user_id', 'approval_status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropIndex(['user_id', 'approval_status']);
            $table->dropColumn(['approval_status', 'rejection_reason', 'reviewed_at']);
        });
    }
};

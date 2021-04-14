<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePagesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('pages', function (Blueprint $table) {
            $table->id();
            $table->integer('user_id');
            $table->string('title', 300);
            $table->string('description', 300);
            $table->string('slug', 500);
            $table->text('body');
            $table->string('thumbnail', 500);
            $table->enum('status', ['draft', 'publish', 'schedule'])->default('draft');
            $table->enum('robots', ['noindex', 'nofollow', 'none', 'all'])->default('all');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('pages');
    }
}

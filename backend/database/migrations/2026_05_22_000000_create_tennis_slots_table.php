<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tennis_slots', function (Blueprint $table) {
            $table->id();
            $table->date('date');
            $table->time('time');
            $table->string('court', 100);
            $table->string('level', 50)->default('Qualquer Nível');
            $table->text('notes')->nullable();
            $table->enum('status', ['available', 'booked'])->default('available');
            $table->string('challenger_name', 100)->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tennis_slots');
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained('companies')->cascadeOnDelete();
            $table->string('external_id');
            $table->string('name');
            $table->decimal('commission_rate', 5, 2);
            $table->boolean('active')->default(true);
            $table->timestamps();

            // Mesmo external_id não pode repetir na mesma empresa
            $table->unique(['company_id', 'external_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
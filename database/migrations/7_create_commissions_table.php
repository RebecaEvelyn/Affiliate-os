<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('commissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained('companies')->cascadeOnDelete();
            $table->foreignId('affiliate_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('product_id')->constrained('products')->cascadeOnDelete();
            $table->foreignId('coupon_id')->nullable()->constrained('coupons')->nullOnDelete();
            $table->string('order_id');
            $table->decimal('amount', 10, 2);
            $table->decimal('commission', 10, 2);
            $table->enum('status', ['ativa', 'paga', 'cancelada'])->default('ativa');
            $table->timestamps();

            // Evita registar a mesma venda duas vezes
            $table->unique(['company_id', 'order_id', 'product_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('commissions');
    }
};
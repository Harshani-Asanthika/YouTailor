<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->constrained('client_details')->onDelete('cascade'); 
            $table->string('cloth_name');
            $table->string('size', 50);
            $table->integer('quantity');
            $table->string('mobile', 15);
            $table->text('address');
            $table->text('instructions')->nullable();
            $table->string('status')->default('Pending');
            $table->string('design_image')->nullable();
            $table->timestamps();
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

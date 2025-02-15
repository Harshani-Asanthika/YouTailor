<?php

use App\Models\TailorDetail;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {


        
        Schema::create('tailor_details', function (Blueprint $table) {
            $table->id();  // Auto-incrementing primary key
            $table->string('fname');  // First Name column
            $table->string('lname');  // Last Name column
            $table->string('username')->unique();  // Username column (unique constraint)
            $table->string('email')->unique();  // Email column (unique constraint)
            $table->string('password');  // Password column
            $table->timestamps();  // Created_at and updated_at timestamps
        });
    }
    

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tailor_details');
    }
};

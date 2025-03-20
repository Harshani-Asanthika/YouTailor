<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;

class Client extends Authenticatable
{
    use HasFactory;

    // Specify the table name
    protected $table = "client_details"; // Ensure this points to the `clients` table

    // Fields that can be mass-assigned
    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'mobile',
        'password',
    ];

    // Fields to hide when serializing the model
    protected $hidden = [
        'password',
        'remember_token',
    ];
}
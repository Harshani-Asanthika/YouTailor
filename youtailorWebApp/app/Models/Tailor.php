<?php

namespace App\Models;

use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;

class Tailor extends Authenticatable
{
    use HasFactory, Notifiable;

    // --- Add or update this line! ---
    protected $table = 'tailor_details'; // <--- THIS IS THE FIX

    protected $primaryKey = 'id'; // Assuming 'id' is your primary key. If it's 'tailor_id', change this line too.

    protected $fillable = [
        'fname',
        'lname',
        'email',
        'username',
        'password',
        'mobile',
        'address',
        'avatar',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    // ... other methods/relationships for your Tailor model
}
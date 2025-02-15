<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Support\Facades\Hash;

class Tailor extends Authenticatable
{
    use HasFactory;
    
    protected $table = "tailor_details";

    // Allow mass-assignment for these fields
    protected $fillable = [
        'fname', 'lname', 'username', 'email', 'password'
    ];

    protected $hidden = [
        'password',
        'username'
    ];

    public function setPasswordAttribute($value){

        $this->attributes['password'] = Hash::make($value);
    }


}

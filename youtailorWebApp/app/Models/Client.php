<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class Client extends Authenticatable
{
    use Notifiable;
    
    protected $table = 'client_details';
    protected $primaryKey = 'client_id'; // Add this if your primary key is different
    
    protected $fillable = [
        'fname', 'lname', 'email', 'username', 'password',
        'mobile', 'address'
    ];

    protected $hidden = [
        'password', 'remember_token',
    ];
}
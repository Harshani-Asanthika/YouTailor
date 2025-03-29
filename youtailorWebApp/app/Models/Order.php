<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $table = 'orders'; // Optional if table name differs from default

    protected $fillable = [
        'client_id',
        'cloth_name',
        'size',
        'quantity',
        'mobile',
        'address',
        'instructions',
        'design_image',
        'status'
    ];

    protected $casts = [
        'design_image' => 'array', // If storing multiple images as JSON
        'status' => 'string',
    ];

    // Relationship with Client Model
    public function client()
    {
        return $this->belongsTo(Client::class);
    }
}

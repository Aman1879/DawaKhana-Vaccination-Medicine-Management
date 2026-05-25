<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Medicine extends Model
{
    protected $fillable = [
        'name',
        'type',
        'description',
        'stock',
        'price',
        'available',
    ];

    protected $casts = [
        'stock' => 'integer',
        'price' => 'decimal:2',
        'available' => 'boolean',
    ];
}

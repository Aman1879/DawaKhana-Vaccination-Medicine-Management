<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Vaccine extends Model
{
    protected $fillable = [
        'vaccine_name',
        'category',
        'stock',
        'expiry_date',
        'batch_number',
        'manufacturer',
    ];

    protected $casts = [
        'stock' => 'integer',
        'expiry_date' => 'date',
    ];
}

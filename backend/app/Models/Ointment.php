<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ointment extends Model
{
    protected $fillable = [
        'ointment_name',
        'type',
        'stock',
        'expiry_date',
        'manufacturer',
    ];

    protected $casts = [
        'stock' => 'integer',
        'expiry_date' => 'date',
    ];
}

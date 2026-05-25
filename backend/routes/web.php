<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'message' => 'Smart Vaccine & Ointment Management System API',
        'status' => 'running',
    ]);
});

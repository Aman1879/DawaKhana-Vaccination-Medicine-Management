<?php

use Illuminate\Support\Facades\Artisan;

Artisan::command('app:heartbeat', function () {
    $this->comment('Smart Vaccine & Ointment Management System is running.');
})->purpose('Display application status');

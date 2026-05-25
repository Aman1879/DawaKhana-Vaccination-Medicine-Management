<?php

use App\Http\Controllers\Api\V1\AppointmentController;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\DashboardController;
use App\Http\Controllers\Api\V1\NotificationController;
use App\Http\Controllers\Api\V1\OintmentController;
use App\Http\Controllers\Api\V1\UserController;
use App\Http\Controllers\Api\V1\VaccineController;
use App\Http\Controllers\Api\V1\MedicineController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::post('/auth/login', [AuthController::class, 'login']);
    Route::post('/auth/forgot-password', [AuthController::class, 'forgotPassword']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/auth/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);
        Route::put('/profile', [UserController::class, 'update']);
        Route::put('/profile/password', [UserController::class, 'changePassword']);

        Route::get('/vaccines', [VaccineController::class, 'index']);
        Route::get('/vaccines/{vaccine}', [VaccineController::class, 'show']);
        Route::get('/ointments', [OintmentController::class, 'index']);
        Route::get('/ointments/{ointment}', [OintmentController::class, 'show']);
        Route::get('/medicines', [MedicineController::class, 'index']);
        Route::get('/medicines/{medicine}', [MedicineController::class, 'show']);

        Route::get('/appointments', [AppointmentController::class, 'index']);
        Route::post('/appointments', [AppointmentController::class, 'store']);
        Route::get('/appointments/{appointment}', [AppointmentController::class, 'show']);

        Route::get('/notifications', [NotificationController::class, 'index']);
        Route::patch('/notifications/{notification}/read', [NotificationController::class, 'markAsRead']);

        Route::middleware('role:admin')->group(function () {
            Route::get('/dashboard/analytics', [DashboardController::class, 'analytics']);

            Route::get('/users', [UserController::class, 'index']);
            Route::get('/users/{user}', [UserController::class, 'show']);
            Route::put('/users/{user}', [UserController::class, 'adminUpdate']);
            Route::patch('/users/{user}/block', [UserController::class, 'block']);
            Route::delete('/users/{user}', [UserController::class, 'destroy']);

            Route::post('/vaccines', [VaccineController::class, 'store']);
            Route::put('/vaccines/{vaccine}', [VaccineController::class, 'update']);
            Route::delete('/vaccines/{vaccine}', [VaccineController::class, 'destroy']);

            Route::post('/ointments', [OintmentController::class, 'store']);
            Route::put('/ointments/{ointment}', [OintmentController::class, 'update']);
            Route::delete('/ointments/{ointment}', [OintmentController::class, 'destroy']);

            Route::post('/medicines', [MedicineController::class, 'store']);
            Route::put('/medicines/{medicine}', [MedicineController::class, 'update']);
            Route::delete('/medicines/{medicine}', [MedicineController::class, 'destroy']);

            Route::put('/appointments/{appointment}', [AppointmentController::class, 'update']);
            Route::delete('/appointments/{appointment}', [AppointmentController::class, 'destroy']);

            Route::post('/notifications', [NotificationController::class, 'store']);
        });
    });
});

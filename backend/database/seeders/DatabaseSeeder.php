<?php

namespace Database\Seeders;

use App\Models\Appointment;
use App\Models\Notification;
use App\Models\Ointment;
use App\Models\User;
use App\Models\Vaccine;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::firstOrCreate([
            'email' => 'admin@demo.local',
        ], [
            'name' => 'System Admin',
            'password' => Hash::make('password123'),
            'role' => 'admin',
            'phone' => '555-0100',
            'age' => 34,
            'medical_history' => [],
        ]);

        $user = User::firstOrCreate([
            'email' => 'user@demo.local',
        ], [
            'name' => 'Demo Patient',
            'password' => Hash::make('password123'),
            'role' => 'user',
            'phone' => '555-0111',
            'age' => 28,
            'medical_history' => ['allergy' => 'none'],
        ]);

        Vaccine::create([
            'vaccine_name' => 'Influenza Shield',
            'category' => 'Adult',
            'stock' => 120,
            'expiry_date' => now()->addMonths(8),
            'batch_number' => 'FLU-21-09',
            'manufacturer' => 'MediCore Labs',
        ]);

        Ointment::create([
            'ointment_name' => 'Derma Relief',
            'type' => 'Topical',
            'stock' => 80,
            'expiry_date' => now()->addMonths(6),
            'manufacturer' => 'SkinTide',
        ]);

            // Seed sample medicines for admin management
            \App\Models\Medicine::create([
                'name' => 'Panacea Vaccine Syringe',
                'type' => 'Vaccine',
                'description' => 'Universal booster syringe',
                'stock' => 50,
                'price' => 19.99,
                'available' => true,
            ]);

            \App\Models\Medicine::create([
                'name' => 'Healing Ointment',
                'type' => 'Ointment',
                'description' => 'Topical ointment for wound care',
                'stock' => 120,
                'price' => 7.5,
                'available' => true,
            ]);

        Appointment::create([
            'user_id' => $user->getKey(),
            'vaccine_id' => null,
            'ointment_id' => null,
            'appointment_date' => now()->addDays(3),
            'time_slot' => '09:00 - 09:30',
            'status' => 'pending',
            'notes' => 'Seasonal vaccination',
        ]);

        Notification::create([
            'user_id' => $admin->getKey(),
            'title' => 'Low stock alert',
            'message' => 'Burn Ease has fallen below the minimum threshold.',
            'read_status' => false,
        ]);
    }
}

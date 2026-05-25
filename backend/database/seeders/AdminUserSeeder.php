<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        if (! User::where('email', 'admin@demo.local')->exists()) {
            User::create([
                'name' => 'System Admin',
                'email' => 'admin@demo.local',
                'password' => Hash::make('password123'),
                'role' => 'admin',
                'phone' => '555-0100',
                'age' => 34,
                'medical_history' => [],
            ]);
        }
    }
}

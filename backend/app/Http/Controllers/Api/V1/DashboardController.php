<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\Appointment;
use App\Models\Medicine;
use App\Models\Notification;
use App\Models\Ointment;
use App\Models\User;
use App\Models\Vaccine;
use Illuminate\Support\Carbon;

class DashboardController extends BaseController
{
    public function analytics()
    {
        $today = Carbon::today();
        $last7Days = collect(range(6, 0))->map(function ($offset) use ($today) {
            $date = $today->copy()->subDays($offset);

            return [
                'name' => $date->format('D'),
                'date' => $date->toDateString(),
                'appointments' => Appointment::whereDate('appointment_date', $date)->count(),
                'approved' => Appointment::whereDate('appointment_date', $date)->where('status', 'approved')->count(),
                'pending' => Appointment::whereDate('appointment_date', $date)->where('status', 'pending')->count(),
                'rejected' => Appointment::whereDate('appointment_date', $date)->where('status', 'rejected')->count(),
            ];
        });
        $allMedicines = collect([
            ...Vaccine::all()->map(fn ($item) => [
                'id' => $item->id,
                'name' => $item->vaccine_name,
                'stock' => $item->stock,
                'expiry_date' => optional($item->expiry_date)->toDateString(),
            ]),
            ...Ointment::all()->map(fn ($item) => [
                'id' => $item->id,
                'name' => $item->ointment_name,
                'stock' => $item->stock,
                'expiry_date' => optional($item->expiry_date)->toDateString(),
            ]),
            ...Medicine::all()->map(fn ($item) => [
                'id' => $item->id,
                'name' => $item->name,
                'stock' => $item->stock,
                'expiry_date' => null,
            ]),
        ]);

        return $this->success([
            'summary' => [
                'vaccines' => Vaccine::count(),
                'ointments' => Ointment::count(),
                'medicines' => Medicine::count(),
                'users' => User::count(),
                'today_appointments' => Appointment::whereDate('appointment_date', $today)->count(),
                'appointments' => Appointment::count(),
                'pending_appointments' => Appointment::where('status', 'pending')->count(),
                'notifications' => Notification::count(),
                'unread_notifications' => Notification::where('read_status', false)->count(),
                'low_stock' => $allMedicines->filter(fn ($item) => (int) ($item['stock'] ?? 0) < 40)->count(),
                'expired_medicines' => $allMedicines->filter(fn ($item) => filled($item['expiry_date']) && Carbon::parse($item['expiry_date'])->lt($today))->count(),
            ],
            'inventory' => $allMedicines->values(),
            'low_stock' => $allMedicines->filter(fn ($item) => (int) ($item['stock'] ?? 0) < 40)->values(),
            'recent_appointments' => Appointment::latest()->take(5)->get(),
            'weekly_trend' => $last7Days,
            'appointment_breakdown' => [
                'approved' => Appointment::where('status', 'approved')->count(),
                'pending' => Appointment::where('status', 'pending')->count(),
                'rejected' => Appointment::where('status', 'rejected')->count(),
            ],
        ], 'Dashboard analytics');
    }
}

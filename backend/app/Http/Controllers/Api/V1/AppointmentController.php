<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Requests\Appointment\StoreAppointmentRequest;
use App\Http\Requests\Appointment\UpdateAppointmentRequest;
use App\Models\Appointment;
use Illuminate\Http\Request;

class AppointmentController extends BaseController
{
    public function index(Request $request)
    {
        $query = Appointment::with(['user:id,name,email,phone']);

        if ($request->user()->role !== 'admin') {
            $query->where('user_id', $request->user()->getKey());
        }

        return $this->success($query->latest()->get(), 'Appointments retrieved');
    }

    public function store(StoreAppointmentRequest $request)
    {
        $validated = $request->validated();

        // Regular users can only book for themselves; admins may optionally book for a specific user.
        $userId = $request->user()->role === 'admin' && isset($validated['user_id'])
            ? (int) $validated['user_id']
            : $request->user()->getKey();

        unset($validated['user_id']);

        $appointment = Appointment::create([
            ...$validated,
            'user_id' => $userId,
            'status' => 'pending',
        ]);

        return $this->success($appointment->load(['user:id,name,email,phone']), 'Appointment booked', 201);
    }

    public function show(Appointment $appointment)
    {
        return $this->success($appointment->load(['user:id,name,email,phone']), 'Appointment details');
    }

    public function update(UpdateAppointmentRequest $request, Appointment $appointment)
    {
        $originalStatus = $appointment->status;

        $appointment->update($request->validated());

        $appointment->refresh();

        // If status changed to approved or rejected, create a notification for the user
        if ($originalStatus !== $appointment->status && in_array($appointment->status, ['approved', 'rejected'])) {
            \App\Models\Notification::create([
                'user_id' => $appointment->user_id,
                'title' => 'Appointment ' . ucfirst($appointment->status),
                'message' => "Your appointment on {$appointment->appointment_date->toDateString()} has been {$appointment->status}.",
            ]);
        }

        return $this->success($appointment->fresh(), 'Appointment updated');
    }

    public function destroy(Appointment $appointment)
    {
        $appointment->delete();

        return $this->success(null, 'Appointment removed');
    }
}

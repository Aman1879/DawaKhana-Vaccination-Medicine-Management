<?php

namespace App\Http\Requests\Appointment;

use Illuminate\Foundation\Http\FormRequest;

class StoreAppointmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'user_id' => ['sometimes', 'integer', 'exists:users,id'],
            'vaccine_id' => ['nullable', 'integer'],
            'ointment_id' => ['nullable', 'integer'],
            'appointment_date' => ['required', 'date'],
            'time_slot' => ['required', 'string', 'max:60'],
            'notes' => ['nullable', 'string'],
        ];
    }
}

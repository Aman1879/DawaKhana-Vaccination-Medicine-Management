<?php

namespace App\Http\Requests\Inventory;

use Illuminate\Foundation\Http\FormRequest;

class StoreOintmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'ointment_name' => ['required', 'string', 'max:255'],
            'type' => ['required', 'string', 'max:255'],
            'stock' => ['required', 'integer', 'min:0'],
            'expiry_date' => ['required', 'date'],
            'manufacturer' => ['required', 'string', 'max:255'],
        ];
    }
}

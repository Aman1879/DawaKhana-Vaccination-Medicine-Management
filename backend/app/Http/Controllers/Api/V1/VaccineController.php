<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Requests\Inventory\StoreVaccineRequest;
use App\Http\Requests\Inventory\UpdateVaccineRequest;
use App\Models\Vaccine;
use Illuminate\Http\Request;

class VaccineController extends BaseController
{
    public function index(Request $request)
    {
        $query = Vaccine::query();

        if ($term = $request->string('search')->toString()) {
            $query->where('vaccine_name', 'like', "%{$term}%")
                ->orWhere('category', 'like', "%{$term}%")
                ->orWhere('manufacturer', 'like', "%{$term}%");
        }

        return $this->success($query->latest()->get(), 'Vaccines retrieved');
    }

    public function store(StoreVaccineRequest $request)
    {
        $vaccine = Vaccine::create($request->validated());

        return $this->success($vaccine, 'Vaccine created', 201);
    }

    public function show(Vaccine $vaccine)
    {
        return $this->success($vaccine, 'Vaccine details');
    }

    public function update(UpdateVaccineRequest $request, Vaccine $vaccine)
    {
        $vaccine->update($request->validated());

        return $this->success($vaccine->fresh(), 'Vaccine updated');
    }

    public function destroy(Vaccine $vaccine)
    {
        $vaccine->delete();

        return $this->success(null, 'Vaccine deleted');
    }
}

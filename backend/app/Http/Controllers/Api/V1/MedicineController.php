<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Requests\Inventory\StoreMedicineRequest;
use App\Http\Requests\Inventory\UpdateMedicineRequest;
use App\Models\Medicine;
use Illuminate\Http\Request;

class MedicineController extends BaseController
{
    public function index(Request $request)
    {
        $query = Medicine::query();

        if ($term = $request->string('search')->toString()) {
            $query->where('name', 'like', "%{$term}%")
                ->orWhere('type', 'like', "%{$term}%");
        }

        return $this->success($query->latest()->get(), 'Medicines retrieved');
    }

    public function store(StoreMedicineRequest $request)
    {
        $medicine = Medicine::create($request->validated());

        return $this->success($medicine, 'Medicine created', 201);
    }

    public function show(Medicine $medicine)
    {
        return $this->success($medicine, 'Medicine details');
    }

    public function update(UpdateMedicineRequest $request, Medicine $medicine)
    {
        $medicine->update($request->validated());

        return $this->success($medicine->fresh(), 'Medicine updated');
    }

    public function destroy(Medicine $medicine)
    {
        $medicine->delete();

        return $this->success(null, 'Medicine deleted');
    }
}

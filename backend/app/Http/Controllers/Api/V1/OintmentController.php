<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Requests\Inventory\StoreOintmentRequest;
use App\Http\Requests\Inventory\UpdateOintmentRequest;
use App\Models\Ointment;
use Illuminate\Http\Request;

class OintmentController extends BaseController
{
    public function index(Request $request)
    {
        $query = Ointment::query();

        if ($term = $request->string('search')->toString()) {
            $query->where('ointment_name', 'like', "%{$term}%")
                ->orWhere('type', 'like', "%{$term}%")
                ->orWhere('manufacturer', 'like', "%{$term}%");
        }

        return $this->success($query->latest()->get(), 'Ointments retrieved');
    }

    public function store(StoreOintmentRequest $request)
    {
        $ointment = Ointment::create($request->validated());

        return $this->success($ointment, 'Ointment created', 201);
    }

    public function show(Ointment $ointment)
    {
        return $this->success($ointment, 'Ointment details');
    }

    public function update(UpdateOintmentRequest $request, Ointment $ointment)
    {
        $ointment->update($request->validated());

        return $this->success($ointment->fresh(), 'Ointment updated');
    }

    public function destroy(Ointment $ointment)
    {
        $ointment->delete();

        return $this->success(null, 'Ointment deleted');
    }
}

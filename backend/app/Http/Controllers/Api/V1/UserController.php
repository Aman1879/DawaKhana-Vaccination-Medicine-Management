<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends BaseController
{
    public function index()
    {
        return $this->success(User::latest()->get(), 'Users retrieved');
    }

    public function show(User $user)
    {
        return $this->success($user, 'User details');
    }

    public function update(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:30'],
            'age' => ['nullable', 'integer', 'min:0'],
            'medical_history' => ['nullable', 'array'],
            'medical_history.*' => ['string', 'max:500'],
        ]);

        $user->fill($validated)->save();

        return $this->success($user->fresh(), 'Profile updated');
    }

    public function adminUpdate(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'email' => ['sometimes', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:30'],
            'age' => ['nullable', 'integer', 'min:0'],
            'role' => ['sometimes', 'in:admin,user'],
            'is_blocked' => ['sometimes', 'boolean'],
            'medical_history' => ['nullable', 'array'],
            'medical_history.*' => ['string', 'max:500'],
        ]);

        $user->fill($validated)->save();

        return $this->success($user->fresh(), 'User updated');
    }

    public function destroy(User $user)
    {
        $user->delete();

        return $this->success(null, 'User deleted');
    }

    public function changePassword(Request $request)
    {
        $validated = $request->validate([
            'current_password' => ['required', 'current_password'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        $request->user()->update([
            'password' => Hash::make($validated['password']),
        ]);

        return $this->success(null, 'Password updated');
    }

    public function block(Request $request, User $user)
    {
        $validated = $request->validate([
            'is_blocked' => ['required', 'boolean'],
        ]);

        $user->update($validated);

        return $this->success($user->fresh(), $validated['is_blocked'] ? 'User blocked' : 'User unblocked');
    }
}

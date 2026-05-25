<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\Notification;
use App\Models\User;
use Illuminate\Http\Request;

class NotificationController extends BaseController
{
    public function index(Request $request)
    {
        $notifications = Notification::where('user_id', $request->user()->getKey())->latest()->get();

        return $this->success($notifications, 'Notifications retrieved');
    }

    public function markAsRead(Request $request, Notification $notification)
    {
        $notification->update(['read_status' => true]);

        return $this->success($notification->fresh(), 'Notification marked as read');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => ['nullable', 'integer', 'exists:users,id'],
            'title' => ['required', 'string', 'max:255'],
            'message' => ['required', 'string'],
            'broadcast' => ['nullable', 'boolean'],
        ]);

        if ($request->boolean('broadcast')) {
            $created = collect();
            User::query()->pluck('id')->each(function ($userId) use (&$created, $validated) {
                $created->push(Notification::create([
                    'user_id' => $userId,
                    'title' => $validated['title'],
                    'message' => $validated['message'],
                    'read_status' => false,
                ]));
            });

            return $this->success($created, 'Notification broadcast sent', 201);
        }

        $notification = Notification::create([
            'user_id' => $validated['user_id'] ?? $request->user()->getKey(),
            'title' => $validated['title'],
            'message' => $validated['message'],
            'read_status' => false,
        ]);

        return $this->success($notification, 'Notification sent', 201);
    }
}

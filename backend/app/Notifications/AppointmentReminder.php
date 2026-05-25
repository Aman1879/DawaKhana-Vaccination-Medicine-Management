<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class AppointmentReminder extends Notification
{
    use Queueable;

    public function __construct(public array $payload)
    {
    }

    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject($this->payload['title'] ?? 'Appointment reminder')
            ->line($this->payload['message'] ?? 'You have an upcoming appointment.')
            ->action('Open dashboard', config('app.frontend_url', env('FRONTEND_URL', 'http://localhost:5173')));
    }

    public function toArray(object $notifiable): array
    {
        return $this->payload;
    }
}

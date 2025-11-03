<?php

namespace App\Mail;

use App\Models\Feedback;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class FeedbackReceived extends Mailable
{
    use Queueable, SerializesModels;

    public $feedback;

    public function __construct(Feedback $feedback)
    {
        $this->feedback = $feedback;
    }

    public function build()
    {
        return $this->subject('🎯 New Anonymous Feedback - ' . ucfirst($this->feedback->subject) . ' (' . $this->feedback->rating . '/5)')
                    ->html($this->renderHtml())
                    ->with(['feedback' => $this->feedback]);
    }

    protected function renderHtml()
    {
        return view('emails.feedback.received', ['feedback' => $this->feedback])->render();
    }
}
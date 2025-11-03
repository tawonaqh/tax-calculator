<?php

namespace App\Http\Controllers;

use App\Models\Feedback;
use App\Mail\FeedbackReceived;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class FeedbackController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'subject' => 'required|string|max:255',
            'message' => 'required|string|min:10|max:2000',
            'rating' => 'required|integer|between:1,5'
        ]);

        try {
            // Save to database (completely anonymous)
            $feedback = Feedback::create($validated);

            // Send email notification
            Mail::to(env('MAIL_FROM_ADDRESS', 'tnrwatida@gmail.com'))->send(new FeedbackReceived($feedback));

            Log::info('Feedback submitted successfully', ['feedback_id' => $feedback->id]);

            return response()->json([
                'message' => 'Thank you for your feedback! It has been submitted anonymously.',
                'success' => true
            ], 201);

        } catch (\Exception $e) {
            Log::error('Feedback submission failed: ' . $e->getMessage(), [
                'subject' => $validated['subject'],
                'rating' => $validated['rating']
            ]);
            
            return response()->json([
                'message' => 'Sorry, we encountered an error while submitting your feedback. Please try again.',
                'success' => false
            ], 500);
        }
    }
}
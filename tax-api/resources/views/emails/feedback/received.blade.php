<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>New Feedback - Taxcul</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: #1f2937;
            margin: 0;
            padding: 20px;
            color: #f9fafb;
        }
        
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background: linear-gradient(135deg, #111827 0%, #1f2937 100%);
            border-radius: 16px;
            overflow: hidden;
            border: 1px solid #374151;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.4);
        }
        
        .header {
            background: linear-gradient(135deg, #111827 0%, #1a202c 100%);
            padding: 30px;
            text-align: center;
            border-bottom: 1px solid #374151;
        }
        
        .logo {
            height: 40px;
            margin-bottom: 15px;
        }
        
        .badge {
            background: #fbbf24;
            color: #1f2937;
            font-size: 11px;
            font-weight: 700;
            padding: 4px 12px;
            border-radius: 12px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
        
        .content {
            padding: 40px;
        }
        
        .title {
            color: #f9fafb;
            font-size: 24px;
            font-weight: 700;
            margin-bottom: 8px;
            text-align: center;
        }
        
        .subtitle {
            color: #d1d5db;
            font-size: 16px;
            text-align: center;
            margin-bottom: 32px;
            font-weight: 400;
        }
        
        .card {
            background: #111827;
            border: 1px solid #374151;
            border-radius: 12px;
            padding: 24px;
            margin-bottom: 24px;
        }
        
        .card-title {
            color: #fbbf24;
            font-size: 14px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: 16px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 20px;
        }
        
        .info-item {
            display: flex;
            flex-direction: column;
            gap: 4px;
        }
        
        .info-label {
            color: #9ca3af;
            font-size: 12px;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-right: 2px;
        }
        
        .info-value {
            color: #f9fafb;
            font-size: 12px;
            font-weight: 600;
        }
        
        .rating-stars {
            color: #fbbf24;
            font-size: 12px;
            letter-spacing: 2px;
        }
        
        .message-box {
            background: #1f2937;
            border: 1px solid #4b5563;
            border-radius: 8px;
            padding: 20px;
            margin-top: 16px;
        }
        
        .message-text {
            color: #e5e7eb;
            font-size: 14px;
            line-height: 1.6;
            margin: 0;
            white-space: pre-wrap;
        }
        
        .footer {
            background: #111827;
            padding: 24px 40px;
            text-align: center;
            border-top: 1px solid #374151;
        }
        
        .footer-text {
            color: #9ca3af;
            font-size: 12px;
            margin: 0;
        }
        
        .timestamp {
            color: #6b7280;
            font-size: 12px;
            text-align: center;
            margin-top: 8px;
        }
        
        .divider {
            height: 1px;
            background: linear-gradient(90deg, transparent 0%, #374151 50%, transparent 100%);
            margin: 24px 0;
        }
        
        @media (max-width: 600px) {
            .content {
                padding: 24px;
            }
            
            .info-grid {
                grid-template-columns: 1fr;
                gap: 16px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header -->
        <div class="header">
            <!-- Logo placeholder - replace with your actual logo URL -->
            <div style="text-align: center; margin-bottom: 16px;">
                <span style="color: #f9fafb; font-size: 24px; font-weight: 700;">Taxcul</span>
                <span class="badge" style="margin-left: 8px;">Beta</span>
            </div>
            <h1 class="title">New Anonymous Feedback</h1>
            <p class="subtitle">A user has shared their experience with the platform</p>
        </div>
        
        <!-- Content -->
        <div class="content">
            <!-- Feedback Overview -->
            <div class="card">
                <div class="card-title">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                    </svg>
                    Feedback Overview
                </div>
                
                <div class="info-grid">
                    <div class="info-item">
                        <span class="info-label">Category:</span>
                        <span class="info-value" style="color: #a3e635;"> {{ ucfirst($feedback->subject) }}</span>
                    </div>
                    
                    <div class="info-item">
                        <span class="info-label">User Rating:</span>
                        <div>
                            <span class="rating-stars"> {{ str_repeat('⭐', $feedback->rating) }}</span>
                            <span class="info-value"> ({{ $feedback->rating }}/5)</span>
                        </div>
                    </div>
                </div>
                
                <div class="info-item">
                    <span class="info-label">Submitted:</span>
                    <span class="info-value"> {{ $feedback->created_at->format('F j, Y \\a\\t g:i A') }}</span>
                </div>
            </div>
            
            <!-- Feedback Message -->
            <div class="card">
                <div class="card-title">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14,2 14,8 20,8"/>
                        <line x1="16" y1="13" x2="8" y2="13"/>
                        <line x1="16" y1="17" x2="8" y2="17"/>
                        <polyline points="10,9 9,9 8,9"/>
                    </svg>
                    Feedback Message
                </div>
                
                <div class="message-box">
                    <p class="message-text">{{ $feedback->message }}</p>
                </div>
            </div>
            
            <div class="divider"></div>
            
            <!-- Action Note -->
            <div style="text-align: center; color: #9ca3af; font-size: 13px; line-height: 1.5;">
                This feedback was submitted anonymously through the Taxcul feedback system.<br>
                No personal information was collected from the user.
            </div>
        </div>
        
        <!-- Footer -->
        <div class="footer">
            <p class="footer-text">
                © {{ date('Y') }} Taxcul. All rights reserved.<br>
                This is an automated notification. Please do not reply to this email.
            </p>
            <div class="timestamp">
                Feedback ID: #{{ $feedback->id }} • Received: {{ $feedback->created_at->format('M j, Y g:i A') }}
            </div>
        </div>
    </div>
</body>
</html>
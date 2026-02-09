<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Reset Your Password - Taxcul</title>
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
            color: #1ED760;
            font-size: 14px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: 16px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .info-text {
            color: #e5e7eb;
            font-size: 14px;
            line-height: 1.6;
            margin-bottom: 24px;
        }
        
        .button-container {
            text-align: center;
            margin: 32px 0;
        }
        
        .reset-button {
            display: inline-block;
            background: linear-gradient(135deg, #1ED760 0%, #17b34f 100%);
            color: #ffffff;
            text-decoration: none;
            padding: 14px 32px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            box-shadow: 0 4px 6px -1px rgba(30, 215, 96, 0.3);
            transition: all 0.3s ease;
        }
        
        .reset-button:hover {
            box-shadow: 0 10px 15px -3px rgba(30, 215, 96, 0.4);
        }
        
        .expiry-notice {
            background: #1f2937;
            border: 1px solid #4b5563;
            border-radius: 8px;
            padding: 16px;
            margin-top: 24px;
            text-align: center;
        }
        
        .expiry-text {
            color: #fbbf24;
            font-size: 13px;
            font-weight: 500;
            margin: 0;
        }
        
        .security-notice {
            background: #1f2937;
            border-left: 3px solid #ef4444;
            border-radius: 8px;
            padding: 16px;
            margin-top: 24px;
        }
        
        .security-title {
            color: #ef4444;
            font-size: 13px;
            font-weight: 600;
            margin-bottom: 8px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
        
        .security-text {
            color: #d1d5db;
            font-size: 13px;
            line-height: 1.5;
            margin: 0;
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
        
        .divider {
            height: 1px;
            background: linear-gradient(90deg, transparent 0%, #374151 50%, transparent 100%);
            margin: 24px 0;
        }
        
        .link-fallback {
            background: #1f2937;
            border: 1px solid #4b5563;
            border-radius: 8px;
            padding: 12px;
            margin-top: 16px;
            word-break: break-all;
        }
        
        .link-text {
            color: #60a5fa;
            font-size: 12px;
            font-family: monospace;
        }
        
        @media (max-width: 600px) {
            .content {
                padding: 24px;
            }
            
            .reset-button {
                padding: 12px 24px;
                font-size: 14px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header -->
        <div class="header">
            <div style="text-align: center; margin-bottom: 16px;">
                <span style="color: #f9fafb; font-size: 24px; font-weight: 700;">Taxcul</span>
                <span class="badge" style="margin-left: 8px;">Beta</span>
            </div>
            <h1 class="title">Reset Your Password</h1>
            <p class="subtitle">We received a request to reset your password</p>
        </div>
        
        <!-- Content -->
        <div class="content">
            <!-- Main Message -->
            <div class="card">
                <div class="card-title">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                    Password Reset Request
                </div>
                
                <p class="info-text">
                    Hello,<br><br>
                    You're receiving this email because we received a password reset request for your account. 
                    Click the button below to reset your password:
                </p>
                
                <div class="button-container">
                    <a href="{{ $url }}" class="reset-button">
                        Reset Password
                    </a>
                </div>
                
                <div class="expiry-notice">
                    <p class="expiry-text">
                        ⏱️ This password reset link will expire in {{ config('auth.passwords.'.config('auth.defaults.passwords').'.expire') }} minutes
                    </p>
                </div>
                
                <div class="link-fallback">
                    <p style="color: #9ca3af; font-size: 12px; margin-bottom: 8px;">
                        If the button doesn't work, copy and paste this link into your browser:
                    </p>
                    <p class="link-text">{{ $url }}</p>
                </div>
            </div>
            
            <!-- Security Notice -->
            <div class="security-notice">
                <div class="security-title">
                    🔒 Security Notice
                </div>
                <p class="security-text">
                    If you didn't request a password reset, please ignore this email or contact support if you have concerns. 
                    Your password won't change until you access the link above and create a new one.
                </p>
            </div>
            
            <div class="divider"></div>
            
            <!-- Help Text -->
            <div style="text-align: center; color: #9ca3af; font-size: 13px; line-height: 1.5;">
                Need help? Contact us at <a href="mailto:support@taxcul.com" style="color: #1ED760; text-decoration: none;">support@taxcul.com</a>
            </div>
        </div>
        
        <!-- Footer -->
        <div class="footer">
            <p class="footer-text">
                © {{ date('Y') }} Taxcul. All rights reserved.<br>
                This is an automated notification. Please do not reply to this email.
            </p>
        </div>
    </div>
</body>
</html>

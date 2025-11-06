<?php

return [
    'paths' => ['api/*'],
    'allowed_methods' => ['*'],
    'allowed_origins' => ['http://localhost:3000', 'https://taxcul.com' , 'https://taxcul.vercel.app'], // your Next.js frontend
    'allowed_headers' => ['*'],
    'supports_credentials' => false,
    'max_age' => 3600,
];

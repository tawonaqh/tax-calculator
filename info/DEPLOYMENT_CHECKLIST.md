# Deployment Checklist

## Pre-Deployment

### Backend (Laravel)

#### Environment Configuration
- [ ] Copy `.env.example` to `.env`
- [ ] Set `APP_ENV=production`
- [ ] Set `APP_DEBUG=false`
- [ ] Generate new `APP_KEY`: `php artisan key:generate`
- [ ] Configure database credentials
- [ ] Set `APP_URL` to production URL
- [ ] Configure mail settings (for password reset)
- [ ] Set `FRONTEND_URL` to production frontend URL

#### Database
- [ ] Run migrations: `php artisan migrate --force`
- [ ] Run seeders (if needed): `php artisan db:seed --force`
- [ ] Backup database before deployment

#### Security
- [ ] Update CORS allowed origins in `config/cors.php`
- [ ] Set strong `SESSION_SECURE_COOKIE=true` (if HTTPS)
- [ ] Review and update `SANCTUM_STATEFUL_DOMAINS`
- [ ] Set secure session driver (database or redis)
- [ ] Enable HTTPS redirect

#### Optimization
- [ ] Run `composer install --optimize-autoloader --no-dev`
- [ ] Run `php artisan config:cache`
- [ ] Run `php artisan route:cache`
- [ ] Run `php artisan view:cache`
- [ ] Set up queue workers (if using queues)
- [ ] Set up task scheduler (if using cron)

#### Storage
- [ ] Create storage link: `php artisan storage:link`
- [ ] Set proper permissions on storage and bootstrap/cache
- [ ] Configure file upload limits
- [ ] Set up backup strategy

### Frontend (Next.js)

#### Environment Configuration
- [ ] Copy `.env.local` to `.env.production`
- [ ] Set `NEXT_PUBLIC_BACKEND_URL` to production API URL
- [ ] Remove any development-only variables
- [ ] Verify all environment variables are set

#### Build
- [ ] Run `npm install --production`
- [ ] Run `npm run build`
- [ ] Test production build locally: `npm start`
- [ ] Check for build errors or warnings

#### Optimization
- [ ] Enable image optimization
- [ ] Configure CDN (if using)
- [ ] Set up caching headers
- [ ] Minify assets
- [ ] Enable compression

## Deployment Steps

### Backend Deployment

#### Option 1: Shared Hosting (cPanel)
1. [ ] Upload files via FTP/SFTP
2. [ ] Point domain to `public` folder
3. [ ] Import database
4. [ ] Update `.env` with production settings
5. [ ] Run migrations via SSH or cPanel terminal
6. [ ] Set folder permissions (755 for folders, 644 for files)
7. [ ] Set storage and cache to 775

#### Option 2: VPS (Ubuntu/Nginx)
1. [ ] Clone repository: `git clone [repo-url]`
2. [ ] Install dependencies: `composer install --no-dev`
3. [ ] Configure `.env`
4. [ ] Run migrations: `php artisan migrate --force`
5. [ ] Set up Nginx virtual host
6. [ ] Configure PHP-FPM
7. [ ] Set up SSL certificate (Let's Encrypt)
8. [ ] Configure firewall
9. [ ] Set up supervisor for queue workers

#### Option 3: Docker
1. [ ] Build Docker image
2. [ ] Push to registry
3. [ ] Deploy container
4. [ ] Run migrations in container
5. [ ] Configure reverse proxy

### Frontend Deployment

#### Option 1: Vercel (Recommended for Next.js)
1. [ ] Connect GitHub repository
2. [ ] Configure environment variables
3. [ ] Deploy
4. [ ] Verify deployment
5. [ ] Set up custom domain

#### Option 2: Netlify
1. [ ] Connect repository
2. [ ] Set build command: `npm run build`
3. [ ] Set publish directory: `.next`
4. [ ] Configure environment variables
5. [ ] Deploy

#### Option 3: VPS (Node.js)
1. [ ] Clone repository
2. [ ] Install dependencies: `npm install --production`
3. [ ] Build: `npm run build`
4. [ ] Set up PM2: `pm2 start npm --name "tax-frontend" -- start`
5. [ ] Configure Nginx reverse proxy
6. [ ] Set up SSL certificate

#### Option 4: Static Export
1. [ ] Update `next.config.mjs` for static export
2. [ ] Build: `npm run build`
3. [ ] Export: `npm run export`
4. [ ] Upload `out` folder to hosting
5. [ ] Configure web server

## Post-Deployment

### Verification
- [ ] Test user registration
- [ ] Test login/logout
- [ ] Test password reset email
- [ ] Test company creation
- [ ] Test employee management
- [ ] Test payroll calculation
- [ ] Test calculation save
- [ ] Test history viewing
- [ ] Test all filters
- [ ] Test on mobile devices
- [ ] Test on different browsers

### Monitoring
- [ ] Set up error logging (Sentry, Bugsnag)
- [ ] Set up uptime monitoring
- [ ] Set up performance monitoring
- [ ] Configure backup schedule
- [ ] Set up SSL certificate renewal
- [ ] Monitor disk space
- [ ] Monitor database size

### Security
- [ ] Run security audit: `npm audit`
- [ ] Update dependencies
- [ ] Enable rate limiting
- [ ] Set up fail2ban (if VPS)
- [ ] Configure firewall rules
- [ ] Enable HTTPS only
- [ ] Set security headers

### Documentation
- [ ] Document deployment process
- [ ] Document environment variables
- [ ] Document backup/restore procedure
- [ ] Document rollback procedure
- [ ] Create admin guide
- [ ] Create user guide

## Environment Variables Reference

### Backend (.env)
```env
APP_NAME="Zimbabwe Tax Calculator"
APP_ENV=production
APP_KEY=base64:...
APP_DEBUG=false
APP_URL=https://api.yourdomain.com

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your_database
DB_USERNAME=your_username
DB_PASSWORD=your_password

FRONTEND_URL=https://yourdomain.com

MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS="noreply@yourdomain.com"
MAIL_FROM_NAME="${APP_NAME}"

SESSION_DRIVER=database
SESSION_LIFETIME=120
SESSION_SECURE_COOKIE=true

SANCTUM_STATEFUL_DOMAINS=yourdomain.com
```

### Frontend (.env.production)
```env
NEXT_PUBLIC_BACKEND_URL=https://api.yourdomain.com
```

## Nginx Configuration Example

### Backend (Laravel)
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;
    root /var/www/tax-api/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.php;

    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

### Frontend (Next.js)
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
sudo certbot --nginx -d api.yourdomain.com

# Auto-renewal (already set up by certbot)
sudo certbot renew --dry-run
```

## Backup Strategy

### Database Backup
```bash
# Daily backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mysqldump -u username -p password database_name > backup_$DATE.sql
# Upload to S3 or remote storage
```

### File Backup
```bash
# Backup uploaded files
tar -czf storage_backup_$DATE.tar.gz storage/app/public
```

## Rollback Procedure

### Backend
1. [ ] Restore previous code version
2. [ ] Restore database backup (if needed)
3. [ ] Clear caches
4. [ ] Restart services

### Frontend
1. [ ] Revert to previous deployment (Vercel/Netlify)
2. [ ] Or restore previous build
3. [ ] Clear CDN cache

## Performance Optimization

### Backend
- [ ] Enable OPcache
- [ ] Use Redis for cache/sessions
- [ ] Enable query caching
- [ ] Optimize database indexes
- [ ] Use CDN for assets

### Frontend
- [ ] Enable Next.js image optimization
- [ ] Use CDN for static assets
- [ ] Enable compression
- [ ] Implement lazy loading
- [ ] Optimize bundle size

## Maintenance Mode

### Enable Maintenance
```bash
php artisan down --message="Scheduled maintenance" --retry=60
```

### Disable Maintenance
```bash
php artisan up
```

## Support & Monitoring

### Log Files
- Backend: `storage/logs/laravel.log`
- Frontend: Check hosting provider logs
- Nginx: `/var/log/nginx/error.log`

### Health Checks
- [ ] Set up `/health` endpoint
- [ ] Monitor response times
- [ ] Monitor error rates
- [ ] Set up alerts

## Final Checklist

- [ ] All tests passing
- [ ] Documentation complete
- [ ] Backups configured
- [ ] Monitoring set up
- [ ] SSL certificates installed
- [ ] Domain DNS configured
- [ ] Email sending works
- [ ] All features tested in production
- [ ] Performance acceptable
- [ ] Security measures in place

---

## 🚀 Ready for Production!

Once all items are checked, your payroll management system is ready for production use.

**Remember**: Always test in a staging environment before deploying to production!

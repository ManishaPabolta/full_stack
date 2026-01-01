# Deployment & Scaling Guide

## Deployment Architecture

### Development Environment
```
Frontend (localhost:5173) ←→ Backend (localhost:5000) ←→ MongoDB (localhost:27017)
```

### Production Environment
```
CDN + Frontend (Vercel/Netlify) ←→ Load Balancer ←→ Backend Servers (AWS/Heroku) ←→ MongoDB Atlas
```

## Frontend Deployment

### Option 1: Vercel (Recommended for Next.js/React)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from frontend directory
cd frontend
vercel
```

**Advantages:**
- Automatic deployments from Git
- Built-in CDN and caching
- Environment variable management
- Preview deployments for PR

### Option 2: Netlify
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
cd frontend
netlify deploy --prod
```

**Configuration (netlify.toml):**
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Option 3: AWS S3 + CloudFront
```bash
# Build the frontend
npm run build

# Upload to S3
aws s3 sync dist/ s3://your-bucket-name/

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

### Frontend Environment Variables
Create `.env.production` for production:
```
VITE_API_URL=https://api.yourdomain.com/api
```

## Backend Deployment

### Option 1: Heroku
```bash
# Install Heroku CLI and login
heroku login

# Create app
heroku create your-app-name

# Set environment variables
heroku config:set PORT=5000
heroku config:set MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
heroku config:set JWT_SECRET=your_production_secret
heroku config:set NODE_ENV=production

# Deploy
git push heroku main
```

**Procfile for Heroku:**
```
web: node server.js
```

### Option 2: AWS EC2
```bash
# Launch EC2 instance (Ubuntu)
# SSH into instance
ssh -i your-key.pem ec2-user@your-ip

# Install Node.js
curl -sL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone repository
git clone https://github.com/yourusername/fullstack-app.git
cd fullstack-app/backend

# Install dependencies
npm install

# Create .env file
nano .env

# Install PM2 for process management
sudo npm install -g pm2

# Start application
pm2 start server.js --name "taskapp"
pm2 startup
pm2 save
```

### Option 3: Railway.app
```bash
# Login to Railway
railway login

# Deploy from backend directory
cd backend
railway up
```

**Environment Setup in Railway Dashboard:**
- Set all required environment variables
- Configure custom domains
- Enable automatic deployments

## Database Deployment

### MongoDB Atlas (Recommended)
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Create database user
4. Get connection string
5. Use in `MONGODB_URI`:
```
mongodb+srv://username:password@cluster.mongodb.net/dbname
```

### Self-Hosted MongoDB on AWS
```bash
# On EC2 instance
sudo apt-get install -y mongodb

# Configure MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Create backup
mongodump --out /backup
```

## CI/CD Pipeline

### GitHub Actions Workflow
Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: cd backend && npm install
      
      - name: Run tests
        run: cd backend && npm test
      
      - name: Deploy to Heroku
        run: |
          git push https://heroku:${{ secrets.HEROKU_API_KEY }}@git.heroku.com/${{ secrets.HEROKU_APP_NAME }}.git main

  frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: cd frontend && npm install
      
      - name: Build
        run: cd frontend && npm run build
      
      - name: Deploy to Vercel
        run: npx vercel --prod --token ${{ secrets.VERCEL_TOKEN }}
```

## Performance Optimization

### Frontend
- **Code Splitting**: Lazy load routes and components
- **Image Optimization**: Use responsive images, WebP format
- **Caching**: Leverage browser caching with proper headers
- **Minification**: Build tools handle JS/CSS minification
- **CDN**: Serve static assets from CDN

### Backend
- **Database Indexing**:
```javascript
// In User model
userSchema.index({ email: 1 });

// In Task model
taskSchema.index({ userId: 1, createdAt: -1 });
```

- **API Caching**: Redis for frequently accessed data
- **Compression**: Enable gzip compression
```javascript
import compression from 'compression';
app.use(compression());
```

- **Pagination**: Limit results per request
```javascript
const limit = 20;
const skip = (page - 1) * limit;
const tasks = await Task.find(filter).limit(limit).skip(skip);
```

- **Rate Limiting**:
```javascript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});

app.use('/api', limiter);
```

## Monitoring & Logging

### Error Tracking (Sentry)
```javascript
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});

app.use(Sentry.Handlers.errorHandler());
```

### Logging (Winston)
```javascript
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

### Application Monitoring
- **PM2 Plus**: Monitor processes and memory
- **DataDog**: Infrastructure monitoring
- **New Relic**: Application performance monitoring

## Security Checklist

- [ ] Use HTTPS for all connections
- [ ] Set secure CORS headers
- [ ] Enable rate limiting on API endpoints
- [ ] Use environment variables for secrets
- [ ] Enable MongoDB authentication
- [ ] Set secure cookie flags (HttpOnly, Secure, SameSite)
- [ ] Implement CSRF protection if using sessions
- [ ] Regular security audits with npm audit
- [ ] Update dependencies regularly
- [ ] Use SSL certificates (Let's Encrypt)

## Backup & Recovery

### MongoDB Backups
```bash
# Manual backup
mongodump --uri "mongodb+srv://user:pass@cluster.mongodb.net/dbname" --out /backups

# Restore from backup
mongorestore /backups

# With Atlas: Enable automatic backups in dashboard
```

### Application Backups
- Enable Git version control
- Store backups in AWS S3
- Implement automated daily backups
- Test recovery procedures regularly

## Rollback Strategy

```bash
# If deployment fails, revert to previous version
git revert HEAD
git push

# With Heroku
heroku releases
heroku rollback v10

# With Docker
docker pull registry/app:previous-tag
docker run -d registry/app:previous-tag
```

## Conclusion

This application is designed to scale from a single server to a multi-instance distributed system. Start with simple deployment options (Vercel + Railway) and scale horizontally as needed.

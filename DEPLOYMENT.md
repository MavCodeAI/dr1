# Deployment Guide

## Prerequisites

Before deploying, ensure you have:

1. **Accounts Setup:**
   - Supabase account with a project created
   - Vercel account
   - SendGrid account (free tier)
   - Facebook Developer account (optional)
   - LinkedIn Developer account (optional)

2. **Local Development Working:**
   - Application runs locally without errors
   - Database migrations applied
   - Environment variables configured

## Step 1: Supabase Configuration

### 1.1 Create Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be fully initialized
3. Note down your project URL and anon key from Settings > API

### 1.2 Apply Database Migrations
1. Go to SQL Editor in Supabase dashboard
2. Execute the migration files in order:
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/002_rls_policies.sql`
   - `supabase/migrations/003_sample_data.sql`

### 1.3 Enable Real-time
1. Go to Database > Replication
2. Enable real-time for these tables:
   - products
   - orders
   - payments
   - inventory_logs

### 1.4 Configure Auth Settings
1. Go to Authentication > Settings
2. Configure Site URL: `https://your-app-domain.vercel.app`
3. Add Redirect URLs:
   - `https://your-app-domain.vercel.app/auth/callback`
   - `http://localhost:3000/auth/callback` (for development)

## Step 2: SendGrid Setup (Email Notifications)

### 2.1 Create SendGrid Account
1. Sign up at [sendgrid.com](https://sendgrid.com)
2. Verify your sender identity (single sender or domain)

### 2.2 Generate API Key
1. Go to Settings > API Keys
2. Create a new API key with "Mail Send" permissions
3. Copy the API key for environment variables

## Step 3: Social Media APIs (Optional)

### 3.1 Facebook App Setup
1. Go to [developers.facebook.com](https://developers.facebook.com)
2. Create a new app
3. Add "Facebook Login" product
4. Note App ID and App Secret

### 3.2 LinkedIn App Setup  
1. Go to [developer.linkedin.com](https://developer.linkedin.com)
2. Create a new app
3. Request access to necessary APIs
4. Note Client ID and Client Secret

## Step 4: Vercel Deployment

### 4.1 Connect Repository
1. Push your code to GitHub/GitLab/Bitbucket
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Configure project settings:
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`

### 4.2 Environment Variables
Add these environment variables in Vercel dashboard:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# SendGrid
SENDGRID_API_KEY=your-sendgrid-api-key
SENDGRID_FROM_EMAIL=your-verified-email@domain.com

# Social Media (Optional)
FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret
LINKEDIN_CLIENT_ID=your-linkedin-client-id
LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret

# App Config
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
NEXT_PUBLIC_COMPANY_NAME="Your Business Name"
```

### 4.3 Deploy
1. Click "Deploy" in Vercel
2. Wait for build to complete
3. Test the deployed application

## Step 5: Post-Deployment Configuration

### 5.1 Update Supabase Auth URLs
1. Update Site URL in Supabase to your Vercel domain
2. Add production redirect URLs

### 5.2 Create Initial Admin User
1. Sign up through your application
2. Go to Supabase > Authentication > Users
3. Find your user and update the role to 'owner' in the `users` table

### 5.3 Test Core Functionality
- [ ] Authentication (sign up, sign in, sign out)
- [ ] Dashboard loads with sample data
- [ ] Products CRUD operations
- [ ] Orders creation and management
- [ ] Payments tracking
- [ ] Real-time updates
- [ ] Mobile responsiveness

## Step 6: Production Optimizations

### 6.1 Performance
1. Enable Vercel Analytics
2. Configure caching headers
3. Optimize images and assets

### 6.2 Security
1. Review RLS policies
2. Enable Supabase database backups
3. Set up monitoring and alerts

### 6.3 SEO & PWA
1. Configure meta tags
2. Add sitemap.xml
3. Test PWA installation

## Step 7: Custom Domain (Optional)

### 7.1 Domain Setup
1. Purchase domain from registrar
2. In Vercel, go to Project > Domains
3. Add your custom domain
4. Update DNS records as instructed

### 7.2 Update Configurations
1. Update Supabase auth URLs
2. Update social media app URLs
3. Update environment variables

## Troubleshooting Common Issues

### Build Failures
```bash
# Check build logs in Vercel
# Common fixes:
- Ensure all dependencies are in package.json
- Check TypeScript errors
- Verify environment variables
```

### Database Connection Issues
```bash
# Check Supabase connection
- Verify URL and keys are correct
- Check RLS policies allow access
- Ensure migrations are applied
```

### Authentication Problems
```bash
# Check auth configuration
- Verify redirect URLs in Supabase
- Check Site URL configuration
- Clear browser cache and cookies
```

### Real-time Not Working
```bash
# Check real-time setup
- Enable real-time on Supabase tables
- Verify subscription code
- Check browser WebSocket support
```

## Monitoring & Maintenance

### Regular Tasks
1. **Database Maintenance:**
   - Monitor database usage
   - Review slow queries
   - Update statistics

2. **Security Updates:**
   - Keep dependencies updated
   - Review access logs
   - Monitor for suspicious activity

3. **Performance Monitoring:**
   - Check Core Web Vitals
   - Monitor API response times
   - Review error logs

### Scaling Considerations

1. **Database Scaling:**
   - Upgrade Supabase plan as needed
   - Add read replicas for high traffic
   - Implement connection pooling

2. **Application Scaling:**
   - Vercel handles automatic scaling
   - Consider CDN for static assets
   - Implement caching strategies

3. **Feature Scaling:**
   - Add background job processing
   - Implement rate limiting
   - Add comprehensive logging

## Cost Optimization

### Free Tier Limits
- **Vercel:** 100GB bandwidth/month
- **Supabase:** 500MB database, 2GB bandwidth
- **SendGrid:** 100 emails/day

### Upgrade Path
- Start with free tiers
- Monitor usage closely
- Upgrade individual services as needed
- Consider bundled plans for cost savings

---

**Your multi-product business app is now ready for production! 🎉**

For support or questions, refer to the main documentation or create an issue in the repository.
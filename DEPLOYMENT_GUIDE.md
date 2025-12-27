# Deployment Guide - Fixing Google Ads Suspension

## Critical Issues Fixed

Your site was suspended due to:
1. ❌ **Hardcoded API credentials** (security vulnerability)
2. ❌ **Misleading metadata** (UUID title, generic descriptions)
3. ❌ **Missing security headers**

All these issues have been fixed in this update.

## Required Actions Before Redeployment

### 1. Configure Environment Variables in Netlify

**CRITICAL**: You must add these environment variables in Netlify:

1. Log in to [Netlify Dashboard](https://app.netlify.com)
2. Select your site
3. Go to **Site Settings** → **Environment Variables**
4. Click **Add a variable** and add:

```
PESAFLUX_API_KEY = PSFXyLBOrRV9
PESAFLUX_EMAIL = frankyfreaky103@gmail.com
SUPABASE_URL = https://dbpbvoqfexofyxcexmmp.supabase.co
SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRicGJ2b3FmZXhvZnl4Y2V4bW1wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzNDc0NTMsImV4cCI6MjA3NDkyMzQ1M30.hGn7ux2xnRxseYCjiZfCLchgOEwIlIAUkdS6h7byZqc
```

5. Save all variables

### 2. Redeploy Your Site

After adding environment variables:

```bash
git add .
git commit -m "Security fixes: Remove hardcoded credentials, update metadata, add security headers"
git push origin main
```

Netlify will automatically redeploy.

### 3. Verify Deployment

After deployment, check:
- ✅ Site loads correctly
- ✅ Payment functionality works
- ✅ No console errors
- ✅ Security headers are present (use https://securityheaders.com)

### 4. Request Google Ads Review

Once deployed and verified:

1. Log in to [Google Ads](https://ads.google.com)
2. Go to **Policy Manager**
3. Click **Request Review** for your suspended ads
4. Explain the fixes:
   - "Removed all hardcoded API credentials"
   - "Updated site metadata with proper business information"
   - "Added security headers and policies"
   - "Implemented environment variable security"

### 5. Additional Recommendations

**Create Legal Pages** (Required for Google Ads):
- Privacy Policy
- Terms of Service
- Cookie Policy
- Contact Information

**Add to your site:**
- Business registration details
- Physical address
- Customer support contact
- Clear loan terms and conditions

## Testing Checklist

Before requesting Google Ads review:

- [ ] Environment variables configured in Netlify
- [ ] Site redeployed successfully
- [ ] No API credentials in source code
- [ ] Site title shows "Zenka Loans" not UUID
- [ ] Meta descriptions are business-appropriate
- [ ] Security headers present (check browser dev tools)
- [ ] Payment flow works end-to-end
- [ ] Privacy policy page exists
- [ ] Terms of service page exists
- [ ] Contact information visible

## Common Issues

**Q: Site doesn't work after deployment**
A: Check Netlify function logs - likely missing environment variables

**Q: Payments fail**
A: Verify PESAFLUX_API_KEY and PESAFLUX_EMAIL are correct in Netlify

**Q: Still getting security warnings**
A: Clear browser cache and check that latest deployment is live

## Support

If you encounter issues:
1. Check Netlify function logs
2. Verify all environment variables are set
3. Test payment flow in incognito mode
4. Review browser console for errors

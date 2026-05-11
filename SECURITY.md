# Security Policy

## Reporting Security Vulnerabilities

If you discover a security vulnerability, please email us immediately at security@zenka.co.ke

**DO NOT** create a public GitHub issue for security vulnerabilities.

## Secure Deployment Checklist

### Environment Variables Setup

Before deploying to production, you MUST configure the following environment variables in your Netlify dashboard:

1. Go to Netlify Dashboard → Site Settings → Environment Variables
2. Add the following variables:

```
PESAFLUX_API_KEY=your_actual_api_key
PESAFLUX_EMAIL=your_actual_email
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Security Best Practices

- ✅ Never commit API keys or secrets to version control
- ✅ Use environment variables for all sensitive data
- ✅ Rotate API keys regularly
- ✅ Enable HTTPS only (enforced by Netlify)
- ✅ Monitor API usage for suspicious activity
- ✅ Keep dependencies updated
- ✅ Review security headers configuration

## Compliance

This application handles financial transactions and personal data. Ensure compliance with:

- Kenya Data Protection Act (KDPA)
- PCI DSS for payment processing
- Mobile money provider terms of service

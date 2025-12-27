# SwiftPay Integration Guide - 10 Minutes to First Payment 🚀

This guide shows you **exactly** how to integrate SwiftPay M-Pesa payments into your app, based on real working integrations.

## Prerequisites

- A SwiftPay account at [swiftpayfinancial.com](https://swiftpayfinancial.com)
- Node.js 18+ (or any backend that can make HTTP requests)
- Your app deployed somewhere (Vercel, Netlify, etc.) OR Vercel CLI for local testing

---

## Step 1: Create a Till (2 minutes)

1. Go to **Dashboard → Accounts**
2. Click **"Add New Till"**
3. Enter:
   - **Till Name**: e.g., "My App Payments"
   - **Till Number**: Your M-Pesa business number (or any identifier)
4. Click **Create Till**
5. **Copy the Till ID** (shown below the till) - you'll need this!

```
Example Till ID: dbdedaea-11d8-4bbe-b94f-84bbe4206d3c
```

---

## Step 2: Generate an API Key (1 minute)

1. Go to **Dashboard → API Keys**
2. Click **"Generate New Key"**
3. Enter:
   - **Key Name**: e.g., "Production API"
   - **Select Till**: Choose the till you just created
4. Click **Generate Key**
5. **Copy the API Key** immediately - it's shown only once!

```
Example API Key: swp_abc123def456ghi789
```

---

## Step 3: Set Up Environment Variables

Create `.env` in your project:

```env
# SwiftPay Configuration
SWIFTPAY_API_KEY=swp_abc123def456ghi789
SWIFTPAY_TILL_ID=dbdedaea-11d8-4bbe-b94f-84bbe4206d3c
SWIFTPAY_BACKEND_URL=https://swiftpay-backend-uvv9.onrender.com
```

---

## Step 4: Create Payment API Route

### For Vercel/Next.js (api/initiate-payment.js)

```javascript
// api/initiate-payment.js
const SWIFTPAY_API_KEY = process.env.SWIFTPAY_API_KEY;
const SWIFTPAY_TILL_ID = process.env.SWIFTPAY_TILL_ID;
const SWIFTPAY_BACKEND_URL = process.env.SWIFTPAY_BACKEND_URL || 'https://swiftpay-backend-uvv9.onrender.com';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { phoneNumber, amount } = req.body;

  // Normalize phone to 254 format
  let phone = phoneNumber.replace(/\s/g, '');
  if (phone.startsWith('0')) {
    phone = '254' + phone.substring(1);
  }

  try {
    const response = await fetch(`${SWIFTPAY_BACKEND_URL}/api/mpesa/stk-push-api`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SWIFTPAY_API_KEY}`,
      },
      body: JSON.stringify({
        phone_number: phone,
        amount: amount,
        till_id: SWIFTPAY_TILL_ID
      }),
    });

    const data = await response.json();
    
    if (data.success) {
      return res.status(200).json({
        success: true,
        checkoutId: data.data?.checkout_id || data.data?.request_id
      });
    } else {
      return res.status(400).json({ success: false, message: data.message });
    }
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
```

---

## Step 5: Create Payment Status Route

```javascript
// api/payment-status.js
const SWIFTPAY_BACKEND_URL = process.env.SWIFTPAY_BACKEND_URL || 'https://swiftpay-backend-uvv9.onrender.com';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { checkoutId } = req.query;

  try {
    const response = await fetch(`${SWIFTPAY_BACKEND_URL}/api/mpesa-verification-proxy`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ checkoutId })
    });

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
```

---

## Step 6: Frontend Integration (React Example)

```javascript
// components/PaymentButton.jsx
import { useState } from 'react';

export function PaymentButton({ amount, phoneNumber }) {
  const [status, setStatus] = useState('idle'); // idle, processing, success, failed

  const handlePayment = async () => {
    setStatus('processing');
    
    // 1. Initiate STK Push
    const initResponse = await fetch('/api/initiate-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneNumber, amount })
    });
    
    const initData = await initResponse.json();
    
    if (!initData.success) {
      setStatus('failed');
      return;
    }
    
    // 2. Poll for payment status every 5 seconds
    const checkoutId = initData.checkoutId;
    const maxAttempts = 24; // 2 minutes
    let attempts = 0;
    
    const poll = async () => {
      const statusResponse = await fetch(`/api/payment-status?checkoutId=${checkoutId}`);
      const statusData = await statusResponse.json();
      
      if (statusData.payment?.status === 'success') {
        setStatus('success');
        return;
      } else if (statusData.payment?.status === 'failed') {
        setStatus('failed');
        return;
      }
      
      attempts++;
      if (attempts < maxAttempts) {
        setTimeout(poll, 5000); // Check again in 5 seconds
      } else {
        setStatus('failed'); // Timeout
      }
    };
    
    setTimeout(poll, 3000); // Start polling after 3 seconds
  };

  return (
    <button onClick={handlePayment} disabled={status === 'processing'}>
      {status === 'processing' ? 'Processing...' : `Pay KES ${amount}`}
    </button>
  );
}
```

---

## How It Works

```
┌─────────────────┐         ┌──────────────┐         ┌─────────────┐
│   Your App      │   1.    │  SwiftPay    │   2.    │   M-Pesa    │
│   Frontend      │ ──────► │   Backend    │ ──────► │   (STK)     │
└─────────────────┘         └──────────────┘         └─────────────┘
        │                          │                        │
        │                          │                        │
        │         3. User enters PIN on phone               │
        │                          │                        │
        │   4. Poll for status     │   5. Verify payment    │
        │ ◄─────────────────────── │ ◄───────────────────── │
        │                          │                        │
        ▼                          ▼                        ▼
   ✅ Show success           Update DB              Send SMS
```

---

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `SWIFTPAY_API_KEY` | ✅ | Your API key from Dashboard → API Keys |
| `SWIFTPAY_TILL_ID` | ✅ | Your Till ID from Dashboard → Accounts |
| `SWIFTPAY_BACKEND_URL` | ❌ | Defaults to `https://swiftpay-backend-uvv9.onrender.com` |

---

## Troubleshooting

### "Invalid API key" Error
- Verify your API key is correct
- Check that the API key is linked to an active till

### "Payment still pending" after 2 minutes
- User may have ignored the STK prompt
- User may have entered wrong PIN
- Network issues - retry the payment

### Phone number format issues
- Use format `0712345678` or `254712345678`
- Don't include country code with `+`

---

## Next Steps

- **Webhooks**: Set up webhooks in Dashboard → Webhooks to receive real-time payment notifications
- **Analytics**: View all transactions in Dashboard → Transactions
- **Multiple Tills**: Create separate tills for different payment flows

---

**Need help?** Check your Dashboard for transaction logs or contact support.

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dbpbvoqfexofyxcexmmp.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRicGJ2b3FmZXhvZnl4Y2V4bW1wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzNDc0NTMsImV4cCI6MjA3NDkyMzQ1M30.hGn7ux2xnRxseYCjiZfCLchgOEwIlIAUkdS6h7byZqc';

const supabase = createClient(supabaseUrl, supabaseKey);

// M-Pesa Configuration (Defaults from server.js for out-of-the-box support)
const CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY || 'QNDgt0ltfcmiiDAEVWfwAwWq2uHq3XeXv7BEXKGJKS7X7wVg';
const CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET || 'TD6vam4JJs7ghG5eGutL4zsNFFNLBF9yEBxUNZRopGPVNv77yqQvYo0OhsMy3eSq';
const PASSKEY = process.env.MPESA_PASSKEY || 'cb9041a559db0ad7cbd8debaa5574661c5bf4e1fb7c7e99a8116c83dcaa8474d';
const SHORTCODE = process.env.MPESA_SHORTCODE || '3581047'; // From server.js

// URLs
const OAUTH_URL = 'https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';
const STK_URL = 'https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest';

// Helper: Get OAuth Token
async function getAccessToken() {
  const credentials = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');
  try {
    const response = await fetch(OAUTH_URL, {
      headers: { 'Authorization': `Basic ${credentials}` }
    });
    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('OAuth Error:', error);
    throw new Error('Failed to get M-Pesa access token');
  }
}

// Helper: Generate Password
function generatePassword() {
  const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
  const password = Buffer.from(`${SHORTCODE}${PASSKEY}${timestamp}`).toString('base64');
  return { password, timestamp };
}

// Helper: Normalize Phone
function normalizePhoneNumber(phone) {
  if (!phone) return null;
  let cleaned = phone.replace(/[\s\-\(\)]/g, '');
  if (cleaned.startsWith('0')) cleaned = '254' + cleaned.substring(1);
  return (cleaned.length === 12 && /^\d+$/.test(cleaned)) ? cleaned : null;
}

export default async (req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

  if (req.method === 'OPTIONS') return res.status(200).send('');
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  try {
    const { phoneNumber, amount, loanAmount } = req.body;

    // 1. Validation
    const normalizedPhone = normalizePhoneNumber(phoneNumber);
    if (!normalizedPhone) {
      return res.status(400).json({ success: false, message: 'Invalid phone number' });
    }

    // Default fee calculation if amount not provided
    const calculateFee = (amt) => {
      if (amt <= 5000) return 99;
      if (amt <= 7000) return 135;
      return 165;
    };
    const finalAmount = amount || calculateFee(loanAmount || 0);

    // 2. Prepare M-Pesa Payload
    const accessToken = await getAccessToken();
    const { password, timestamp } = generatePassword();

    // Determine Callback URL
    // Try request header, env var, or fallback. VERCEL_URL excludes protocol.
    const host = req.headers.host;
    const protocol = host.includes('localhost') ? 'http' : 'https';
    // IMPORTANT: CallBackURL must be reachable by Safaricom (public internet)
    const callbackUrl = process.env.MPESA_CALLBACK_URL || `${protocol}://${host}/api/mpesa-callback`;

    const payload = {
      BusinessShortCode: SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerBuyGoodsOnline', // Using BuyGoods based on shortcode length (7 digits)
      Amount: Math.floor(finalAmount), // Ensure integer
      PartyA: normalizedPhone,
      PartyB: SHORTCODE,
      PhoneNumber: normalizedPhone,
      CallBackURL: callbackUrl,
      AccountReference: 'SwiftPay',
      TransactionDesc: 'Loan Processing Fee'
    };

    // 7-digit shortcodes are usually Buy Goods (CustomerBuyGoodsOnline) or Paybill.
    // If it's a Paybill, PartyB should be the Paybill number.
    // server.js used 'CustomerBuyGoodsOnline'.

    console.log('Sending STK Push to Safaricom:', { phone: normalizedPhone, amount: finalAmount, callback: callbackUrl });

    // 3. Send Request
    const mpesaRes = await fetch(STK_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const mpesaData = await mpesaRes.json();
    console.log('M-Pesa Response:', mpesaData);

    if (mpesaData.ResponseCode === '0') {
      const checkoutId = mpesaData.CheckoutRequestID;

      // 4. Save to Database
      await supabase.from('transactions').insert({
        transaction_request_id: checkoutId,
        amount: parseFloat(finalAmount),
        phone_number: normalizedPhone,
        status: 'pending',
        transaction_type: 'stk_push'
      });

      return res.status(200).json({
        success: true,
        message: 'Payment initiated successfully',
        data: {
          checkoutId: checkoutId,
          // Keep backward compatibility
          requestId: checkoutId,
          checkoutRequestId: checkoutId
        }
      });
    } else {
      return res.status(400).json({
        success: false,
        message: mpesaData.errorMessage || 'M-Pesa request failed',
        details: mpesaData
      });
    }

  } catch (error) {
    console.error('STK Push Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to initiate payment',
      error: error.message
    });
  }
};

/**
 * SwiftPay Integration Boilerplate
 * Copy these files to your project's /api folder
 * 
 * Environment variables needed:
 * - SWIFTPAY_API_KEY
 * - SWIFTPAY_TILL_ID
 */

// ============================================
// FILE 1: api/initiate-payment.js
// ============================================

const SWIFTPAY_API_KEY = process.env.SWIFTPAY_API_KEY;
const SWIFTPAY_TILL_ID = process.env.SWIFTPAY_TILL_ID;
const SWIFTPAY_BACKEND_URL = 'https://swiftpay-backend-uvv9.onrender.com';

// Normalize phone number to 254 format
function normalizePhone(phone) {
    let cleaned = phone.replace(/[\s\-\(\)]/g, '');
    if (cleaned.startsWith('0')) {
        cleaned = '254' + cleaned.substring(1);
    }
    if (cleaned.startsWith('+')) {
        cleaned = cleaned.substring(1);
    }
    return cleaned;
}

export default async function handler(req, res) {
    // Allow CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    try {
        const { phoneNumber, amount, description = 'Payment' } = req.body;

        if (!phoneNumber || !amount) {
            return res.status(400).json({
                success: false,
                message: 'phoneNumber and amount are required'
            });
        }

        const normalizedPhone = normalizePhone(phoneNumber);

        // Validate phone format
        if (normalizedPhone.length !== 12 || !/^\d+$/.test(normalizedPhone)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid phone number format. Use 07XXXXXXXX or 254XXXXXXXXX'
            });
        }

        // Call SwiftPay API
        const response = await fetch(`${SWIFTPAY_BACKEND_URL}/api/mpesa/stk-push-api`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${SWIFTPAY_API_KEY}`,
            },
            body: JSON.stringify({
                phone_number: normalizedPhone,
                amount: Number(amount),
                till_id: SWIFTPAY_TILL_ID
            }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
            return res.status(200).json({
                success: true,
                message: 'STK Push sent successfully',
                data: {
                    checkoutId: data.data?.checkout_id || data.data?.request_id,
                    checkoutRequestId: data.CheckoutRequestID
                }
            });
        } else {
            return res.status(400).json({
                success: false,
                message: data.message || 'Payment initiation failed'
            });
        }
    } catch (error) {
        console.error('Payment initiation error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
}


// ============================================
// FILE 2: api/payment-status.js
// ============================================

const SWIFTPAY_PROXY_URL = 'https://swiftpay-backend-uvv9.onrender.com/api/mpesa-verification-proxy';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    try {
        const { checkoutId } = req.query;

        if (!checkoutId) {
            return res.status(400).json({
                success: false,
                message: 'checkoutId is required'
            });
        }

        // Query SwiftPay verification proxy
        const response = await fetch(SWIFTPAY_PROXY_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ checkoutId })
        });

        const data = await response.json();

        return res.status(200).json({
            success: true,
            payment: {
                status: data.payment?.status || 'pending',
                receipt: data.payment?.receipt || null,
                resultCode: data.payment?.resultCode || null,
                resultDesc: data.payment?.resultDesc || null
            }
        });
    } catch (error) {
        console.error('Payment status error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to check payment status',
            error: error.message
        });
    }
}

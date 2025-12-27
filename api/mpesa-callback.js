import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dbpbvoqfexofyxcexmmp.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRicGJ2b3FmZXhvZnl4Y2V4bW1wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzNDc0NTMsImV4cCI6MjA3NDkyMzQ1M30.hGn7ux2xnRxseYCjiZfCLchgOEwIlIAUkdS6h7byZqc';

const supabase = createClient(supabaseUrl, supabaseKey);

export default async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { Body } = req.body;

        if (!Body || !Body.stkCallback) {
            console.log('Invalid callback payload', JSON.stringify(req.body));
            return res.status(400).json({ message: 'Invalid payload' });
        }

        const { MerchantRequestID, CheckoutRequestID, ResultCode, ResultDesc, CallbackMetadata } = Body.stkCallback;

        console.log(`Callback received for CheckoutID: ${CheckoutRequestID}, ResultCode: ${ResultCode}`);

        let status = 'failed';
        let receipt = null;
        let amount = null;
        let phone = null;

        // ResultCode 0 means success
        if (ResultCode === 0) {
            status = 'success';
            const items = CallbackMetadata?.Item || [];
            const receiptItem = items.find(i => i.Name === 'MpesaReceiptNumber');
            const amountItem = items.find(i => i.Name === 'Amount');
            const phoneItem = items.find(i => i.Name === 'PhoneNumber');

            if (receiptItem) receipt = receiptItem.Value;
            if (amountItem) amount = amountItem.Value;
            if (phoneItem) phone = phoneItem.Value;
        }

        // Update Transaction in Supabase
        // We try to match by CheckoutRequestID (best) or MerchantRequestID
        const { data, error } = await supabase
            .from('transactions')
            .update({
                status: status,
                mpesa_receipt_number: receipt,
                result_code: ResultCode,
                result_description: ResultDesc,
                // Only update these if we got them from callback
                ...(amount && { amount }),
                ...(phone && { phone_number: phone.toString() }),
                updated_at: new Date().toISOString()
            })
            .eq('transaction_request_id', CheckoutRequestID) // We stored checkout_id here in initiate-payment
            .select();

        if (error) {
            console.error('Supabase update error:', error);
            return res.status(500).json({ message: 'Database error' });
        }

        if (!data || data.length === 0) {
            console.warn(`No transaction found for CheckoutID: ${CheckoutRequestID}`);
            // Fallback: Try matching by mpesa_request_id if you have a column for it, 
            // but 'transaction_request_id' is our main link.
        } else {
            console.log(`Transaction updated successfully: ${data[0].id}`);
        }

        return res.json({ result: 'success' });

    } catch (error) {
        console.error('Callback processing error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

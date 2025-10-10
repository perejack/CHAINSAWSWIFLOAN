// Netlify function to check payment status directly from PesaFlux API
const { supabase } = require('./supabase');

// PesaFlux API credentials - hardcoded for testing
const API_KEY = 'PSFXPCGLCY37';
const EMAIL = 'silverstonesolutions103@gmail.com';

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
};

exports.handler = async (event, context) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ success: false, message: 'Method not allowed' })
    };
  }

  try {
    // Get reference from path parameter
    const reference = event.path.split('/').pop();
    
    if (!reference) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ success: false, message: 'Payment reference is required' })
      };
    }
    
    console.log('Checking PesaFlux status for reference:', reference);
    
    // First check our database
    console.log('Querying Supabase for transaction...');
    const { data: transaction, error: dbError } = await supabase
      .from('transactions')
      .select('*')
      .or(`reference.eq.${reference},transaction_request_id.eq.${reference}`)
      .maybeSingle();
    
    console.log('Supabase query result:', { transaction, dbError });
    
    if (dbError) {
      console.error('Database query error:', dbError);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          success: false,
          message: 'Error checking payment status'
        })
      };
    }
    
    // If we have a transaction and it's not pending, return it
    if (transaction && transaction.status !== 'pending') {
      console.log('Found completed transaction in database:', transaction);
      
      let paymentStatus = 'PENDING';
      let resultDesc = transaction.result_description || 'Payment processed';
      
      if (transaction.status === 'success') {
        paymentStatus = 'SUCCESS';
        resultDesc = 'Payment completed successfully';
      } else if (transaction.status === 'cancelled') {
        paymentStatus = 'FAILED';
        resultDesc = 'Payment cancelled by user';
      } else if (transaction.status === 'failed') {
        paymentStatus = 'FAILED';
        resultDesc = transaction.result_description || 'Payment failed';
      }
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          payment: {
            status: paymentStatus,
            amount: transaction.amount,
            phoneNumber: transaction.phone,
            mpesaReceiptNumber: transaction.receipt_number,
            resultDesc: resultDesc,
            resultCode: transaction.result_code,
            timestamp: transaction.updated_at
          }
        })
      };
    }
    
    // If transaction is still pending, check PesaFlux API directly
    if (transaction && transaction.transaction_request_id) {
      try {
        console.log('Checking PesaFlux API for transaction:', transaction.transaction_request_id);
        
        // Check PesaFlux status API (if available)
        const pesafluxResponse = await fetch(`https://api.pesaflux.co.ke/v1/status/${transaction.transaction_request_id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Authorization': `Bearer ${API_KEY}`,
          }
        });
        
        if (pesafluxResponse.ok) {
          const pesafluxData = await pesafluxResponse.json();
          console.log('PesaFlux status response:', pesafluxData);
          
          // Update our database based on PesaFlux response
          if (pesafluxData.status === 'completed' || pesafluxData.status === 'success') {
            await supabase
              .from('transactions')
              .update({
                status: 'success',
                result_code: '0',
                result_description: 'Payment completed successfully',
                updated_at: new Date().toISOString()
              })
              .eq('id', transaction.id);
            
            return {
              statusCode: 200,
              headers,
              body: JSON.stringify({
                success: true,
                payment: {
                  status: 'SUCCESS',
                  amount: transaction.amount,
                  phoneNumber: transaction.phone,
                  resultDesc: 'Payment completed successfully',
                  timestamp: new Date().toISOString()
                }
              })
            };
          }
        }
      } catch (apiError) {
        console.error('PesaFlux API error:', apiError);
        // Continue with pending status if API check fails
      }
    }
    
    // Return pending status
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        payment: {
          status: 'PENDING',
          message: 'Payment is still being processed'
        }
      })
    };
    
  } catch (error) {
    console.error('Payment status check error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        message: 'Failed to check payment status',
        error: error.message
      })
    };
  }
};

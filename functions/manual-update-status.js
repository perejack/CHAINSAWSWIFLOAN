// Netlify function to manually update transaction status for testing
const { supabase } = require('./supabase');

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
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

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ success: false, message: 'Method not allowed' })
    };
  }

  try {
    const { reference, status, resultDesc } = JSON.parse(event.body);
    
    if (!reference || !status) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ success: false, message: 'Reference and status are required' })
      };
    }
    
    console.log(`Manually updating transaction ${reference} to status: ${status}`);
    
    // Update transaction in Supabase
    const { data, error } = await supabase
      .from('transactions')
      .update({
        status: status,
        result_description: resultDesc || `Payment ${status}`,
        result_code: status === 'success' ? '0' : '1',
        updated_at: new Date().toISOString()
      })
      .or(`reference.eq.${reference},transaction_request_id.eq.${reference}`)
      .select();
    
    if (error) {
      console.error('Database update error:', error);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ success: false, message: 'Failed to update transaction' })
      };
    }
    
    if (data && data.length > 0) {
      console.log('Transaction updated successfully:', data[0]);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          success: true, 
          message: `Transaction ${reference} updated to ${status}`,
          transaction: data[0]
        })
      };
    } else {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ success: false, message: 'Transaction not found' })
      };
    }
    
  } catch (error) {
    console.error('Manual update error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, message: 'Failed to update status' })
    };
  }
};

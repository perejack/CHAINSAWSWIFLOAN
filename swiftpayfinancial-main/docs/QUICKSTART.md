# SwiftPay Quickstart - First Payment in 5 Minutes

## 1. Get Your Credentials (2 minutes)

Log in to [swiftpayfinancial.com](https://swiftpayfinancial.com) and:

1. **Create a Till**: Dashboard → Accounts → Add New Till
   - Copy the **Till ID** (e.g., `dbdedaea-11d8-4bbe-b94f-84bbe4206d3c`)

2. **Generate API Key**: Dashboard → API Keys → Generate New Key
   - Select your till
   - Copy the **API Key** (e.g., `swp_abc123...`)

---

## 2. Make Your First Payment (3 minutes)

### Quick Test with cURL

```bash
curl -X POST https://swiftpay-backend-uvv9.onrender.com/api/mpesa/stk-push-api \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "phone_number": "254712345678",
    "amount": 1,
    "till_id": "YOUR_TILL_ID"
  }'
```

### JavaScript/Node.js

```javascript
const response = await fetch('https://swiftpay-backend-uvv9.onrender.com/api/mpesa/stk-push-api', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify({
    phone_number: '254712345678',
    amount: 1,
    till_id: 'YOUR_TILL_ID'
  })
});

const result = await response.json();
console.log(result);
// { success: true, data: { checkout_id: "ws_CO_..." } }
```

---

## 3. Check Payment Status

```javascript
const statusResponse = await fetch('https://swiftpay-backend-uvv9.onrender.com/api/mpesa-verification-proxy', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ checkoutId: 'ws_CO_...' })
});

const status = await statusResponse.json();
// { success: true, payment: { status: "success", receipt: "MPF123..." } }
```

---

## That's It! 🎉

For complete integration with polling logic and error handling, see [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md).

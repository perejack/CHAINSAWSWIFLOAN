# SwiftPay Developer Portal

Welcome to SwiftPay! This portal helps you integrate M-Pesa payments into your application.

## 📚 Documentation

| Document | Description | Time |
|----------|-------------|------|
| **[Quickstart](./QUICKSTART.md)** | Get your first payment working | 5 min |
| **[Integration Guide](./INTEGRATION_GUIDE.md)** | Complete step-by-step integration | 10 min |
| [API Reference](../README.md#-api-endpoints) | Full API endpoint documentation | Reference |

---

## 🚀 Quick Overview

### What You Need

1. **Till ID** - Create a till in Dashboard → Accounts
2. **API Key** - Generate in Dashboard → API Keys (linked to your till)

### How Payments Work

```
Your App → SwiftPay API → M-Pesa STK Push → User enters PIN → Payment confirmed
```

### Integration Pattern (from production apps)

```javascript
// 1. Initiate STK Push
POST https://swiftpay-backend-uvv9.onrender.com/api/mpesa/stk-push-api
Headers: Authorization: Bearer YOUR_API_KEY
Body: { phone_number: "254...", amount: 100, till_id: "YOUR_TILL_ID" }

// 2. Poll for status (every 5 seconds)
POST https://swiftpay-backend-uvv9.onrender.com/api/mpesa-verification-proxy
Body: { checkoutId: "ws_CO_..." }
```

---

## 📖 Complete Guides

### For Beginners
Start with the **[Quickstart](./QUICKSTART.md)** - make a test payment in 5 minutes.

### For Full Integration
Follow the **[Integration Guide](./INTEGRATION_GUIDE.md)** - includes complete code with polling, error handling, and React components.

---

## 🔑 Required Credentials

| Credential | Where to Get | Used For |
|------------|--------------|----------|
| **SWIFTPAY_API_KEY** | Dashboard → API Keys | Authenticating requests |
| **SWIFTPAY_TILL_ID** | Dashboard → Accounts | Identifying your payment account |

### Backend URL
```
https://swiftpay-backend-uvv9.onrender.com
```

This is the SwiftPay backend. No signup or additional keys needed for this URL.

---

## 📞 Support

1. Check [Integration Guide](./INTEGRATION_GUIDE.md#troubleshooting) for common issues
2. View transaction history in Dashboard → Transactions
3. Contact support for additional help

---

**Ready to start?** → [Quickstart Guide](./QUICKSTART.md)

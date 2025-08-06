# Environment Variables Setup

To enable the subscription flow with Razorpay payments, add these environment variables to your `.env.local` file:

```bash
# Razorpay Payment Gateway
RAZORPAY_KEY_ID="your-razorpay-key-id"
RAZORPAY_KEY_SECRET="your-razorpay-key-secret"
NEXT_PUBLIC_RAZORPAY_KEY_ID="your-razorpay-key-id"
```

## How to get Razorpay credentials:

1. **Sign up for Razorpay**: Go to https://razorpay.com/ and create an account
2. **Generate API Keys**: 
   - Go to Dashboard → Settings → API Keys
   - Generate Test/Live keys based on your environment
   - Copy the Key ID and Key Secret
3. **Add to environment**: Add the keys to your `.env.local` file
4. **Test mode**: Use test keys for development, live keys for production

## Subscription Flow:

1. **New user signs up** → Redirected to `/subscribe`
2. **User sees pricing** → ₹499/month subscription page
3. **Payment processing** → Razorpay handles secure payment
4. **Payment success** → Auto-grants subscription → Redirects to onboarding
5. **Onboarding complete** → User can access dashboard

## Testing Payments:

Use these test card details in development:
- **Card Number**: 4111 1111 1111 1111
- **Expiry**: Any future date
- **CVV**: Any 3-digit number
- **Name**: Any name

## Security Notes:

- Keep `RAZORPAY_KEY_SECRET` private and never expose it to frontend
- `NEXT_PUBLIC_RAZORPAY_KEY_ID` is safe to expose as it's used in frontend
- Always verify payments on server-side using the secret key
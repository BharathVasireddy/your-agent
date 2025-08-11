import Link from 'next/link';

export default function TestSubscriptionPage() {
  return (
    <div className="min-h-screen bg-zinc-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-zinc-200 p-8">
          <h1 className="text-3xl font-bold text-zinc-950 mb-6">
            Test Subscription Flow
          </h1>
          
          <div className="space-y-4">
            <p className="text-zinc-600">
              Use these links to test different parts of the subscription flow:
            </p>
            
            <div className="space-y-3">
              <Link 
                href="/subscribe" 
                className="block p-4 bg-brand-light border border-brand-soft rounded-lg hover:bg-brand-muted transition-colors"
              >
                <div className="font-semibold text-brand-deep">Real Payment Flow</div>
                <div className="text-sm text-brand">₹499/month subscription with Razorpay</div>
              </Link>
              
              <Link 
                href="/subscribe/test-payment" 
                className="block p-4 bg-yellow-50 border border-yellow-200 rounded-lg hover:bg-yellow-100 transition-colors"
              >
                <div className="font-semibold text-yellow-800">Test Payment Flow</div>
                <div className="text-sm text-yellow-600">Simulate payment without charges (dev only)</div>
              </Link>
              
              <Link 
                href="/agent/dashboard/subscription" 
                className="block p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <div className="font-semibold text-blue-800">Subscription Management</div>
                <div className="text-sm text-blue-600">View current subscription status</div>
              </Link>
              
              <Link 
                href="/onboarding/welcome" 
                className="block p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
              >
                <div className="font-semibold text-green-800">Onboarding Flow</div>
                <div className="text-sm text-green-600">Test the complete user flow</div>
              </Link>
            </div>
            
            <div className="mt-8 p-4 bg-zinc-50 rounded-lg">
              <h3 className="font-semibold text-zinc-950 mb-2">Setup Instructions:</h3>
              <ol className="text-sm text-zinc-600 space-y-1">
                <li>1. For real payments: Add Razorpay credentials to .env.local</li>
                <li>2. For testing: Use the test payment flow</li>
                <li>3. Check subscription status in the dashboard</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
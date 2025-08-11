'use client';

// Removed Badge import - using inline styling instead
import { Button } from '@/components/ui/button';
import { Check, Crown, Calendar, CreditCard } from 'lucide-react';

interface SubscriptionManagementProps {
  agent: {
    isSubscribed: boolean;
    subscriptionEndsAt: Date | null;
    payments?: Array<{
      id: string;
      amount: number;
      createdAt: Date;
      status: string;
    }>;
  };
}

export default function SubscriptionManagement({ agent }: SubscriptionManagementProps) {
  const isActive = agent.isSubscribed;
  const expiryDate = agent.subscriptionEndsAt ? new Date(agent.subscriptionEndsAt) : null;
  const daysUntilExpiry = expiryDate ? Math.ceil((expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : 0;

  return (
    <div className="space-y-6">
      
      {/* Current Subscription Status */}
      <div className="bg-white rounded-lg shadow-sm border border-zinc-200 p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-[#FFDCCF] rounded-lg flex items-center justify-center">
              <Crown className="w-6 h-6 text-brand" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-zinc-950 mb-2">
                Current Plan: Professional
              </h3>
              <div className="flex items-center space-x-3 mb-3">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                  {isActive ? "Active" : "Inactive"}
                </span>
                <span className="text-2xl font-bold text-zinc-950">₹499/month</span>
              </div>
              
              {expiryDate && (
                <div className="flex items-center space-x-2 text-zinc-600">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {isActive ? 'Renews' : 'Expired'} on {expiryDate.toLocaleDateString('en-IN')}
                    {isActive && daysUntilExpiry <= 30 && (
                      <span className="text-orange-600 ml-2">
                        ({daysUntilExpiry} days remaining)
                      </span>
                    )}
                  </span>
                </div>
              )}
            </div>
          </div>
          
          <div className="text-right">
            {!isActive ? (
              <Button className="bg-brand hover:bg-brand-hover text-white">
                Renew Subscription
              </Button>
            ) : (
              <Button variant="outline">
                <CreditCard className="w-4 h-4 mr-2" />
                Update Payment
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Plan Features */}
      <div className="bg-white rounded-lg shadow-sm border border-zinc-200 p-6">
        <h3 className="text-lg font-semibold text-zinc-950 mb-4">Your Plan Includes</h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          {[
            'Professional profile with custom URL',
            'Unlimited property listings',
            'Advanced lead management',
            'Customer testimonials system',
            'Professional website templates',
            'Priority support'
          ].map((feature, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                <Check className="w-3 h-3 text-green-600" />
              </div>
              <span className="text-zinc-700">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Billing History */}
      <div className="bg-white rounded-lg shadow-sm border border-zinc-200 p-6">
        <h3 className="text-lg font-semibold text-zinc-950 mb-4">Recent Payments</h3>
        
        {agent.payments && agent.payments.length > 0 ? (
          <div className="space-y-3">
            {agent.payments.slice(0, 5).map((payment) => (
              <div key={payment.id} className="flex items-center justify-between py-3 border-b border-zinc-100 last:border-0">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium text-zinc-950">
                      Subscription Payment
                    </div>
                    <div className="text-sm text-zinc-500">
                      {new Date(payment.createdAt).toLocaleDateString('en-IN')}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-zinc-950">
                    ₹{payment.amount / 100}
                  </div>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {payment.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-zinc-500">
            <CreditCard className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No payment history available</p>
          </div>
        )}
      </div>

      {/* Help Section */}
      <div className="bg-zinc-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-zinc-950 mb-2">Need Help?</h3>
        <p className="text-zinc-600 mb-4">
          Have questions about your subscription or billing? We&apos;re here to help.
        </p>
        <Button variant="outline" size="sm">
          Contact Support
        </Button>
      </div>
    </div>
  );
}
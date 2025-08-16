"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
// import Link from "next/link";
// Removed country selector per requirement; using plain input with IN validation
import { Button } from "@/components/ui/button";

interface SignInFormProps {
  onSuccess?: () => void;
}

export default function SignInForm({ onSuccess }: SignInFormProps) {
  const router = useRouter();
  // legacy fields no longer used
  const [isLoading] = useState(false);
  const [showWhatsApp, setShowWhatsApp] = useState(false);
  const [waPhone, setWaPhone] = useState('');
  const [waStage, setWaStage] = useState<'enter' | 'otp'>('enter');
  const [waCode, setWaCode] = useState('');
  const [waMsg, setWaMsg] = useState<string | null>(null);
  // We do not collect name here; it will be collected in onboarding

  // Remove old slug/name utilities from login

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setWaMsg('Please use Continue with Google or Continue with WhatsApp');
  // };

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: '/api/auth/post-signin-redirect' });
  };

  const sendWaOtp = async () => {
    setWaMsg(null);
    // Validate Indian 10-digit mobile number
    if (!/^\d{10}$/.test(waPhone)) {
      setWaMsg('Enter a valid 10-digit Indian mobile number');
      return;
    }
    const res = await fetch('/api/auth/whatsapp/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: `+91${waPhone}` }),
    });
    const data = await res.json();
    if (!res.ok) {
      setWaMsg(data.error || 'Failed to send code');
      return;
    }
    setWaStage('otp');
    setWaMsg('We sent a code to your WhatsApp');
  };

  const verifyWaOtp = async () => {
    setWaMsg(null);
    try {
      const res = await fetch('/api/auth/whatsapp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: `+91${waPhone}`, code: waCode }),
      });
      const data = await res.json();
      console.log('WhatsApp verify response:', data);
      
      if (!res.ok) {
        setWaMsg(data.error || 'Invalid code');
        return;
      }
      
      // Always proceed to establish a session via NextAuth WhatsApp provider.
      // This avoids a state where the number is linked but the app didn't create a session.
      try {
        await signIn('whatsapp', {
          identifier: data.phone,
          token: waCode,
          callbackUrl: '/api/auth/post-signin-redirect',
          redirect: true,
        });
      } catch (e) {
        console.error('WhatsApp signIn redirect failed, falling back', e);
      }

      try {
        localStorage.setItem('wa_phone_e164', `+91${waPhone}`);
        localStorage.setItem('wa_phone_local', waPhone);
      } catch {}
      if (onSuccess) onSuccess(); else router.replace('/api/auth/post-signin-redirect');
    } catch (error) {
      console.error('WhatsApp verify error:', error);
      setWaMsg('Network error. Please try again.');
    }
  };

  return (
    <div className="w-full">
      {/* Buttons Row */}
      {!showWhatsApp && (
        <div className="mb-6 space-y-3">
        <Button
          type="button"
          variant="outline"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className={`w-full border-2 hover:bg-gray-50 btn-lg transition-all duration-200`}
            style={{ borderColor: 'var(--border-color)' }}
        >
          <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowWhatsApp(true)}
            disabled={isLoading}
            className="w-full border-2 hover:bg-gray-50 btn-lg transition-all duration-200"
            style={{ borderColor: 'var(--border-color)' }}
          >
            {/* Use Next Image for optimal LCP */}
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path fill="#25D366" d="M20.52 3.48A11.77 11.77 0 0012.06 0C5.47 0 .12 5.35.12 11.94c0 2.1.55 4.16 1.6 5.98L0 24l6.24-1.65a11.9 11.9 0 005.82 1.48h.01c6.59 0 11.94-5.35 11.94-11.94 0-3.19-1.24-6.19-3.49-8.41zM12.07 21.3h-.01a9.4 9.4 0 01-4.79-1.31l-.34-.2-3.7.98.99-3.6-.22-.37A9.42 9.42 0 012.7 11.94C2.7 6.77 6.9 2.57 12.07 2.57c2.49 0 4.82.97 6.59 2.73a9.24 9.24 0 012.73 6.64c0 5.17-4.2 9.36-9.32 9.36zm5.39-7.02c-.29-.14-1.7-.84-1.96-.94-.26-.1-.46-.14-.65.14-.19.29-.75.94-.92 1.13-.17.19-.34.22-.63.08-.29-.14-1.21-.45-2.31-1.43-.85-.76-1.42-1.7-1.59-1.99-.17-.29-.02-.45.13-.59.13-.13.29-.34.43-.51.14-.17.19-.29.29-.48.1-.19.05-.36-.02-.5-.08-.14-.65-1.57-.89-2.15-.23-.55-.48-.48-.65-.49l-.55-.01c-.19 0-.5.07-.76.36-.26.29-1 1-1 2.43s1.03 2.82 1.18 3.02c.14.19 2.02 3.09 4.89 4.34.68.29 1.21.46 1.62.59.68.22 1.3.19 1.79.12.55-.08 1.7-.69 1.94-1.35.24-.66.24-1.22.17-1.35-.07-.13-.26-.2-.55-.34z"/>
            </svg>
            Continue with WhatsApp
          </Button>
      </div>
      )}

      {/* WhatsApp Login */}
      {showWhatsApp && (
        <div className="mb-6 space-y-6">
          {/* Header with back option */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
              Continue with WhatsApp
            </h2>
            <button type="button" onClick={() => setShowWhatsApp(false)} className="text-sm text-zinc-600 hover:text-zinc-800 transition-colors" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>Back to options</button>
          </div>

          <div className="border-2 rounded-lg p-6 space-y-4" style={{ borderColor: "var(--border-color)" }}>
            {waStage === 'enter' ? (
              <>
                <div>
                  <label 
                    className="block text-sm font-medium text-gray-700 mb-2"
                    style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
                  >
                    WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={waPhone}
                    onChange={(e)=>{
                      const digits = e.target.value.replace(/\D/g,'').slice(0,10);
                      setWaPhone(digits);
                    }}
                    placeholder="Enter 10-digit mobile number"
                    className="w-full border-2 rounded-lg h-12 text-base px-3 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
                    style={{ borderColor: 'var(--border-color)' }}
                  />
                  <p className="mt-1 text-xs text-zinc-500">India only. We will send WhatsApp OTP to +91 {waPhone}</p>
                </div>
                {waMsg && (
                  <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg text-sm">
                    {waMsg}
                  </div>
                )}
                <Button 
                  type="button" 
                  onClick={sendWaOtp} 
                  className="w-full btn-lg text-white font-semibold"
                  style={{ backgroundColor: "var(--primary-red)", color: "white" }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--primary-red-hover)")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--primary-red)")}
                >
                  Send code on WhatsApp
                </Button>
              </>
            ) : (
              <>
                <div>
                  <label 
                    className="block text-sm font-medium text-gray-700 mb-4 text-center"
                    style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
                  >
                    Enter the 6-digit code sent to {waPhone}
                  </label>
                  <div 
                    className="flex gap-3 justify-center mb-4"
                    onPaste={(e) => {
                      e.preventDefault();
                      const paste = e.clipboardData.getData('text').replace(/\D/g, '');
                      if (paste.length <= 6) {
                        setWaCode(paste.padEnd(6, '').slice(0, 6));
                        // Focus the next empty input or the last one
                        const nextEmptyIndex = paste.length < 6 ? paste.length : 5;
                        const inputs = e.currentTarget.querySelectorAll('input');
                        (inputs[nextEmptyIndex] as HTMLInputElement)?.focus();
                      }
                    }}
                  >
                    {Array.from({ length: 6 }).map((_, i) => (
                      <input
                        key={i}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        className="w-12 h-12 text-center border-2 rounded-lg text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all duration-200"
                        style={{ 
                          borderColor: "var(--border-color)",
                          fontFamily: "Plus Jakarta Sans, sans-serif"
                        }}
                        value={waCode[i] || ''}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '').slice(0, 1);
                          const next = waCode.substring(0, i) + val + waCode.substring(i + 1);
                          setWaCode(next);
                          // focus next
                          const nextInput = e.currentTarget.parentElement?.querySelectorAll('input')[i + 1] as HTMLInputElement | undefined;
                          if (val && nextInput) nextInput.focus();
                        }}
                        onKeyDown={(e) => {
                          // Handle backspace to focus previous input
                          if (e.key === 'Backspace' && !waCode[i] && i > 0) {
                            const prevInput = e.currentTarget.parentElement?.querySelectorAll('input')[i - 1] as HTMLInputElement | undefined;
                            if (prevInput) prevInput.focus();
                          }
                        }}
                      />
                    ))}
                  </div>
                </div>
                {waMsg && (
                  <div className={`border px-4 py-3 rounded-lg text-sm text-center ${
                    waMsg.includes('Invalid') || waMsg.includes('Failed') || waMsg.includes('error') || waMsg.includes('Authentication failed')
                      ? 'bg-brand-light border-brand-soft text-brand-hover'
                      : 'bg-blue-50 border-blue-200 text-blue-700'
                  }`}>
                    {waMsg}
                  </div>
                )}
                <div className="flex flex-col space-y-3">
                  <Button 
                    type="button" 
                    onClick={verifyWaOtp} 
                    className="w-full btn-lg text-white font-semibold"
                    style={{ backgroundColor: "var(--primary-red)", color: "white" }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--primary-red-hover)")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--primary-red)")}
                  >
                    Verify & Continue
                  </Button>
                  <button 
                    type="button" 
                    onClick={() => setWaStage('enter')} 
                    className="text-sm text-zinc-600 hover:text-zinc-800 transition-colors duration-200 text-center"
                    style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
                  >
                    Change number
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Email/Password login removed per new auth policy (Google + WhatsApp only) */}
    </div>
  );
}
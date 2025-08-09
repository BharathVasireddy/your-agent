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
  const [formData] = useState({ email: "", password: "" });
  const [showPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [, setError] = useState("");
  const [isGoogleOnlyAccount, setIsGoogleOnlyAccount] = useState(false);
  const [showWhatsApp, setShowWhatsApp] = useState(false);
  const [waPhone, setWaPhone] = useState('');
  const [waCountry] = useState('IN');
  const [waStage, setWaStage] = useState<'info' | 'enter' | 'otp'>('info');
  const [waCode, setWaCode] = useState('');
  const [waMsg, setWaMsg] = useState<string | null>(null);
  const [waName, setWaName] = useState('');
  const [waSlug, setWaSlug] = useState('');

  const generateSlug = (input: string) =>
    input
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setIsGoogleOnlyAccount(false);

    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        // For any credential sign-in error, check if it's a Google-only account
        if (result.error === "CredentialsSignin" || result.error === "GOOGLE_ONLY_ACCOUNT") {
          // Check if this is a Google-only account
          try {
            const checkResponse = await fetch("/api/auth/check-email", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email: formData.email }),
            });
            
            if (checkResponse.ok) {
              const checkData = await checkResponse.json();
              if (checkData.exists && checkData.hasGoogle && !checkData.hasPassword) {
                setError("This email is associated with a Google account. Please use 'Continue with Google' to sign in.");
                setIsGoogleOnlyAccount(true);
                return;
              }
            }
          } catch {
            // If check fails, fall back to generic error
          }
        }
        setError("Invalid email or password");
      } else {
        if (onSuccess) {
          onSuccess();
        } else {
          // Navigate to appropriate page after login
          router.push('/agent/dashboard');
        }
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: '/api/auth/post-signin-redirect' });
  };

  const sendWaOtp = async () => {
    setWaMsg(null);
    if (!waName.trim()) {
      setWaMsg('Please enter your full name');
      return;
    }
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
        body: JSON.stringify({ phone: `+91${waPhone}`, code: waCode, name: waName }),
      });
      const data = await res.json();
      console.log('WhatsApp verify response:', data);
      
      if (!res.ok) {
        setWaMsg(data.error || 'Invalid code');
        return;
      }
      
      // If user was already logged in, just refresh the page
      if (data.wasAlreadyLoggedIn) {
        try {
          localStorage.setItem('wa_phone_e164', `+91${waPhone}`);
          localStorage.setItem('wa_phone_local', waPhone);
        } catch {}
        console.log('User was already logged in, skipping NextAuth flow');
        setWaMsg('Phone number linked to your account successfully!');
        setTimeout(() => {
          if (onSuccess) {
            onSuccess();
          } else {
            router.push('/agent/dashboard');
          }
        }, 1500);
        return;
      }
      
      console.log('User was not logged in, proceeding with NextAuth WhatsApp flow');
      
      // Create session via custom WhatsApp credentials provider using the same one-time code
      const result = await signIn('whatsapp', { 
        identifier: data.phone, 
        token: waCode, 
        redirect: false 
      });
      
      console.log('WhatsApp signIn result:', result);
      
      if (result?.ok && !result?.error) {
        try {
          localStorage.setItem('wa_phone_e164', `+91${waPhone}`);
          localStorage.setItem('wa_phone_local', waPhone);
        } catch {}
        if (onSuccess) {
          onSuccess();
        } else {
          router.push('/agent/dashboard');
        }
      } else {
        console.error('WhatsApp authentication error:', result?.error);
        setWaMsg(`Authentication failed: ${result?.error || 'Please try again'}`);
      }
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
          className={`w-full border-2 hover:bg-gray-50 btn-lg transition-all duration-200 ${
              isGoogleOnlyAccount ? 'border-red-300 bg-red-50 hover:bg-red-100 ring-2 ring-red-200' : ''
          }`}
            style={{ borderColor: isGoogleOnlyAccount ? '#fca5a5' : 'var(--border-color)' }}
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
            <img src="/whatsapp.svg" alt="WhatsApp" className="w-5 h-5 mr-3" />
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
            <button
              type="button"
              onClick={() => setShowWhatsApp(false)}
              className="text-sm text-zinc-600 hover:text-zinc-800 transition-colors"
              style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
            >
              Back to options
            </button>
          </div>

          <div className="border-2 rounded-lg p-6 space-y-4" style={{ borderColor: "var(--border-color)" }}>
            {waStage === 'info' ? (
              <>
                <div>
                  <label 
                    className="block text-sm font-medium text-gray-700 mb-2"
                    style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={waName}
                    onChange={(e) => {
                      setWaName(e.target.value);
                      setWaSlug(generateSlug(e.target.value));
                    }}
                    placeholder="Enter your full name"
                    className="w-full border-2 rounded-lg px-4 py-3 h-12 text-base focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    style={{ borderColor: 'var(--border-color)' }}
                  />
                </div>
                {waSlug && (
                  <div className="text-sm text-zinc-600">
                    Suggested URL: <span className="font-medium text-zinc-800">/{waSlug}</span>
                  </div>
                )}
                <div className="flex justify-end">
                  <Button
                    type="button"
                    className="btn-lg text-white font-semibold"
                    style={{ backgroundColor: 'var(--primary-red)' }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--primary-red-hover)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--primary-red)')}
                    onClick={() => setWaStage('enter')}
                  >
                    Continue
                  </Button>
                </div>
              </>
            ) : waStage === 'enter' ? (
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
                    className="w-full border-2 rounded-lg h-12 text-base px-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
                        className="w-12 h-12 text-center border-2 rounded-lg text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
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
                      ? 'bg-red-50 border-red-200 text-red-700'
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
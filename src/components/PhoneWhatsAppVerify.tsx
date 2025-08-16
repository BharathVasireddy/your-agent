'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Check, AlertCircle } from 'lucide-react';

type VerificationStage = 'enter' | 'otp' | 'verified';

export interface PhoneWhatsAppVerifyProps {
  label?: string;
  value?: string; // E.164 like +91XXXXXXXXXX
  onValueChange?: (e164: string) => void;
  onVerified?: (e164: string) => void;
  required?: boolean;
  disabled?: boolean;
}

function toE164FromLocal(localDigits: string): string {
  const digits = (localDigits || '').replace(/\D/g, '').slice(0, 10);
  return digits.length === 10 ? `+91${digits}` : '';
}

function localFromE164(e164?: string): string {
  if (!e164) return '';
  const m = e164.match(/^\+91(\d{10})$/);
  return m ? m[1] : '';
}

export default function PhoneWhatsAppVerify({
  label = 'Phone Number',
  value,
  onValueChange,
  onVerified,
  required = false,
  disabled = false,
}: PhoneWhatsAppVerifyProps) {
  const initialLocal = useMemo(() => localFromE164(value), [value]);
  const [local, setLocal] = useState<string>(initialLocal);
  const [stage, setStage] = useState<VerificationStage>('enter');
  const [otp, setOtp] = useState('');
  const [msg, setMsg] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [cooldown, setCooldown] = useState<number>(0);

  // Note: Removed automatic verification based on localStorage to ensure proper server-side validation
  // This prevents bypassing phone number conflict checks during onboarding

  // Cooldown timer for resend
  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setInterval(() => setCooldown((c) => (c > 0 ? c - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, [cooldown]);

  const e164 = useMemo(() => toE164FromLocal(local), [local]);
  const isLocalValid = useMemo(() => /^\d{10}$/.test(local) && /^[6-9]/.test(local), [local]);

  const sendOtp = async () => {
    if (!isLocalValid) {
      setMsg('Enter a valid 10-digit Indian mobile number starting with 6-9');
      return;
    }
    try {
      setSending(true);
      setMsg(null);
      setStage('enter'); // Reset stage to ensure proper flow
      const res = await fetch('/api/auth/whatsapp/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: e164 }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMsg(data.error || 'Failed to send OTP');
        return;
      }
      setStage('otp');
      setMsg('We sent a code to your WhatsApp');
      setCooldown(45);
    } catch (e) {
      setMsg('Network error. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const verifyOtp = async () => {
    if (otp.length !== 6) {
      setMsg('Enter the 6-digit code');
      return;
    }
    try {
      setVerifying(true);
      setMsg(null);
      const res = await fetch('/api/auth/whatsapp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: e164, code: otp }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMsg(data.error || 'Invalid or expired code');
        // Reset to enter stage on error to allow retry
        setStage('enter');
        setOtp('');
        return;
      }
      // Only store in localStorage if verification was successful
      try {
        localStorage.setItem('wa_phone_e164', e164);
        localStorage.setItem('wa_phone_local', local);
      } catch {}
      onValueChange?.(e164);
      onVerified?.(e164);
      setStage('verified');
      setMsg('Phone verified successfully');
    } catch (e) {
      setMsg('Network error. Please try again.');
      setStage('enter');
      setOtp('');
    } finally {
      setVerifying(false);
    }
  };

  const resetNumber = () => {
    setStage('enter');
    setOtp('');
    setMsg(null);
  };

  // Whenever local number changes, reflect to parent (as E.164 or empty) and reset verification
  useEffect(() => {
    if (stage === 'verified') return; // avoid overwriting on verified
    onValueChange?.(e164);
    // parent can interpret lack of verification
    // do not emit onVerified here
  }, [e164, onValueChange, stage]);

  return (
    <div className="space-y-2">
      <Label className="text-zinc-700">{label}{required ? ' *' : ''}</Label>
      <div className="space-y-2">
        {stage !== 'verified' && (
          <div className="flex items-center gap-2">
            <span className="pl-3 pr-2 text-sm text-zinc-700 font-medium select-none">+91</span>
            <Input
              type="tel"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={10}
              value={local}
              onChange={(e) => {
                setMsg(null);
                const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
                setLocal(digits);
                if (stage === 'otp') setStage('enter');
              }}
              placeholder="9876543210"
              disabled={disabled || sending || verifying}
              className={`flex-1 h-11 ${isLocalValid ? '' : 'ring-0'}`}
            />
            <Button type="button" variant="outline" disabled={!isLocalValid || disabled || sending} onClick={sendOtp}>
              {sending ? 'Sending…' : cooldown > 0 ? `Resend in ${cooldown}s` : 'Send OTP'}
            </Button>
          </div>
        )}

        {stage === 'otp' && (
          <div className="flex items-center gap-2">
            <Input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="Enter 6-digit code"
              disabled={disabled || verifying}
              className="h-11"
            />
            <Button type="button" className="text-white" onClick={verifyOtp} disabled={disabled || verifying || otp.length !== 6}>
              {verifying ? 'Verifying…' : 'Verify'}
            </Button>
            <Button type="button" variant="ghost" onClick={resetNumber} disabled={disabled || verifying}>Change</Button>
          </div>
        )}

        {stage === 'verified' && (
          <div className="flex items-center justify-between px-3 py-2 border border-green-200 rounded-md bg-green-50">
            <div className="flex items-center gap-2 text-green-700 text-sm">
              <Check className="w-4 h-4" />
              Verified WhatsApp: +91 {local}
            </div>
            <Button type="button" variant="ghost" onClick={resetNumber} disabled={disabled}>Change</Button>
          </div>
        )}

        {msg && (
          <div className={`mt-3 p-4 rounded-lg border flex items-start gap-3 ${
            msg.toLowerCase().includes('verified') || msg.toLowerCase().includes('sent') 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : msg.toLowerCase().includes('error') || msg.toLowerCase().includes('invalid') || msg.toLowerCase().includes('fail') || msg.toLowerCase().includes('already registered') || msg.toLowerCase().includes('conflict')
              ? 'bg-red-50 border-red-200 text-red-800'
              : 'bg-blue-50 border-blue-200 text-blue-800'
          }`}>
            <div className="flex-shrink-0 mt-0.5">
              {msg.toLowerCase().includes('verified') || msg.toLowerCase().includes('sent') ? (
                <Check className="w-5 h-5 text-green-600" />
              ) : msg.toLowerCase().includes('error') || msg.toLowerCase().includes('invalid') || msg.toLowerCase().includes('fail') || msg.toLowerCase().includes('already registered') || msg.toLowerCase().includes('conflict') ? (
                <AlertCircle className="w-5 h-5 text-red-600" />
              ) : (
                <AlertCircle className="w-5 h-5 text-blue-600" />
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium leading-relaxed">{msg}</p>
              {msg.toLowerCase().includes('already registered') && (
                <p className="text-xs mt-2 opacity-90">
                  💡 Try signing in with your existing account or contact support if this is your number.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}



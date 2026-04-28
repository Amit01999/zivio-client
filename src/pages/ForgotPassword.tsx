import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Loader2, Mail, KeyRound, Lock, CheckCircle, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { API_URL } from '@/lib/api';

type Step = 'email' | 'otp' | 'password' | 'done';

export default function ForgotPassword() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [step, setStep] = useState<Step>('email');
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const post = async (path: string, body: object) => {
    const res = await fetch(`${API_URL}/api/auth${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Something went wrong');
    return data;
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      await post('/forgot-password', { email: email.trim() });
      setStep('otp');
      toast({ title: 'OTP sent', description: 'Check your email for the 6-digit code.' });
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.trim().length !== 6) return;
    setLoading(true);
    try {
      const data = await post('/verify-otp', { email: email.trim(), otp: otp.trim() });
      setResetToken(data.resetToken);
      setStep('password');
    } catch (err: any) {
      toast({ title: 'Invalid OTP', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      toast({ title: 'Password too short', description: 'Minimum 8 characters.', variant: 'destructive' });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({ title: 'Passwords do not match', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      await post('/reset-password', { resetToken, newPassword });
      setStep('done');
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const stepLabels: Record<Step, { title: string; description: string; icon: React.ReactNode }> = {
    email: {
      title: 'Forgot Password',
      description: 'Enter your account email and we\'ll send you a 6-digit OTP.',
      icon: <Mail className="h-8 w-8 text-primary" />,
    },
    otp: {
      title: 'Enter OTP',
      description: `We sent a 6-digit code to ${email}. It expires in 5 minutes.`,
      icon: <KeyRound className="h-8 w-8 text-primary" />,
    },
    password: {
      title: 'Set New Password',
      description: 'Choose a strong password for your account.',
      icon: <Lock className="h-8 w-8 text-primary" />,
    },
    done: {
      title: 'Password Updated',
      description: 'Your password has been reset successfully.',
      icon: <CheckCircle className="h-8 w-8 text-green-500" />,
    },
  };

  const current = stepLabels[step];

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center space-y-3 pb-4">
            {/* Step progress dots */}
            <div className="flex justify-center gap-2 mb-2">
              {(['email', 'otp', 'password', 'done'] as Step[]).map((s, i) => (
                <div
                  key={s}
                  className={`h-2 rounded-full transition-all ${
                    s === step
                      ? 'w-6 bg-primary'
                      : i < (['email', 'otp', 'password', 'done'] as Step[]).indexOf(step)
                      ? 'w-2 bg-primary/60'
                      : 'w-2 bg-muted-foreground/20'
                  }`}
                />
              ))}
            </div>

            <div className="flex justify-center">{current.icon}</div>
            <CardTitle className="text-2xl">{current.title}</CardTitle>
            <CardDescription className="text-sm">{current.description}</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Step 1: Email */}
            {step === 'email' && (
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="pl-9"
                      required
                      autoFocus
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={loading || !email.trim()}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Send OTP
                </Button>
              </form>
            )}

            {/* Step 2: OTP */}
            {step === 'otp' && (
              <form onSubmit={handleOtpSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="otp">6-digit OTP</Label>
                  <Input
                    id="otp"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]{6}"
                    maxLength={6}
                    placeholder="123456"
                    value={otp}
                    onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                    className="text-center text-2xl tracking-[0.5em] font-mono"
                    required
                    autoFocus
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading || otp.trim().length !== 6}
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Verify OTP
                </Button>
                <button
                  type="button"
                  className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => { setStep('email'); setOtp(''); }}
                >
                  Wrong email? Go back
                </button>
              </form>
            )}

            {/* Step 3: New Password */}
            {step === 'password' && (
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="new-password">New password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="new-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Min. 8 characters"
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      className="pl-9 pr-9"
                      required
                      autoFocus
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowPassword(v => !v)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="confirm-password">Confirm password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirm-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Repeat password"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      className="pl-9"
                      required
                    />
                  </div>
                </div>
                {newPassword && confirmPassword && newPassword !== confirmPassword && (
                  <p className="text-xs text-destructive">Passwords do not match</p>
                )}
                <Button
                  type="submit"
                  className="w-full"
                  disabled={
                    loading ||
                    newPassword.length < 8 ||
                    newPassword !== confirmPassword
                  }
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Reset Password
                </Button>
              </form>
            )}

            {/* Step 4: Done */}
            {step === 'done' && (
              <div className="space-y-4 text-center">
                <p className="text-sm text-muted-foreground">
                  You can now log in with your new password.
                </p>
                <Button className="w-full" onClick={() => setLocation('/login')}>
                  Go to Login
                </Button>
              </div>
            )}

            {step !== 'done' && (
              <div className="text-center pt-2">
                <Link href="/login">
                  <button className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Back to Login
                  </button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

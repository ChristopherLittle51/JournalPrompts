import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Sparkles, Mail, Loader2, KeyRound } from 'lucide-react';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const { signInWithEmail, verifyOtp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    setMessage(null);

    try {
      if (showOtpInput) {
        // Verify OTP
        const { error } = await verifyOtp(email, otp);
        if (error) throw error;
        // Success handled by AuthContext state change
      } else {
        // Send OTP
        const { error } = await signInWithEmail(email);
        if (error) throw error;
        setShowOtpInput(true);
        setMessage({ type: 'success', text: 'Check your email for the login code!' });
      }
    } catch (err: unknown) {
      let errorMessage = 'Authentication failed';
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'object' && err !== null && 'message' in err) {
        errorMessage = String((err as { message: unknown }).message); // Fallback for various error-like objects
      }
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFBF5] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-stone-100">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-4 text-amber-700">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="text-3xl serif-font text-stone-800 text-center">Reflect & Reset</h1>
          <p className="text-stone-500 mt-2 text-center">Your personal space for daily clarity</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-stone-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all bg-stone-50"
                required
                disabled={showOtpInput}
              />
              <Mail className="absolute left-3 top-3.5 w-5 h-5 text-stone-400" />
            </div>
          </div>

          {showOtpInput && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              <label htmlFor="otp" className="block text-sm font-medium text-stone-700 mb-1">
                Login Code
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Code from email"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-stone-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all bg-stone-50"
                  required
                  autoFocus
                />
                <KeyRound className="absolute left-3 top-3.5 w-5 h-5 text-stone-400" />
              </div>
            </div>
          )}

          {message && (
            <div className={`p-4 rounded-lg text-sm ${
              message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}>
              {message.text}
            </div>
          )}

          <div className="space-y-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-stone-800 text-white py-3 rounded-lg font-medium hover:bg-stone-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{showOtpInput ? 'Verifying...' : 'Sending Code...'}</span>
                </>
              ) : (
                <span>{showOtpInput ? 'Verify Code' : 'Sign In with Email'}</span>
              )}
            </button>
            
            {showOtpInput && (
              <button
                type="button"
                onClick={() => {
                  setShowOtpInput(false);
                  setMessage(null);
                  setOtp('');
                }}
                className="w-full text-stone-500 text-sm hover:text-stone-800 transition-colors"
              >
                Use a different email
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

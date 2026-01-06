import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Sparkles, Mail, Loader2 } from 'lucide-react';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const { signInWithEmail } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    setMessage(null);

    try {
      const { error } = await signInWithEmail(email);
      if (error) throw error;
      setMessage({ type: 'success', text: 'Check your email for the login link!' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to send login link' });
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
              />
              <Mail className="absolute left-3 top-3.5 w-5 h-5 text-stone-400" />
            </div>
          </div>

          {message && (
            <div className={`p-4 rounded-lg text-sm ${
              message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}>
              {message.text}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-stone-800 text-white py-3 rounded-lg font-medium hover:bg-stone-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Sending Link...</span>
              </>
            ) : (
              <span>Sign In with Email</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

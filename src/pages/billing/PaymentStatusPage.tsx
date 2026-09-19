import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircle2, XCircle, Clock, ArrowRight, RefreshCcw } from 'lucide-react';
import { KYJLogo } from '@/components/ui/KYJLogo';

export const PaymentStatusPage: React.FC = () => {
  const location = useLocation();
  const path = location.pathname;

  let status: 'success' | 'failed' | 'pending' = 'success';
  if (path.includes('failed')) status = 'failed';
  else if (path.includes('pending')) status = 'pending';

  return (
    <div className="min-h-screen bg-[#000000] text-slate-100 flex flex-col justify-center items-center px-4 relative overflow-x-hidden selection:bg-amber-400 selection:text-black">
      {/* Ambient background glow orbs matching Homepage */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[850px] h-[360px] bg-gradient-to-b from-amber-500/15 via-yellow-500/5 to-transparent blur-[140px] rounded-full pointer-events-none z-0" />
      <div className="fixed top-1/3 right-[-10%] w-96 h-96 bg-amber-600/10 blur-[130px] rounded-full pointer-events-none z-0" />
      <div className="fixed bottom-10 left-[-10%] w-96 h-96 bg-yellow-500/10 blur-[140px] rounded-full pointer-events-none z-0" />

      <div className="w-full max-w-md text-center relative z-10">
        <Link to="/" className="inline-flex items-center gap-2 mb-8 group">
          <KYJLogo size={36} glow className="group-hover:scale-105 transition-transform" />
          <span className="text-xl font-bold text-white">KnowYour<span className="text-gradient-gold">Job</span></span>
        </Link>

        <div className="liquid-glass-elevated p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
          {status === 'success' && (
            <div>
              <CheckCircle2 size={52} className="text-emerald-400 mx-auto mb-4 drop-shadow-[0_0_15px_rgba(52,211,153,0.4)]" />
              <h1 className="text-2xl font-bold text-white">Payment <span className="text-gradient-emerald">Confirmed!</span></h1>
              <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                Thank you for upgrading your KnowYourJob account. Your Pro quota has been activated and your invoice has been sent to your registered email.
              </p>
              <Link
                to="/dashboard"
                className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 btn-yellow-gradient text-black text-xs font-bold rounded-xl transition shadow-[0_0_20px_rgba(245,158,11,0.35)]"
              >
                Go to Dashboard <ArrowRight size={14} className="text-black" />
              </Link>
            </div>
          )}

          {status === 'failed' && (
            <div>
              <XCircle size={52} className="text-rose-400 mx-auto mb-4 drop-shadow-[0_0_15px_rgba(244,63,94,0.4)]" />
              <h1 className="text-2xl font-bold text-white">Payment <span className="text-gradient-rose">Incomplete</span></h1>
              <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                Your bank or payment gateway did not complete the transaction. No funds were debited. You may retry with another card or UPI option.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  to="/dashboard/billing"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 btn-yellow-gradient text-black text-xs font-bold rounded-xl transition shadow-[0_0_20px_rgba(245,158,11,0.35)]"
                >
                  <RefreshCcw size={14} className="text-black" /> Retry Payment
                </Link>
                <Link
                  to="/support"
                  className="inline-flex items-center justify-center px-5 py-2.5 btn-glass text-white text-xs font-medium rounded-xl transition"
                >
                  Contact Support
                </Link>
              </div>
            </div>
          )}

          {status === 'pending' && (
            <div>
              <Clock size={52} className="text-amber-400 mx-auto mb-4 animate-pulse drop-shadow-[0_0_15px_rgba(245,158,11,0.4)]" />
              <h1 className="text-2xl font-bold text-white">Payment <span className="text-gradient-gold">Processing</span></h1>
              <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                Your payment is currently being confirmed by your banking institution. Once confirmed, your subscription will update automatically.
              </p>
              <Link
                to="/dashboard/billing"
                className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 btn-glass text-white text-xs font-medium rounded-xl transition"
              >
                Check Billing Status
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentStatusPage;

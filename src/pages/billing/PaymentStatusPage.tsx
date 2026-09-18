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
    <div className="min-h-screen bg-[#000000] text-slate-100 flex flex-col justify-center items-center px-4 selection:bg-amber-500/30 selection:text-amber-200">
      <div className="w-full max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2 mb-8">
          <KYJLogo size={36} glow />
          <span className="text-xl font-bold text-white">KnowYourJob</span>
        </Link>

        <div className="liquid-glass-elevated p-8 rounded-2xl border border-white/10 shadow-2xl">
          {status === 'success' && (
            <div>
              <CheckCircle2 size={52} className="text-emerald-400 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-white">Payment Confirmed!</h1>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Thank you for upgrading your KnowYourJob account. Your Pro quota has been activated and your invoice has been sent to your registered email.
              </p>
              <Link
                to="/dashboard"
                className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold rounded-xl transition"
              >
                Go to Dashboard <ArrowRight size={14} />
              </Link>
            </div>
          )}

          {status === 'failed' && (
            <div>
              <XCircle size={52} className="text-rose-400 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-white">Payment Incomplete</h1>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Your bank or payment gateway did not complete the transaction. No funds were debited. You may retry with another card or UPI option.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  to="/dashboard/billing"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold rounded-xl transition"
                >
                  <RefreshCcw size={14} /> Retry Payment
                </Link>
                <Link
                  to="/support"
                  className="inline-flex items-center justify-center px-4 py-2.5 bg-white/10 hover:bg-white/15 text-white text-xs font-medium rounded-xl transition"
                >
                  Contact Support
                </Link>
              </div>
            </div>
          )}

          {status === 'pending' && (
            <div>
              <Clock size={52} className="text-amber-400 mx-auto mb-4 animate-pulse" />
              <h1 className="text-2xl font-bold text-white">Payment Processing</h1>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Your payment is currently being confirmed by your banking institution. Once confirmed, your subscription will update automatically.
              </p>
              <Link
                to="/dashboard/billing"
                className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/15 text-white text-xs font-medium rounded-xl transition"
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

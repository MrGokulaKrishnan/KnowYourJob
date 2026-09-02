import React from 'react';
import { CreditCard, Check, Sparkles, Zap } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { LiquidButton } from '../../components/ui/LiquidButton';
import { useToast } from '../../context/ToastContext';

export const BillingPage: React.FC = () => {
  const { showToast } = useToast();

  const plans = [
    {
      name: 'Starter Candidate',
      price: 'Free',
      description: 'Standard discovery and manual tracking.',
      features: [
        '5 manual applications / day',
        'Basic ATS resume review',
        'Public job feed access',
        'Standard email notifications',
      ],
      current: true,
    },
    {
      name: 'Pro Autonomous',
      price: '$29 / month',
      description: 'AI auto-tailoring and assisted autonomous job applications.',
      features: [
        'Up to 30 assisted applications / day',
        'Deep LLM ATS optimization',
        'Priority interview scheduling alerts',
        'Custom domain cover letters',
        'Direct recruiter contact discovery',
      ],
      featured: true,
      current: false,
    },
    {
      name: 'Executive Elite',
      price: '$79 / month',
      description: 'Complete hands-off career executive suite.',
      features: [
        'Unlimited autonomous submissions',
        'Dedicated talent advocate review',
        'Salary negotiation AI playbook',
        'Direct referral network introductions',
      ],
      current: false,
    },
  ];

  return (
    <DashboardLayout
      pageTitle="Subscription & Billing"
      pageSubtitle="Flexible tiers backed by secure payment systems."
    >
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {plans.map((p, idx) => (
            <div
              key={idx}
              className={`rounded-2xl p-6 flex flex-col justify-between ${
                p.featured
                  ? 'liquid-glass-elevated border-2 border-amber-500/40 shadow-gold-glow'
                  : 'liquid-glass border border-white/5'
              }`}
            >
              <div>
                {p.featured && (
                  <span className="inline-flex items-center gap-1 text-[10px] uppercase font-mono px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 mb-3">
                    <Sparkles className="w-3 h-3" />
                    <span>Most Popular</span>
                  </span>
                )}
                <h3 className="text-lg font-bold text-white">{p.name}</h3>
                <div className="text-2xl font-bold text-amber-400 font-mono mt-2">{p.price}</div>
                <p className="text-xs text-slate-400 mt-1">{p.description}</p>

                <div className="mt-6 space-y-2.5 border-t border-white/5 pt-4">
                  {p.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-2 text-xs text-slate-300">
                      <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8">
                {p.current ? (
                  <button
                    disabled
                    className="w-full py-2.5 rounded-xl text-xs font-semibold text-slate-400 bg-white/5 border border-white/10 cursor-default"
                  >
                    Current Active Tier
                  </button>
                ) : (
                  <LiquidButton
                    variant={p.featured ? 'yellow' : 'glass'}
                    className="w-full text-xs"
                    onClick={() => showToast('Subscription gateway ready.', 'info')}
                  >
                    Upgrade Plan
                  </LiquidButton>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

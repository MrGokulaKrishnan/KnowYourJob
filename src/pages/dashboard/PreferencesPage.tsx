import React, { useEffect, useState } from 'react';
import { Sliders, Save, Plus, X, DollarSign } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { GlassInput } from '../../components/ui/GlassInput';
import { LiquidButton } from '../../components/ui/LiquidButton';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../context/ToastContext';
import { profileService } from '../../services/firebase/profileService';

export const PreferencesPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [roles, setRoles] = useState<string[]>([]);
  const [newRole, setNewRole] = useState('');
  const [locations, setLocations] = useState<string[]>([]);
  const [newLocation, setNewLocation] = useState('');
  const [remoteType, setRemoteType] = useState<'remote' | 'hybrid' | 'onsite' | 'any'>('remote');
  const [minimumSalary, setMinimumSalary] = useState<number>(150000);

  useEffect(() => {
    const fetchPrefs = async () => {
      if (!user) return;
      try {
        const p = await profileService.getProfile(user.uid);
        if (p?.preferences) {
          setRoles(p.preferences.roles || []);
          setLocations(p.preferences.locations || []);
          setRemoteType(p.preferences.remoteType || 'remote');
          setMinimumSalary(p.preferences.minimumSalary || 140000);
        }
      } catch (err) {
        console.warn('Preferences load error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrefs();
  }, [user]);

  const handleAddRole = () => {
    if (newRole.trim() && !roles.includes(newRole.trim())) {
      setRoles([...roles, newRole.trim()]);
      setNewRole('');
    }
  };

  const handleAddLocation = () => {
    if (newLocation.trim() && !locations.includes(newLocation.trim())) {
      setLocations([...locations, newLocation.trim()]);
      setNewLocation('');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSaving(true);
    try {
      await profileService.updateProfile(user.uid, {
        preferences: {
          roles,
          locations,
          remoteType,
          minimumSalary: Number(minimumSalary),
          employmentTypes: ['full-time'],
        },
      });
      showToast('Career preferences saved successfully!', 'success');
    } catch {
      showToast('Failed to save preferences.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <DashboardLayout
      pageTitle="Career Preferences"
      pageSubtitle="Defines criteria for autonomous search filters and recommendation scoring."
    >
      {isLoading ? (
        <LoadingSpinner label="Loading preferences..." />
      ) : (
        <form onSubmit={handleSave} className="flex flex-col gap-6 max-w-3xl">
          <div className="liquid-glass rounded-2xl p-6 border border-white/5 flex flex-col gap-5">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sliders className="w-5 h-5 text-amber-400" />
              <span>Target Role Types</span>
            </h3>

            <div className="flex gap-2">
              <input
                type="text"
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddRole())}
                placeholder="e.g. Staff Full-Stack Engineer"
                className="flex-1 rounded-xl bg-slate-900/60 border border-white/10 px-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
              <LiquidButton type="button" variant="glass" onClick={handleAddRole} leftIcon={<Plus className="w-4 h-4" />}>
                Add
              </LiquidButton>
            </div>

            <div className="flex flex-wrap gap-2">
              {roles.map((r) => (
                <span
                  key={r}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs font-medium text-amber-300"
                >
                  {r}
                  <button type="button" onClick={() => setRoles(roles.filter((x) => x !== r))} className="hover:text-amber-100">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="liquid-glass rounded-2xl p-6 border border-white/5 flex flex-col gap-5">
            <h3 className="text-base font-bold text-white">Work Location & Flexibility</h3>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium uppercase text-slate-300">Remote Setting</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['remote', 'hybrid', 'onsite', 'any'] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setRemoteType(mode)}
                    className={`px-3 py-2 rounded-xl text-xs font-medium uppercase tracking-wider border transition-all ${
                      remoteType === mode
                        ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.25)]'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium uppercase text-slate-300">Desired Geographies</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddLocation())}
                  placeholder="e.g. Seattle, WA"
                  className="flex-1 rounded-xl bg-slate-900/60 border border-white/10 px-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
                <LiquidButton type="button" variant="glass" onClick={handleAddLocation} leftIcon={<Plus className="w-4 h-4" />}>
                  Add
                </LiquidButton>
              </div>

              <div className="flex flex-wrap gap-2">
                {locations.map((loc) => (
                  <span
                    key={loc}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-medium text-slate-300"
                  >
                    {loc}
                    <button type="button" onClick={() => setLocations(locations.filter((x) => x !== loc))} className="hover:text-rose-400">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <GlassInput
              label="Minimum Target Salary (USD / Year)"
              type="number"
              step="5000"
              value={minimumSalary}
              onChange={(e) => setMinimumSalary(Number(e.target.value))}
              leftIcon={<DollarSign className="w-4 h-4" />}
            />
          </div>

          <div className="flex justify-end">
            <LiquidButton
              type="submit"
              variant="yellow"
              isLoading={isSaving}
              leftIcon={<Save className="w-4 h-4" />}
            >
              Save Preferences
            </LiquidButton>
          </div>
        </form>
      )}
    </DashboardLayout>
  );
};

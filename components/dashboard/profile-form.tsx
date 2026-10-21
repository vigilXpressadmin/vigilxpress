'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  User,
  Mail,
  Phone,
  Shield,
  Save,
  Loader2,
  ExternalLink,
  Store,
  Bike,
  CheckCircle2,
  MapPin,
  LogIn,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/components/ui/toast';
import { type DashboardRole } from '@/lib/dashboard/menu';

interface ProfileFormProps {
  role: 'merchant' | 'rider' | 'admin';
}

export function ProfileForm({ role }: ProfileFormProps) {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');

  useEffect(() => {
    let isMounted = true;
    async function loadUser() {
      try {
        setLoading(true);
        const supabase = createClient();
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          if (isMounted) {
            setUserId(null);
            setLoading(false);
          }
          return;
        }

        if (isMounted) {
          setUserId(user.id);
          setEmail(user.email || '');
          // Prefill name from user metadata if present
          const metaName =
            (user.user_metadata?.full_name as string) ||
            (user.user_metadata?.name as string) ||
            '';
          setFullName(metaName);
        }

        // Fetch profile record from public.profiles
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, phone')
          .eq('id', user.id)
          .maybeSingle();

        if (isMounted && profile) {
          if (profile.full_name) setFullName(profile.full_name);
          if (profile.phone) setPhone(profile.phone);
        }
      } catch (err: unknown) {
        console.error('Error fetching user profile:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadUser();
    return () => {
      isMounted = false;
    };
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!userId) return;

    try {
      setSaving(true);
      const supabase = createClient();

      // Only editable columns in public.profiles: full_name and phone
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName.trim(),
          phone: phone.trim(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (error) {
        throw error;
      }

      showToast('Profile updated successfully', 'success');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update profile';
      showToast(msg, 'error');
    } finally {
      setSaving(false);
    }
  }

  // Graceful loading state
  if (loading) {
    return (
      <div className="card p-12 text-center space-y-4 max-w-2xl mx-auto">
        <Loader2 className="w-8 h-8 animate-spin text-brand-500 mx-auto" />
        <p className="text-sm text-neutral-500">Loading account profile…</p>
      </div>
    );
  }

  // Graceful unauthenticated state
  if (!userId) {
    return (
      <div className="card p-10 text-center space-y-5 max-w-md mx-auto">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 grid place-items-center mx-auto">
          <User size={24} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-ink">Sign in required</h2>
          <p className="mt-1 text-xs text-neutral-500">
            Please log in with your account credentials to view and manage your profile details.
          </p>
        </div>
        <Link
          href="/login"
          className="btn-primary !py-2.5 !px-5 text-xs inline-flex items-center gap-2 mx-auto no-underline"
        >
          <LogIn size={15} />
          <span>Go to Login</span>
        </Link>
      </div>
    );
  }

  const initial = (fullName.trim() || email || role).charAt(0).toUpperCase();

  const roleLabels: Record<string, string> = {
    merchant: 'Merchant Partner',
    rider: 'Delivery Rider',
    admin: 'Platform Super Admin',
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
          Account Profile
        </h1>
        <p className="mt-1 text-sm text-neutral-600">
          Manage your identity credentials, contact information, and role operations.
        </p>
      </div>

      {/* Profile Header Card */}
      <div className="card p-6 flex flex-col sm:flex-row items-center sm:items-start gap-5">
        {/* Avatar circle with user initial (orange brand-500 circle) */}
        <div className="w-20 h-20 rounded-full bg-brand-500 text-ink font-extrabold text-3xl grid place-items-center shadow-lg border-2 border-white/20 flex-none">
          {initial}
        </div>

        <div className="space-y-2 text-center sm:text-left flex-1 min-w-0">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
            <h2 className="text-xl font-bold text-ink truncate">
              {fullName.trim() || 'User Profile'}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-200 capitalize">
              {roleLabels[role] || role}
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-neutral-500">
            {email && (
              <span className="flex items-center gap-1.5">
                <Mail size={14} className="text-neutral-400" />
                {email}
              </span>
            )}
            {phone && (
              <span className="flex items-center gap-1.5">
                <Phone size={14} className="text-neutral-400" />
                {phone}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Role-Specific Operational Card */}
      {role === 'rider' && (
        <div className="card p-6 space-y-4 border-l-4 border-l-brand-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-500 grid place-items-center">
                <Bike size={20} />
              </div>
              <div>
                <h3 className="font-bold text-ink text-base">Rider Shift & Operations</h3>
                <p className="text-xs text-neutral-500">Delivery fleet standing and dispatched earnings</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-ok/10 text-ok border border-ok/20">
              <span className="w-1.5 h-1.5 rounded-full bg-ok animate-pulse" />
              Verified Fleet
            </span>
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-line text-xs">
            <span className="text-neutral-600">Track your completed delivery fees and ledger payouts</span>
            <Link
              href="/rider/earnings"
              className="font-semibold text-brand-600 hover:text-brand-700 inline-flex items-center gap-1 no-underline"
            >
              <span>View Earnings & Payouts</span>
              <ExternalLink size={13} />
            </Link>
          </div>
        </div>
      )}

      {role === 'merchant' && (
        <div className="card p-6 space-y-4 border-l-4 border-l-brand-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-500 grid place-items-center">
                <Store size={20} />
              </div>
              <div>
                <h3 className="font-bold text-ink text-base">Merchant Store Status</h3>
                <p className="text-xs text-neutral-500">Partner store onboarding and operational parameters</p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-ok/10 text-ok border border-ok/20">
              Active Store
            </span>
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-line text-xs">
            <span className="text-neutral-600">Review restaurant configuration, menu hours, and bank details</span>
            <Link
              href="/merchant/settings"
              className="font-semibold text-brand-600 hover:text-brand-700 inline-flex items-center gap-1 no-underline"
            >
              <span>Manage Store Settings</span>
              <ExternalLink size={13} />
            </Link>
          </div>
        </div>
      )}

      {role === 'admin' && (
        <div className="card p-6 space-y-4 border-l-4 border-l-brand-500">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-500 grid place-items-center">
              <Shield size={20} />
            </div>
            <div>
              <h3 className="font-bold text-ink text-base">Administrative Governance</h3>
              <p className="text-xs text-neutral-500">Quick management links for platform administrators</p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 pt-2 border-t border-line">
            <Link
              href="/admin/approvals"
              className="p-3 rounded-xl border border-line bg-soft/40 hover:bg-white hover:shadow-sm transition-all flex items-center justify-between text-xs text-ink no-underline group"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-brand-500" />
                <span className="font-medium">Partner Approvals</span>
              </div>
              <ExternalLink size={13} className="text-neutral-400 group-hover:text-brand-500" />
            </Link>

            <Link
              href="/admin/service-areas"
              className="p-3 rounded-xl border border-line bg-soft/40 hover:bg-white hover:shadow-sm transition-all flex items-center justify-between text-xs text-ink no-underline group"
            >
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-sky-600" />
                <span className="font-medium">Service Areas & Geofences</span>
              </div>
              <ExternalLink size={13} className="text-neutral-400 group-hover:text-sky-600" />
            </Link>
          </div>
        </div>
      )}

      {/* Editable Fields Form */}
      <div className="card p-6 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-line">
          <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-500 grid place-items-center">
            <User size={20} />
          </div>
          <div>
            <h2 className="font-bold text-ink">Personal Information</h2>
            <p className="text-xs text-neutral-500">
              Only verified profile columns (<code>full_name</code>, <code>phone</code>) are editable directly.
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label block text-xs font-semibold text-neutral-700 mb-1.5">
                Full Name <span className="text-brand-600">*</span>
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Adebayo Ogunlesi"
                className="input"
              />
            </div>

            <div>
              <label className="label block text-xs font-semibold text-neutral-700 mb-1.5">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +234 801 234 5678"
                className="input"
              />
            </div>

            <div>
              <label className="label block text-xs font-semibold text-neutral-700 mb-1.5">
                Email Address <span className="text-neutral-400 font-normal">(Read-only)</span>
              </label>
              <input
                type="email"
                disabled
                value={email}
                className="input bg-neutral-100/70 text-neutral-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="label block text-xs font-semibold text-neutral-700 mb-1.5">
                Platform Role <span className="text-neutral-400 font-normal">(Read-only)</span>
              </label>
              <input
                type="text"
                disabled
                value={roleLabels[role] || role}
                className="input bg-neutral-100/70 text-neutral-500 cursor-not-allowed capitalize"
              />
            </div>
          </div>

          <div className="flex items-center justify-end pt-4 border-t border-line">
            <button
              type="submit"
              disabled={saving}
              className="btn-primary !py-2.5 !px-5 text-xs flex items-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  <span>Saving…</span>
                </>
              ) : (
                <>
                  <Save size={15} />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import { Star, MessageSquare, ThumbsUp } from 'lucide-react';
import { StatCard } from '@/components/dashboard/stat-card';

export default function MerchantReviewsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
          Customer Reviews & Ratings
        </h1>
        <p className="mt-1 text-sm text-neutral-600">
          Monitor dining feedback, meal ratings, and customer impressions for your store.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          icon={Star}
          label="Average Rating"
          value="0.0"
          caption="Out of 5.0 stars"
        />
        <StatCard
          icon={MessageSquare}
          label="Total Reviews"
          value="0"
          caption="Verified order feedback"
        />
        <StatCard
          icon={ThumbsUp}
          label="Positive Sentiment"
          value="100%"
          caption="Customer satisfaction"
        />
      </div>

      <div className="card p-8 text-center space-y-4 max-w-xl mx-auto">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 grid place-items-center mx-auto">
          <Star size={24} />
        </div>
        <div>
          <h2 className="text-base font-bold text-ink">No customer reviews yet</h2>
          <p className="mt-1 text-xs text-neutral-500 max-w-sm mx-auto">
            When customers place orders and receive delivery in Abeokuta, their ratings and culinary feedback will appear here in real time.
          </p>
        </div>
      </div>
    </div>
  );
}

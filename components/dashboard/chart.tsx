'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import type { ApexOptions } from 'apexcharts';
import { BarChart3 } from 'lucide-react';

import { LiquidWaveSpinner } from '@/components/ui/spinner-10';

const ApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
  loading: () => (
    <div className="h-[300px] w-full flex flex-col items-center justify-center bg-soft/50 rounded-xl">
      <LiquidWaveSpinner size="sm" words={['Loading chart…']} />
    </div>
  ),
});

export interface ChartSeries {
  name: string;
  type?: 'column' | 'line' | 'area' | 'bar';
  data: number[];
}

interface DashboardChartProps {
  options: ApexOptions;
  series: ChartSeries[];
  type?: 'line' | 'bar' | 'area';
  height?: number | string;
  title?: string;
  subtitle?: string;
  emptyText?: string;
  className?: string;
}

export function DashboardChart({
  options,
  series,
  type = 'line',
  height = 300,
  title,
  subtitle,
  emptyText = 'No transaction or activity data recorded yet.',
  className = '',
}: DashboardChartProps) {
  // Check if series has any meaningful non-zero numbers
  const hasData =
    series.length > 0 &&
    series.some(
      (s) => Array.isArray(s.data) && s.data.length > 0 && s.data.some((val) => val > 0)
    );

  return (
    <div className={`card p-6 ${className}`}>
      {(title || subtitle) && (
        <div className="mb-4">
          {title && <h2 className="text-base font-bold text-ink">{title}</h2>}
          {subtitle && (
            <p className="text-xs text-neutral-500 mt-0.5">{subtitle}</p>
          )}
        </div>
      )}

      {!hasData ? (
        <div
          style={{ height: typeof height === 'number' ? `${height}px` : height }}
          className="flex flex-col items-center justify-center rounded-xl bg-soft/50 border border-dashed border-line text-neutral-400 p-6"
        >
          <div className="w-12 h-12 rounded-xl bg-brand-500/10 text-brand-500 grid place-items-center mb-3">
            <BarChart3 size={24} />
          </div>
          <p className="text-sm font-bold text-neutral-700">No data yet</p>
          <p className="text-xs text-neutral-500 mt-1 text-center max-w-xs">
            {emptyText}
          </p>
        </div>
      ) : (
        <div className="w-full">
          <ApexChart
            options={options}
            series={series}
            type={type}
            height={height}
            width="100%"
          />
        </div>
      )}
    </div>
  );
}

export default DashboardChart;

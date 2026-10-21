import type { ApexOptions } from 'apexcharts';

export interface ChartSeriesItem {
  name: string;
  type?: 'column' | 'line' | 'area' | 'bar';
  data: number[];
}

export function getSalesAccountChartOptions(
  categories: string[] = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ]
): ApexOptions {
  return {
    chart: {
      type: 'line',
      background: 'transparent',
      toolbar: {
        show: false,
      },
      fontFamily: 'inherit',
      animations: {
        enabled: true,
        speed: 300,
        animateGradually: {
          enabled: true,
          delay: 150,
        },
      },
    },
    stroke: {
      width: [0, 3],
      curve: 'smooth',
    },
    plotOptions: {
      bar: {
        columnWidth: '45%',
        borderRadius: 4,
      },
    },
    colors: ['#FF6B1A', '#FFD0A3'],
    fill: {
      opacity: [0.9, 1],
    },
    labels: categories,
    markers: {
      size: 3,
      strokeColors: '#ffffff',
      strokeWidth: 2,
    },
    yaxis: {
      min: 0,
      labels: {
        style: {
          colors: '#6B6B6B',
          fontSize: '11px',
        },
      },
    },
    xaxis: {
      labels: {
        style: {
          colors: '#6B6B6B',
          fontSize: '11px',
        },
      },
      axisBorder: {
        color: '#E7E7E4',
      },
      axisTicks: {
        color: '#E7E7E4',
      },
    },
    grid: {
      strokeDashArray: 3,
      borderColor: '#E7E7E4',
    },
    tooltip: {
      shared: true,
      intersect: false,
      theme: 'light',
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      labels: {
        colors: '#171717',
      },
      markers: {
        size: 5,
      },
    },
    theme: {
      mode: 'light',
    },
  };
}

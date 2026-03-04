/**
 * RegionPerformance
 * Bar chart showing the average on-time rate per TGV network region.
 */

import React from 'react';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';
import type { TGVData } from '../types/tgv.types';

interface RegionPerformanceProps {
  /** Full dataset used to compute per-region averages. */
  data: TGVData[];
}

/** Intermediate shape used to accumulate punctuality values per region. */
interface RegionBucket {
  sum: number;
  count: number;
}

const RegionPerformance: React.FC<RegionPerformanceProps> = ({ data }) => {
  if (!data.length) return null;

  // Aggregate punctuality totals by region
  const buckets = data.reduce<Record<string, RegionBucket>>((acc, item) => {
    if (!acc[item.region]) acc[item.region] = { sum: 0, count: 0 };
    acc[item.region].sum += item.ponctualite;
    acc[item.region].count += 1;
    return acc;
  }, {});

  const regions = Object.keys(buckets);
  const ponctualiteValues = regions.map((r) => (buckets[r].sum / buckets[r].count).toFixed(2));

  const option: EChartsOption = {
    title: { text: 'Performance par Region', left: 'center' },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: '{b}<br/>Ponctualite: {c}%',
    },
    xAxis: {
      type: 'category',
      data: regions,
      axisLabel: { rotate: 30 },
    },
    yAxis: { type: 'value', name: 'Ponctualite (%)', min: 70, max: 100 },
    series: [
      {
        data: ponctualiteValues,
        type: 'bar',
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: '#5470C6' },
              { offset: 1, color: '#91CC75' },
            ],
          },
        },
        label: { show: true, position: 'top', formatter: '{c}%' },
      },
    ],
    grid: { left: '3%', right: '4%', bottom: '10%', containLabel: true },
  };

  return <ReactECharts option={option} style={{ height: '400px' }} />;
};

export default RegionPerformance;

/**
 * PonctualiteEvolution
 * Line chart showing the monthly average on-time rate over time.
 */

import React from 'react';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';
import type { TGVData } from '../types/tgv.types';

interface PonctualiteEvolutionProps {
  /** Full dataset used to compute monthly averages. */
  data: TGVData[];
}

/** Intermediate shape used to accumulate punctuality values per date bucket. */
interface DateBucket {
  sum: number;
  count: number;
}

const PonctualiteEvolution: React.FC<PonctualiteEvolutionProps> = ({ data }) => {
  if (!data.length) return null;

  // Group records by month and compute average punctuality per month
  const buckets = data.reduce<Record<string, DateBucket>>((acc, item) => {
    if (!acc[item.date]) acc[item.date] = { sum: 0, count: 0 };
    acc[item.date].sum += item.ponctualite;
    acc[item.date].count += 1;
    return acc;
  }, {});

  const sortedDates = Object.keys(buckets).sort();
  const ponctualiteData = sortedDates.map((date) =>
    (buckets[date].sum / buckets[date].count).toFixed(2),
  );

  const option: EChartsOption = {
    title: { text: 'Evolution de la Ponctualite', left: 'center' },
    tooltip: { trigger: 'axis', formatter: '{b}<br/>Ponctualite: {c}%' },
    xAxis: {
      type: 'category',
      data: sortedDates,
      axisLabel: { rotate: 45 },
    },
    yAxis: { type: 'value', name: 'Ponctualite (%)', min: 70, max: 100 },
    series: [
      {
        data: ponctualiteData,
        type: 'line',
        smooth: true,
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(88, 217, 249, 0.5)' },
              { offset: 1, color: 'rgba(88, 217, 249, 0.1)' },
            ],
          },
        },
        lineStyle: { width: 3, color: '#58D9F9' },
        itemStyle: { color: '#58D9F9' },
      },
    ],
    grid: { left: '3%', right: '4%', bottom: '15%', containLabel: true },
  };

  return <ReactECharts option={option} style={{ height: '400px' }} />;
};

export default PonctualiteEvolution;

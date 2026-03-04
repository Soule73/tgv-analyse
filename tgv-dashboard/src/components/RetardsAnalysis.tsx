/**
 * RetardsAnalysis
 * Combined bar + line chart showing total delays (bars) and average
 * punctuality (line) for each TGV network region.
 */

import React from 'react';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';
import type { TGVData } from '../types/tgv.types';

interface RetardsAnalysisProps {
  /** Full dataset used to aggregate delays and punctuality per region. */
  data: TGVData[];
}

/** Accumulated delay and punctuality totals per region. */
interface RegionDelayBucket {
  totalRetards: number;
  sumPonctualite: number;
  count: number;
}

const RetardsAnalysis: React.FC<RetardsAnalysisProps> = ({ data }) => {
  if (!data.length) return null;

  // Compute total delays and average punctuality per region
  const buckets = data.reduce<Record<string, RegionDelayBucket>>((acc, item) => {
    if (!acc[item.region]) {
      acc[item.region] = { totalRetards: 0, sumPonctualite: 0, count: 0 };
    }
    acc[item.region].totalRetards += item.retards;
    acc[item.region].sumPonctualite += item.ponctualite;
    acc[item.region].count += 1;
    return acc;
  }, {});

  const regions = Object.keys(buckets);
  const retardsData = regions.map((r) => buckets[r].totalRetards);
  const ponctualiteData = regions.map((r) =>
    (buckets[r].sumPonctualite / buckets[r].count).toFixed(2),
  );

  const option: EChartsOption = {
    title: { text: 'Analyse des Retards par Region', left: 'center' },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'cross', crossStyle: { color: '#999' } },
    },
    legend: { data: ['Retards', 'Ponctualite'], bottom: 10 },
    xAxis: {
      type: 'category',
      data: regions,
      axisPointer: { type: 'shadow' },
    },
    yAxis: [
      {
        type: 'value',
        name: 'Nombre de retards',
        min: 0,
        axisLabel: { formatter: '{value}' },
      },
      {
        type: 'value',
        name: 'Ponctualite (%)',
        min: 70,
        max: 100,
        axisLabel: { formatter: '{value}%' },
      },
    ],
    series: [
      {
        name: 'Retards',
        type: 'bar',
        data: retardsData,
        itemStyle: { color: '#EE6666' },
      },
      {
        name: 'Ponctualite',
        type: 'line',
        yAxisIndex: 1,
        data: ponctualiteData,
        itemStyle: { color: '#91CC75' },
        lineStyle: { width: 3 },
      },
    ],
    grid: { left: '3%', right: '4%', bottom: '15%', containLabel: true },
  };

  return <ReactECharts option={option} style={{ height: '400px' }} />;
};

export default RetardsAnalysis;

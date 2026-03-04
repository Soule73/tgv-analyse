/**
 * TopTrajets
 * Horizontal bar chart ranking the top 10 departure stations by total
 * number of scheduled trains.
 */

import React from 'react';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';
import type { TGVData } from '../types/tgv.types';

interface TopTrajetsProps {
  /** Full dataset used to aggregate train counts per departure station. */
  data: TGVData[];
}

/** Accumulated stats per departure station. */
interface StationBucket {
  trains: number;
  ponctualite: number;
}

const TopTrajets: React.FC<TopTrajetsProps> = ({ data }) => {
  if (!data.length) return null;

  // Aggregate total scheduled trains by departure station
  const stationBuckets = data.reduce<Record<string, StationBucket>>((acc, item) => {
    if (!acc[item.depart]) acc[item.depart] = { trains: 0, ponctualite: 0 };
    acc[item.depart].trains += item.trains_prevus;
    acc[item.depart].ponctualite = item.ponctualite;
    return acc;
  }, {});

  // Sort by total trains descending and keep the top 10
  const top10 = Object.entries(stationBuckets)
    .sort(([, a], [, b]) => b.trains - a.trains)
    .slice(0, 10);

  const gares = top10.map(([station]) => station);
  const trainsData = top10.map(([, bucket]) => bucket.trains);

  const option: EChartsOption = {
    title: { text: 'Top 10 Gares de Depart', left: 'center' },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: '{b}<br/>Trains: {c}',
    },
    xAxis: { type: 'value', name: 'Nombre de trains' },
    yAxis: { type: 'category', data: gares, inverse: true },
    series: [
      {
        data: trainsData,
        type: 'bar',
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 1,
            y2: 0,
            colorStops: [
              { offset: 0, color: '#EE6666' },
              { offset: 1, color: '#FAC858' },
            ],
          },
        },
        label: { show: true, position: 'right', formatter: '{c}' },
      },
    ],
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
  };

  return <ReactECharts option={option} style={{ height: '400px' }} />;
};

export default TopTrajets;

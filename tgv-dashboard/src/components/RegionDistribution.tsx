/**
 * RegionDistribution
 * Donut chart showing the share of records per TGV network region.
 */

import React from 'react';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';
import type { TGVData } from '../types/tgv.types';

interface RegionDistributionProps {
  /** Full dataset used to count records per region. */
  data: TGVData[];
}

interface PieDataItem {
  value: number;
  name: string;
}

const RegionDistribution: React.FC<RegionDistributionProps> = ({ data }) => {
  if (!data.length) return null;

  // Count the number of records per region
  const regionCounts = data.reduce<Record<string, number>>((acc, item) => {
    acc[item.region] = (acc[item.region] ?? 0) + 1;
    return acc;
  }, {});

  const pieData: PieDataItem[] = Object.entries(regionCounts).map(([name, value]) => ({
    name,
    value,
  }));

  const option: EChartsOption = {
    title: { text: 'Distribution par Region', left: 'center' },
    tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    legend: { orient: 'vertical', left: 'left', top: 'middle' },
    series: [
      {
        name: 'Region',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 2 },
        label: { show: true, formatter: '{b}\n{d}%' },
        emphasis: { label: { show: true, fontSize: 20, fontWeight: 'bold' } },
        labelLine: { show: true },
        data: pieData,
      },
    ],
  };

  return <ReactECharts option={option} style={{ height: '400px' }} />;
};

export default RegionDistribution;

/**
 * PonctualiteMetric
 * Renders a half-ring gauge displaying the average on-time rate.
 */

import React from 'react';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';

interface PonctualiteMetricProps {
  /** Average punctuality percentage (0–100). */
  avgPonctualite: number;
}

const PonctualiteMetric: React.FC<PonctualiteMetricProps> = ({ avgPonctualite }) => {
  const value = avgPonctualite.toFixed(1);

  const option: EChartsOption = {
    series: [
      {
        type: 'gauge',
        startAngle: 180,
        endAngle: 0,
        min: 0,
        max: 100,
        splitNumber: 10,
        axisLine: {
          lineStyle: {
            width: 30,
            // Colour stops: red < 80 %, yellow < 90 %, blue ≥ 90 %
            color: [
              [0.8, '#FF6E76'],
              [0.9, '#FDDD60'],
              [1, '#58D9F9'],
            ],
          },
        },
        pointer: {
          icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
          length: '60%',
          width: 10,
          offsetCenter: [0, '-60%'],
          itemStyle: { color: 'auto' },
        },
        axisTick: { length: 12, lineStyle: { color: 'auto', width: 2 } },
        splitLine: { length: 20, lineStyle: { color: 'auto', width: 5 } },
        axisLabel: {
          color: '#464646',
          fontSize: 14,
          distance: -60,
          formatter: (v: number) => `${v}%`,
        },
        title: { offsetCenter: [0, '30%'], fontSize: 20 },
        detail: {
          fontSize: 40,
          offsetCenter: [0, '0%'],
          valueAnimation: true,
          formatter: (v: number) => `${v}%`,
          color: 'auto',
        },
        data: [{ value: parseFloat(value), name: 'Average Punctuality' }],
      },
    ],
  };

  return <ReactECharts option={option} style={{ height: '400px' }} />;
};

export default PonctualiteMetric;

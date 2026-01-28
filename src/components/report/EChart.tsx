import React from 'react';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';

interface EChartProps {
  options: EChartsOption;
  height?: number;
}

export const EChart: React.FC<EChartProps> = ({ options, height = 180 }) => {
  return (
    <ReactECharts
      option={options}
      style={{ width: '100%', height: `${height}px` }}
      opts={{ renderer: 'svg' }}
    />
  );
};

export default EChart;

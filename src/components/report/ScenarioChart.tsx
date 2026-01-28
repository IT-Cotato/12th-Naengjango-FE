import React from 'react';
import type { EChartsOption } from 'echarts';
import EChart from './EChart';
import { useMemo } from 'react';

interface ScenarioItem {
  label: string; // '7일 전', '6일 전' ...
  value: number; // 남은 일수
}

interface ScenarioChartProps {
  items: ScenarioItem[];
  bankruptDateLabel: string; //2월 24일
  dateLabels?: string[];
}

const ScenarioChart: React.FC<ScenarioChartProps> = ({ items, bankruptDateLabel, dateLabels =['20일', '21일', '22일', '23일', '24일', '25일', '26일', '27일'] }) => {

  const option: EChartsOption = useMemo(
    () => ({
      grid: { left: 0, right: 16, top: 10, bottom: 0, containLabel: true },
      xAxis: [
        {
          type: 'value',
          axisLine: { show: false },
          axisTick: { show: false },
          splitLine: { show: false },
          axisLabel: { show: false },
        },
        {
          type: 'category',
          position: 'bottom',
          data: dateLabels,
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: {
            color: '#9CA3AF',
            fontSize: 10,
          },
        },
      ],
      yAxis: {
        type: 'category',
        inverse: true,
        data: items.map((item) => item.label),
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          color: '#A7A7A7',
          fontSize: 10,
        },
      },
      tooltip: { show: false },
      series: [
        {
          type: 'bar',
          data: items.map((item) => item.value),
          xAxisIndex: 0,
          barWidth: 18,
          itemStyle: {
            borderRadius: [0, 6, 6, 0],
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 1,
              y2: 0,
              colorStops: [
                { offset: 0, color: '#ff0000' },
                { offset: 1, color: '#ffdcdc' },
              ],
            },
          },
        },
      ],
    }),
    [items, dateLabels],
  );

  return (
    <div className="px-5 py-8 mt-4 w-82 bg-white rounded-[20px] shadow-md">
      <p className="Bold_18 text-gray-800 mb-1">파산 시나리오</p>
      <p className="Semibold_15 text-gray-700">
        최근 7일처럼 소비하면
        <br />
        <span className="text-error">{bankruptDateLabel}</span> 파산 예정이에요...
      </p>
      <div className="mt-4">
        <EChart options={option} height={230} />
      </div>
    </div>
  );
};

export default ScenarioChart;

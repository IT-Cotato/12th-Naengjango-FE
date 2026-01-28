import React from 'react';
import type { EChartsOption } from 'echarts';
import EChart from './EChart';

interface Props {
  labels: string[]; // 7일 전, 6일 전, ... 오늘
  values: number[]; // 32000, ...
}

const DailyBudgetChart: React.FC<Props> = ({ labels, values }) => {
  const option: EChartsOption = {
    grid: { left: 0, right: 0, top: 10, bottom: 20, containLabel: true },
    xAxis: {
      type: 'category',
      data: labels,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#A7A7A7', fontSize: 10 },
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { show: false },
      axisLabel: {
        color: '#A7A7A7',
        fontSize: 10,
        formatter: (value: number) => `${Math.round(value / 1000)}k`, // 10k, 20k ...
      },
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: '{b}<br/>{c}원',
    },
    series: [
      {
        type: 'bar',
        data: values,
        barWidth: 18,
        itemStyle: {
          borderRadius: [6, 6, 0, 0],
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: '#cde4fe' },
              { offset: 1, color: '#5E97D7' },
            ],
          },
        },
      },
    ],
  };

  return (
    <div className="px-5 py-8 w-82 h-78 bg-white rounded-[20px] shadow-[0_4px_20px_rgba(15,23,42,0.08)]">
      <div className="mb-4">
        <p className="Bold_18 text-gray-800">냉잔고님,</p>
        <p className="Bold_18 text-gray-800">
          오늘{' '}
          <span className="text-main-skyblue">
            13,200원
            <span className="ml-1 text-xs text-main-skyblue">(700▲)</span>
          </span>
        </p>
        <p className="Bold_18 text-gray-800">쓸 수 있어요!</p>
      </div>
      <EChart options={option} height={180} />
    </div>
  );
};

export default DailyBudgetChart;

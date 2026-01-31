import React, { useMemo, useState } from 'react';
import type { EChartsOption } from 'echarts';
import EChart from './EChart';

type FreezeInnerTab = 'weekly' | 'monthly';

// 센터 기준 px 오프셋
const LABEL_POS = {
  thin: { x: -120, y: -40 }, // 얇은 링
  thick: { x: 15, y: 6 }, // 두꺼운 링
} as const;

const FreezeEffectCard: React.FC = () => {
  const [innerTab, setInnerTab] = useState<FreezeInnerTab>('weekly');

  const { saving, existing, savingText, existingText } = useMemo(() => {
    if (innerTab === 'weekly') {
      return {
        saving: 89000,
        existing: 43800,
        savingText: '89,000원',
        existingText: '43,800원',
      };
    }
    return {
      saving: 416000,
      existing: 218600,
      savingText: '416,000원',
      existingText: '218,600원',
    };
  }, [innerTab]);

  const donutOption: EChartsOption = useMemo(() => {
    const startAngle = 90;
    const clockwise = true;

    return {
      tooltip: { show: false },
      series: [
        // 1) 얇은 링
        {
          type: 'pie',
          startAngle,
          clockwise,
          radius: ['60%', '84%'],
          center: ['50%', '50%'],
          silent: true,
          label: { show: false },
          labelLine: { show: false },
          emphasis: { scale: false },
          data: [
            {
              value: saving,
              name: '절약',
              itemStyle: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    { offset: 0, color: '#7DB3E0' },
                    { offset: 1, color: '#B8D9F5' },
                  ],
                },
              },
            },
            {
              value: existing,
              name: '기존',
              itemStyle: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    { offset: 0, color: '#EAF4FF' },
                    { offset: 1, color: '#F6FBFF' },
                  ],
                },
              },
            },
          ],
        },

        // 2) 두꺼운 링
        {
          type: 'pie',
          startAngle,
          clockwise,
          radius: ['54%', '87%'],
          center: ['50%', '50%'],
          z: 10,
          silent: true,
          label: { show: false },
          labelLine: { show: false },
          emphasis: { scale: false },
          data: [
            {
              value: saving,
              name: '절약',
              itemStyle: {
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
            {
              value: existing,
              name: '기존',
              itemStyle: { color: 'transparent' },
              emphasis: { itemStyle: { color: 'transparent' } },
            },
          ],
        },
      ],
    };
  }, [saving, existing]);

  const lineOption: EChartsOption = useMemo(
    () =>
      innerTab === 'weekly'
        ? {
            grid: { left: 24, right: 16, top: 10, bottom: 20 },
            xAxis: {
              type: 'category',
              data: ['4주 전', '3주 전', '2주 전', '1주 전', '이번 주'],
              axisLine: { show: false },
              axisTick: { show: false },
              axisLabel: { color: '#A7A7A7', fontSize: 10 },
            },
            yAxis: {
              type: 'value',
              axisLine: { show: false },
              axisTick: { show: false },
              splitLine: { show: false },
              axisLabel: { color: '#A7A7A7', fontSize: 10 },
            },
            series: [
              {
                type: 'line',
                data: [45, 32, 58, 67, 89],
                smooth: true,
                symbol: 'none',
                lineStyle: { color: '#5E97D7', width: 2 },
              },
              {
                type: 'line',
                data: [38, 45, 52, 61, 75],
                smooth: true,
                symbol: 'none',
                lineStyle: { color: '#D1D5DB', width: 2 },
              },
            ],
          }
        : {
            grid: { left: 24, right: 16, top: 10, bottom: 20 },
            xAxis: {
              type: 'category',
              data: ['11월', '12월', '1월', '2월'],
              axisLine: { show: false },
              axisTick: { show: false },
              axisLabel: { color: '#A7A7A7', fontSize: 10 },
            },
            yAxis: {
              type: 'value',
              axisLine: { show: false },
              axisTick: { show: false },
              splitLine: { show: false },
              axisLabel: { color: '#A7A7A7', fontSize: 10 },
            },
            series: [
              {
                type: 'line',
                data: [87, 67, 76, 34],
                smooth: true,
                symbol: 'none',
                lineStyle: { color: '#EF4444', width: 2 },
              },
              {
                type: 'line',
                data: [38, 65, 87, 60],
                smooth: true,
                symbol: 'none',
                lineStyle: { color: '#D1D5DB', width: 2 },
              },
            ],
          },
    [innerTab],
  );

  return (
    <div className="px-5 py-8 w-82 bg-white rounded-[20px] shadow-[0_4px_20px_rgba(15,23,42,0.08)]">
      <div className="mb-4 flex justify-center">
        <button
          type="button"
          role="tablist"
          onClick={() => setInnerTab(innerTab === 'weekly' ? 'monthly' : 'weekly')}
          className="relative inline-flex h-13 w-72 items-center rounded-full cursor-pointer bg-sub-skyblue transition-colors duration-200"
        >
          <span
            className={`
              absolute SemiBold_14 left-11.5 z-10 transition-colors duration-100
              ${innerTab === 'weekly' ? 'text-gray-800' : 'text-white'}
            `}
          >
            주간 리포트
          </span>
          <span
            className={`
              absolute SemiBold_14 right-11.5 z-10 transition-colors duration-100
              ${innerTab === 'monthly' ? 'text-gray-800' : 'text-white'}
            `}
          >
            월간 리포트
          </span>
          <span
            className={`
              absolute inline-block h-9 w-[130px] transform rounded-[26px] bg-white shadow-sm transition-transform duration-200 ease-in-out z-0
              ${innerTab === 'monthly' ? 'translate-x-[144px]' : 'translate-x-[14px]'}
            `}
          />
        </button>
      </div>

      {innerTab === 'weekly' ? (
        <p className="Bold_20 text-gray-800 mb-5">
          이번 주 냉동 성공으로 <br/>
            <span className="text-main-skyblue">{savingText}</span> 지켰어요!
          </p>
      ) : (
        <p className="Bold_20 text-gray-800 mb-5">
          이번 달 냉동 성공으로 <br/>
            <span className="text-main-skyblue">{savingText}</span> 지켰어요!
          </p>
      )}

      {/* 도넛 차트 + 라벨(HTML 오버레이) */}
      <div className="flex justify-center items-center mb-4">
        <div className="relative w-50 h-50 -translate-y-2">
          <EChart key={innerTab} options={donutOption} height={192} />

          <div
            className="absolute left-1/2 top-1/2 z-50 pointer-events-none"
            style={{ transform: 'translate(-50%, -50%)' }}
          >
            {/* 얇은 링 라벨 */}
            <div
              className="absolute ExtraBold_24 text-gray-300"
              style={{
                transform: `translate(${LABEL_POS.thin.x}px, ${LABEL_POS.thin.y}px)`,
                whiteSpace: 'nowrap',
              }}
            >
              {existingText}
            </div>

            {/* 두꺼운 링 라벨 */}
            <div
              className="absolute ExtraBold_24 text-main-skyblue"
              style={{
                transform: `translate(${LABEL_POS.thick.x}px, ${LABEL_POS.thick.y}px)`,
                whiteSpace: 'nowrap',
              }}
            >
              {savingText}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-2">
        {innerTab === 'weekly' ? (
          <>
            <p className="Bold_20 text-gray-800">주간 냉동 성공률 그래프</p>
            <p className="SemiBold_15 text-gray-800">
              저번 주보다 <span className="text-main-skyblue">23,000원</span> 더 지켰어요!
            </p>
          </>
        ) : (
          <>
            <p className="Bold_20 text-gray-800">월간 냉동 성공률 그래프</p>
            <p className="SemiBold_15 text-gray-800">
              저번 달보다 <span className="text-error">45,000원</span> 더 못 지켰어요.
            </p>
          </>
        )}

        <div className="mt-3">
          <EChart options={lineOption} height={120} />
        </div>
      </div>
    </div>
  );
};

export default FreezeEffectCard;

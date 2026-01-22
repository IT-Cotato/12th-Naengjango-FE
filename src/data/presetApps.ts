import * as images from '@/assets/images';

export type PresetApp = {
  id: string;
  name: string;
  src: string;
};

export const PRESET_APPS: PresetApp[] = [
  { id: 'baemin', name: '배달의민족', src: images.baemin },
  { id: 'coupangeats', name: '쿠팡이츠', src: images.coupangeats },
  { id: 'yogiyo', name: '요기요', src: images.yogiyo },
  { id: 'toss', name: '토스', src: images.toss },
  { id: 'kakao', name: '카카오', src: images.kakao },
  { id: 'naver', name: '네이버', src: images.naver },
  { id: 'musinsa', name: '무신사', src: images.musinsa },
  { id: 'kream', name: '크림', src: images.kream },
  { id: 'carrot', name: '당근마켓', src: images.carrot },
  { id: 'lightningmarket', name: '번개장터', src: images.lightningmarket },
  { id: 'joonggonara', name: '중고나라', src: images.joonggonara },
  { id: 'ably', name: '에이블리', src: images.ably },
  { id: 'zigzag', name: '지그재그', src: images.zigzag },
  { id: 'brandi', name: '브랜디', src: images.brandi },
  { id: 'twentyninecm', name: '29CM', src: images.twentyninecm },
  { id: 'shein', name: 'SHEIN', src: images.shein },
  { id: 'oliveyoung', name: '올리브영', src: images.oliveyoung },
  { id: 'todayhouse', name: '오늘의집', src: images.todayhouse },
  { id: 'coupang', name: '쿠팡', src: images.coupang },
  { id: 'aliexpress', name: 'AliExpress', src: images.aliexpress },
  { id: 'temu', name: 'Temu', src: images.temu },
  { id: 'ssg', name: 'SSG.com', src: images.ssg },
  { id: 'interparkticket', name: 'NOL 티켓', src: images.interparkticket },
  { id: 'melonticket', name: '멜론 티켓', src: images.melonticket },
];

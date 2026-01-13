import Menu from '@/components/freeze/Menu';
import { useState } from 'react';
import ToggleCard from '@/components/freeze/freeze/ToggleCard';
import FreezeList from '@/components/freeze/freeze/FreezeList';
import chevron_gray_400 from '../assets/icons/chevron-gray-400.svg';
import box from '../assets/icons/box.svg';
import checkinbox from '../assets/icons/checkinbox.svg';

export default function FreezePage() {
  const [activeTab, setActiveTab] = useState<'freeze' | 'history'>('freeze');
  const [activeToggle, setActiveToggle] = useState<'manual' | 'link'>('manual');

  return (
    <>
      <div
        data-layer="냉동 화면"
        className="w-[375px] h-[812px] relative bg-white-800 overflow-hidden"
      >
        <Menu activeTab={activeTab} onTabChange={setActiveTab} />
        {activeTab === 'freeze' && (
          <div className="justify-center items-center">
            <div
              data-layer="Frame 48096424"
              className="Frame48096424 w-[327px] h-[546px] left-[24px] top-[154px] absolute bg-white-800 rounded-[20px] shadow-[0px_0px_8px_0px_rgba(0,0,0,0.20)] overflow-hidden"
            >
              <div
                data-layer="Frame 32"
                className="Frame32 w-80 px-6 left-0 top-[29px] absolute inline-flex justify-center items-center gap-2.5"
              >
                <div
                  data-layer="새로운 냉동하기"
                  className="flex-1 text-center justify-center text-gray-800 Bold_24 font-sans leading-9"
                >
                  새로운 냉동하기
                </div>
              </div>

              <div
                data-layer="초기화"
                className="left-[270px] top-[41px] absolute text-center justify-start text-gray-200 Regular_14 font-sans underline leading-5 tracking-tight"
              >
                초기화
              </div>

              <FreezeList />
              <ToggleCard activeToggle={activeToggle} onToggleChange={setActiveToggle} />
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div
            data-layer="Frame 48096424"
            className="Frame48096424 w-[327px] h-[646px] left-[24px] top-[154px] relative bg-white-800 rounded-[20px] shadow-[0px_0px_8px_0px_rgba(0,0,0,0.20)] overflow-hidden"
          >
            <div
              data-layer="Frame 48096442"
              className="Frame48096442 w-[287px] left-[20px] top-[99px] absolute inline-flex flex-col justify-start items-start gap-4"
            >
              <div
                data-layer="freeze record"
                className="FreezeRecord self-stretch px-4 py-3 bg-sub-skyblue rounded-xl inline-flex justify-start items-start gap-3"
              >
                <div
                  data-layer="Frame 48096439"
                  className="Frame48096439 w-[227px] flex justify-start items-start gap-3"
                >
                  <div
                    data-layer="Frame 48096438"
                    className="Frame48096438 w-[227px] flex justify-start items-center gap-3"
                  >
                    <img
                      data-layer="image 152"
                      className="Image152 size-[54px] rounded-lg"
                      src="https://placehold.co/54x54"
                    />
                    <div
                      data-layer="Frame 48096437"
                      className="Frame48096437 flex-1 inline-flex flex-col justify-start items-start"
                    >
                      <div
                        data-layer="Frame 48096436"
                        className="Frame48096436 self-stretch inline-flex justify-start items-center gap-[7px]"
                      >
                        <div
                          data-layer="Frame 48096435"
                          className="Frame48096435 size- px-1.5 py-0.5 bg-main-skyblue rounded-lg flex justify-center items-center gap-2.5"
                        >
                          <div
                            data-layer="24H"
                            className="H text-center justify-center text-white-800 Medium_12 font-sans leading-[18px] tracking-tight"
                          >
                            24H
                          </div>
                        </div>
                        <div
                          data-layer="바지"
                          className="w-[118px] justify-center text-black SemiBold_14 font-sans leading-[22.50px] tracking-tight"
                        >
                          바지
                        </div>
                      </div>
                      <div
                        data-layer="57,000원"
                        className="000 self-stretch justify-center text-black SemiBold_14 font-sans leading-[22.50px] tracking-tight"
                      >
                        57,000원
                      </div>
                    </div>
                  </div>
                </div>
                <img src={checkinbox} alt="체크박스" className="w-[16px] h-[16px] relative" />
              </div>
              <div
                data-layer="freeze record"
                className="FreezeRecord self-stretch px-4 py-3 bg-sub-skyblue rounded-xl inline-flex justify-start items-start gap-3"
              >
                <div
                  data-layer="Frame 48096439"
                  className="Frame48096439 w-[227px] flex justify-start items-start gap-3"
                >
                  <div
                    data-layer="Frame 48096438"
                    className="Frame48096438 w-[227px] flex justify-start items-center gap-3"
                  >
                    <img
                      data-layer="image 152"
                      className="Image152 size-[54px] rounded-lg"
                      src="https://placehold.co/54x54"
                    />
                    <div
                      data-layer="Frame 48096437"
                      className="Frame48096437 flex-1 inline-flex flex-col justify-start items-start"
                    >
                      <div
                        data-layer="Frame 48096436"
                        className="Frame48096436 self-stretch inline-flex justify-start items-center gap-[7px]"
                      >
                        <div
                          data-layer="Frame 48096435"
                          className="Frame48096435 size- px-1.5 py-0.5 bg-main-skyblue rounded-lg flex justify-center items-center gap-2.5"
                        >
                          <div
                            data-layer="24H"
                            className="H text-center justify-center text-white-800 Medium_12 font-sans leading-[18px] tracking-tight"
                          >
                            22H
                          </div>
                        </div>
                        <div
                          data-layer="바지"
                          className="w-[118px] justify-center text-black SemiBold_14 font-sans leading-[22.50px] tracking-tight"
                        >
                          맨투맨
                        </div>
                      </div>
                      <div
                        data-layer="57,000원"
                        className="000 self-stretch justify-center text-black SemiBold_14 font-sans leading-[22.50px] tracking-tight"
                      >
                        115,000원
                      </div>
                    </div>
                  </div>
                </div>
                <img src={checkinbox} alt="체크박스" className="w-[16px] h-[16px] relative" />
              </div>
              <div
                data-layer="freeze record"
                className="FreezeRecord self-stretch px-4 py-3 bg-sub-skyblue rounded-xl inline-flex justify-start items-start gap-3"
              >
                <div
                  data-layer="Frame 48096439"
                  className="Frame48096439 w-[227px] flex justify-start items-start gap-3"
                >
                  <div
                    data-layer="Frame 48096438"
                    className="Frame48096438 w-[227px] flex justify-start items-center gap-3"
                  >
                    <img
                      data-layer="image 152"
                      className="Image152 size-[54px] rounded-lg"
                      src="https://placehold.co/54x54"
                    />
                    <div
                      data-layer="Frame 48096437"
                      className="Frame48096437 flex-1 inline-flex flex-col justify-start items-start"
                    >
                      <div
                        data-layer="Frame 48096436"
                        className="Frame48096436 self-stretch inline-flex justify-start items-center gap-[7px]"
                      >
                        <div
                          data-layer="Frame 48096435"
                          className="Frame48096435 size- px-1.5 py-0.5 bg-main-skyblue rounded-lg flex justify-center items-center gap-2.5"
                        >
                          <div
                            data-layer="24H"
                            className="H text-center justify-center text-white-800 Medium_12 font-sans leading-[18px] tracking-tight"
                          >
                            22H
                          </div>
                        </div>
                        <div
                          data-layer="바지"
                          className="w-[118px] justify-center text-black SemiBold_14 font-sans leading-[22.50px] tracking-tight"
                        >
                          후드티
                        </div>
                      </div>
                      <div
                        data-layer="57,000원"
                        className="000 self-stretch justify-center text-black SemiBold_14 font-sans leading-[22.50px] tracking-tight"
                      >
                        165,000원
                      </div>
                    </div>
                  </div>
                </div>
                <img src={checkinbox} alt="체크박스" className="w-[16px] h-[16px] relative" />
              </div>
              <div
                data-layer="freeze record"
                className="FreezeRecord self-stretch px-4 py-3 bg-sub-skyblue rounded-xl inline-flex justify-start items-start gap-3"
              >
                <div
                  data-layer="Frame 48096439"
                  className="Frame48096439 w-[227px] flex justify-start items-start gap-3"
                >
                  <div
                    data-layer="Frame 48096438"
                    className="Frame48096438 w-[227px] flex justify-start items-center gap-3"
                  >
                    <img
                      data-layer="image 152"
                      className="Image152 size-[54px] rounded-lg"
                      src="https://placehold.co/54x54"
                    />
                    <div
                      data-layer="Frame 48096437"
                      className="Frame48096437 flex-1 inline-flex flex-col justify-start items-start"
                    >
                      <div
                        data-layer="Frame 48096436"
                        className="Frame48096436 self-stretch inline-flex justify-start items-center gap-[7px]"
                      >
                        <div
                          data-layer="Frame 48096435"
                          className="Frame48096435 size- px-1.5 py-0.5 bg-main-skyblue rounded-lg flex justify-center items-center gap-2.5"
                        >
                          <div
                            data-layer="24H"
                            className="H text-center justify-center text-white-800 Medium_12 font-sans leading-[18px] tracking-tight"
                          >
                            3H
                          </div>
                        </div>
                        <div
                          data-layer="바지"
                          className="w-[118px] justify-center text-black SemiBold_14 font-sans leading-[22.50px] tracking-tight"
                        >
                          에어포스
                        </div>
                      </div>
                      <div
                        data-layer="57,000원"
                        className="000 self-stretch justify-center text-black SemiBold_14 font-sans leading-[22.50px] tracking-tight"
                      >
                        122,000원
                      </div>
                    </div>
                  </div>
                </div>
                <img src={checkinbox} alt="체크박스" className="w-[16px] h-[16px] relative" />
              </div>
            </div>
            <div
              data-layer="Frame 48096449"
              className="Frame48096449 w-[287px] left-[20px] top-[73px] absolute inline-flex justify-between items-center"
            >
              <div
                data-layer="Frame 48096444"
                className="Frame48096444 size- flex justify-start items-center gap-1"
              >
                <div
                  data-layer="전체 선택"
                  className="text-center justify-start text-main-skyblue Medium_12 font-sans leading-[17.40px] tracking-tight"
                >
                  전체 선택
                </div>
                <img src={box} alt="체크박스" className="w-[16px] h-[16px] relative" />
              </div>

              <div
                data-layer="Frame 48096443"
                className="Frame48096443 w-[58px] pl-[7px] py-0.5 rounded-md outline outline-[0.50px] outline-offset-[-0.50px] outline-gray-200 inline-flex justify-center items-center"
              >
                <div
                  data-layer="최신순"
                  className="justify-start text-gray-400 Medium_12 font-sans leading-[18px] tracking-tight"
                >
                  최신순
                </div>
                <img src={chevron_gray_400} alt="chevron" className="w-[16px] h-[16px] relative" />
              </div>
            </div>

            <div
              data-layer="Frame 48096448"
              className="Frame48096448 w-[287px] left-[20px] top-[474px] absolute inline-flex flex-col justify-start items-start gap-2.5"
            >
              <div
                data-layer="Frame 48096447"
                className="Frame48096447 self-stretch inline-flex justify-center items-center gap-[9px]"
              >
                <div
                  data-layer="Frame 48096445"
                  className="Frame48096445 w-[89px] px-2 py-1.5 bg-main-skyblue rounded-lg flex justify-center items-center gap-2.5"
                >
                  <div
                    data-layer="계속 냉동"
                    className="text-center justify-start text-white-800 SemiBold_14 font-sans leading-5 tracking-tight"
                  >
                    계속 냉동
                  </div>
                </div>
                <div
                  data-layer="Frame 48096446"
                  className="Frame48096446 w-[89px] px-2 py-1.5 bg-main-skyblue rounded-lg flex justify-center items-center gap-2.5"
                >
                  <div
                    data-layer="냉동 실패"
                    className="text-center justify-start text-white-800 SemiBold_14 font-sans leading-5 tracking-tight"
                  >
                    냉동 실패
                  </div>
                </div>
                <div
                  data-layer="Frame 48096447"
                  className="Frame48096447 w-[89px] px-2 py-1.5 bg-main-skyblue rounded-lg flex justify-center items-center gap-2.5"
                >
                  <div
                    data-layer="냉동 성공"
                    className="text-center justify-start text-white-800 SemiBold_14 font-sans leading-5 tracking-tight"
                  >
                    냉동 성공
                  </div>
                </div>
              </div>
            </div>
            <div
              data-layer="Frame 48096450"
              className="Frame48096450 w-[375px] left-[-24px] top-[540px] absolute inline-flex flex-col justify-start items-start"
            >
              <div
                data-layer="Frame 41"
                className="Frame41 self-stretch px-6 inline-flex justify-start items-center gap-2.5"
              >
                <div
                  data-layer="선택한 상품을 구매하면"
                  className="flex-1 text-center justify-center text-gray-800 SemiBold_20 font-sans leading-[30px] tracking-tight"
                >
                  선택한 상품을 구매하면
                </div>
              </div>
              <div
                data-layer="Frame 42"
                className="Frame42 self-stretch px-6 inline-flex justify-start items-center gap-2.5"
              >
                <div
                  data-layer="하루 4,000원 쓸 수 있게 돼요!"
                  className="4000 flex-1 text-center justify-center"
                >
                  <span className="text-gray-800 SemiBold_20 font-sans leading-[30px] tracking-tight">
                    하루
                  </span>
                  <span className="text-error SemiBold_20 font-sans leading-[30px] tracking-tight">
                    {' '}
                    4,000원
                  </span>
                  <span className="text-gray-800 SemiBold_20 font-sans leading-[30px] tracking-tight">
                    {' '}
                    쓸 수 있게 돼요!
                  </span>
                </div>
              </div>
            </div>
            <div
              data-layer="Frame 32"
              className="Frame32 w-[375px] px-6 left-[-24px] top-[29px] absolute inline-flex justify-center items-center gap-2.5"
            >
              <div
                data-layer="나의 냉동 기록"
                className="flex-1 text-center justify-start text-gray-800 Bold_24 font-sans leading-9"
              >
                나의 냉동 기록
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

import Lottie from 'lottie-react';
import loadingAnimation from '@/assets/lottie/loading.json';
export default function LoadingOverlay() {
  return (
    <>
      <div className="fixed inset-0 bg-white/80 flex flex-col justify-center items-center z-[9999]">
        <Lottie animationData={loadingAnimation} loop className="w-[200px] h-[200px]" />
        <div className="text-accent-darkblue Bold_20 mt-4">Loading...</div>
      </div>
    </>
  );
}

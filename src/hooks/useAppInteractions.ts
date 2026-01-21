import { useRef } from 'react';

type UseAppInteractionProps = {
  onClick?: () => void;
  onLongPress?: () => void;
  delay?: number; // 기본 500ms
};

export function useAppInteraction({ onClick, onLongPress, delay = 500 }: UseAppInteractionProps) {
  const pressTimerRef = useRef<number | null>(null);
  const longPressedRef = useRef(false);

  const startPress = () => {
    longPressedRef.current = false;

    pressTimerRef.current = window.setTimeout(() => {
      longPressedRef.current = true;
      onLongPress?.();
    }, delay);
  };

  const cancelPress = () => {
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
    }
  };

  const handleClick = () => {
    // long press 이후 click 방지
    if (!longPressedRef.current) {
      onClick?.();
    }
  };

  return {
    onMouseDown: startPress,
    onMouseUp: cancelPress,
    onMouseLeave: cancelPress,
    onTouchStart: startPress,
    onTouchEnd: cancelPress,
    onClick: handleClick,
  };
}

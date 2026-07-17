import { useRef } from 'react';
import gsap from 'gsap';
import { sfx } from '../sound';

type Props = {
  className?: string;
  /** Arcade coin-flip on hover/tap with coin sfx. */
  interactive?: boolean;
  /** Disc tint: original navy (header + favicon) or sage (preloader). */
  variant?: 'navy' | 'sage';
};

const BADGE_SRC = {
  navy: '/sanblue-badge.png',
  sage: '/sanblue-badge-sage.png',
} as const;

export default function SanblueBadge({ className, interactive = false, variant = 'navy' }: Props) {
  const ref = useRef<HTMLImageElement>(null);

  const coinSpin = () => {
    const el = ref.current;
    if (!el || gsap.isTweening(el)) return;
    sfx.coin();
    gsap.fromTo(
      el,
      { rotationY: 0 },
      { rotationY: 720, duration: 1.05, ease: 'power3.out', transformPerspective: 600 }
    );
  };

  return (
    <img
      ref={ref}
      src={BADGE_SRC[variant]}
      alt="sanbluedot badge"
      className={className}
      draggable={false}
      style={interactive ? { cursor: 'pointer' } : undefined}
      onPointerEnter={interactive ? coinSpin : undefined}
      onClick={interactive ? coinSpin : undefined}
    />
  );
}

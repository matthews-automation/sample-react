'use client';
import ParallaxHook from '@/components/ParallaxHook';

// css in style/transitions

export default function ImageParallax({ imageUrl, classes } : ImageParallaxProps) {
  const { imageRef, elementPosition } = ParallaxHook();
  const translateYValue = `${-elementPosition / 2}%`;
  return (
    <div className={`lx ${classes.join(' ')}`} ref={imageRef}>
        <img ref={imageRef} style={{ transform: `translateY(${translateYValue})` }} src={imageUrl} />
    </div>
  );
}

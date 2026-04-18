// SPDX-FileCopyrightText: 2026 Padparadscho <contact@padparadscho.com>
// SPDX-License-Identifier: GPL-3.0-only

'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';

export interface ScrollingProps {
  /** Scrollable content */
  children: ReactNode;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Reusable scrolling component
 * @param props {@link ScrollingProps}
 * @returns {ReactNode}
 */
export function Scrolling({ children, className }: ScrollingProps): ReactNode {
  const viewportRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [visible, setVisible] = useState(false);

  const hide = useCallback(() => {
    clearTimeout(hideTimeoutRef.current);
    hideTimeoutRef.current = setTimeout(() => setVisible(false), 600);
  }, []);

  const handleScroll = useCallback(() => {
    setVisible(true);
    hide();
  }, [hide]);

  const handlePointerEnter = useCallback(() => {
    setVisible(true);
    clearTimeout(hideTimeoutRef.current);
  }, []);

  useEffect(() => {
    return () => clearTimeout(hideTimeoutRef.current);
  }, []);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const updateThumb = () => {
      const thumb = thumbRef.current;
      if (!thumb) return;

      const { scrollTop, scrollHeight, clientHeight } = viewport;

      if (scrollHeight <= clientHeight) {
        thumb.style.height = '0px';
        thumb.style.transform = 'translateY(0px)';
        return;
      }

      const thumbHeight = Math.max(
        (clientHeight / scrollHeight) * clientHeight,
        18,
      );
      const translateY =
        (scrollTop / (scrollHeight - clientHeight)) *
        (clientHeight - thumbHeight);

      thumb.style.height = `${thumbHeight}px`;
      thumb.style.transform = `translateY(${translateY}px)`;
    };

    updateThumb();

    viewport.addEventListener('scroll', updateThumb);

    const resizeObserver = new ResizeObserver(updateThumb);
    resizeObserver.observe(viewport);

    return () => {
      viewport.removeEventListener('scroll', updateThumb);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div
      className={[
        'relative',
        className?.includes('overflow-x') ? '' : 'overflow-hidden',
      ].join(' ')}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={hide}
    >
      <div
        ref={viewportRef}
        onScroll={handleScroll}
        className={[
          'w-full h-full overflow-y-auto scroll-area-viewport pr-2.5',
          className ?? '',
        ].join(' ')}
      >
        {children}
      </div>

      <div
        className="absolute top-0 right-0 bottom-0 w-1.5 select-none touch-none duration-200 transition-opacity"
        style={{
          opacity: visible ? 1 : 0,
          pointerEvents: visible ? 'auto' : 'none',
        }}
      >
        <div ref={thumbRef} className="rounded-full bg-border">
          &nbsp;
        </div>
      </div>
    </div>
  );
}

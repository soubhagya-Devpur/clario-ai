import { useState, useEffect, useRef } from 'react';

/**
 * NavigationControls - Prev/Next navigation + autoplay toggle.
 * @param {number} current - Current slide index (0-based)
 * @param {number} total - Total number of slides
 * @param {function} onPrev - Go to previous slide
 * @param {function} onNext - Go to next slide
 * @param {function} onRestart - Called when user clicks "Ask Another"
 */
export default function NavigationControls({ current, total, onPrev, onNext, onRestart }) {
  const [autoplay, setAutoplay] = useState(false);
  const [autoplayKey, setAutoplayKey] = useState(0);
  const timerRef = useRef(null);

  // Autoplay logic
  useEffect(() => {
    if (!autoplay) {
      clearTimeout(timerRef.current);
      return;
    }

    timerRef.current = setTimeout(() => {
      if (current < total - 1) {
        onNext();
        setAutoplayKey((k) => k + 1);
      } else {
        setAutoplay(false);
      }
    }, 3500);

    return () => clearTimeout(timerRef.current);
  }, [autoplay, current, total, onNext]);

  const toggleAutoplay = () => {
    setAutoplay((a) => !a);
    setAutoplayKey((k) => k + 1);
  };

  const isFirst = current === 0;
  const isLast = current === total - 1;

  return (
    <div className="w-full max-w-2xl mx-auto mt-6 flex flex-col gap-4">
      {/* Autoplay progress bar */}
      {autoplay && (
        <div className="h-0.5 w-full bg-white/10 rounded-full overflow-hidden">
          <div key={autoplayKey} className="autoplay-bar" style={{ animationDuration: '3.5s' }} />
        </div>
      )}

      {/* Main controls row */}
      <div className="flex items-center justify-between gap-3">
        {/* Previous */}
        <button
          id="btn-prev"
          onClick={onPrev}
          disabled={isFirst}
          className="btn-nav flex items-center gap-2 px-5 py-3 text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Previous
        </button>

        {/* Center group */}
        <div className="flex flex-col items-center gap-2">
          {/* Autoplay toggle */}
          <button
            id="btn-autoplay"
            onClick={toggleAutoplay}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border transition-all duration-200
              ${autoplay
                ? 'bg-purple-600/40 border-purple-400/60 text-purple-200'
                : 'bg-white/5 border-white/10 text-purple-400 hover:border-purple-400/40 hover:text-purple-300'
              }`}
          >
            {autoplay ? (
              <>
                <span className="w-2 h-2 rounded-sm bg-purple-300 block" />
                Stop
              </>
            ) : (
              <>
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                </svg>
                Autoplay
              </>
            )}
          </button>

          {/* Slide counter */}
          <span className="text-purple-400 text-xs font-medium">
            {current + 1} of {total}
          </span>
        </div>

        {/* Next / Ask Another */}
        {isLast ? (
          <button
            id="btn-restart"
            onClick={onRestart}
            className="btn-primary flex items-center gap-2 px-5 py-3 text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span className="relative z-10">Ask Another</span>
          </button>
        ) : (
          <button
            id="btn-next"
            onClick={onNext}
            disabled={isLast}
            className="btn-nav flex items-center gap-2 px-5 py-3 text-sm"
          >
            Next
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>

      {/* Keyboard hint */}
      <p className="text-center text-purple-500/40 text-xs">
        Tip: Use ← → arrow keys to navigate slides
      </p>
    </div>
  );
}

/**
 * SlideCard - Displays a single explanation slide.
 * @param {object} slide - { title: string, content: string }
 * @param {number} index - 0-based slide index
 * @param {number} total - Total number of slides
 * @param {string} direction - 'right' | 'left' for entry animation
 */
export default function SlideCard({ slide, index, total, direction = 'right' }) {
  // Icon pool for slide headers
  const icons = ['🔍', '💡', '📖', '🧠', '🚀', '🔬', '⚙️', '🎯'];
  const icon = icons[index % icons.length];

  const renderSlideContent = (content) => {
    const parts = content.split(/(```[\s\S]*?```)/g);
    return parts.map((part, idx) => {
      if (!part) return null;
      if (part.startsWith('```')) {
        const code = part.replace(/^```[a-zA-Z0-9]*\n?/, '').replace(/```$/, '');
        return (
          <pre
            key={idx}
            className="bg-slate-950/90 text-slate-100 rounded-3xl p-4 overflow-x-auto text-sm leading-relaxed font-mono whitespace-pre-wrap mb-4"
          >
            <code>{code}</code>
          </pre>
        );
      }

      return part
        .split(/\n\n+/)
        .filter(Boolean)
        .map((paragraph, paragraphIndex) => (
          <div
            key={`${idx}-${paragraphIndex}`}
            className="text-purple-100 text-lg leading-relaxed font-light mb-4 whitespace-pre-wrap"
          >
            {paragraph.trim()}
          </div>
        ));
    });
  };

  return (
    <div className={direction === 'right' ? 'slide-enter' : 'slide-enter-left'}>
      <div className="glass-card w-full max-w-2xl mx-auto overflow-hidden">
        {/* Top accent bar */}
        <div
          className="h-1.5 w-full"
          style={{
            background: `linear-gradient(90deg, 
              hsl(${(index * 47 + 260) % 360}, 80%, 65%), 
              hsl(${(index * 47 + 300) % 360}, 80%, 70%))`,
          }}
        />

        <div className="p-8 md:p-10">
          {/* Slide badge */}
          <div className="flex items-center justify-between mb-6">
            <span className="slide-badge">
              SLIDE {index + 1} / {total}
            </span>
            <span className="text-3xl" role="img" aria-label="slide icon">
              {icon}
            </span>
          </div>

          {/* Title */}
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-5 leading-tight">
            {slide.title}
          </h2>

          {/* Divider */}
          <div
            className="h-px w-16 mb-6 rounded-full"
            style={{
              background: `linear-gradient(90deg, 
                hsl(${(index * 47 + 260) % 360}, 80%, 65%), 
                transparent)`,
            }}
          />

          {/* Content */}
          <div>{renderSlideContent(slide.content)}</div>

          {/* Visual decoration dots */}
          <div className="flex gap-1.5 mt-8">
            {Array.from({ length: total }).map((_, i) => (
              <div
                key={i}
                className={`progress-dot ${i === index ? 'active' : ''}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

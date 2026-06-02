export default function Spinner() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-8">
      {/* Animated rings */}
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 rounded-full border-4 border-purple-500/20" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-400 animate-spin" />
        <div
          className="absolute inset-2 rounded-full border-4 border-transparent border-t-fuchsia-400"
          style={{ animation: 'spin 1.2s linear infinite reverse' }}
        />
        {/* Center dot */}
        <div className="absolute inset-1/2 w-3 h-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-400 animate-pulse-slow" />
      </div>

      {/* Text */}
      <div className="text-center">
        <p className="text-purple-200 text-lg font-semibold tracking-wide">
          Generating your explanation...
        </p>
        <p className="text-purple-400 text-sm mt-1 font-medium">
          AI is crafting your slides ✨
        </p>
      </div>

      {/* Bouncing dots */}
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-purple-400"
            style={{
              animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-10px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

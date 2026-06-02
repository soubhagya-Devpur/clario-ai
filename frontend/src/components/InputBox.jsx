import { useState } from 'react';

/**
 * InputBox - Home view for entering a question.
 * @param {function} onGenerate - Called with (question) when the user submits.
 * @param {boolean} loading - Whether a request is in progress.
 * @param {string|null} error - Error message to display.
 */
export default function InputBox({ onGenerate, loading, error, mode, onModeChange }) {
  const [question, setQuestion] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!question.trim()) return;
    onGenerate(question.trim(), mode);
  };

  const examples = [
    'Solve 2x + 5 = 17 step-by-step',
    'Write a React login form component',
    'Explain Newton\'s laws with examples',
    'Generate Python code to sort an array',
    'What is a binary search tree?',
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12 relative z-10">
      {/* Header */}
      <div className="text-center mb-10 animate-fade-in">
        <div className="inline-flex items-center gap-2 glass-card-inner px-4 py-2 mb-6">
          <span className="text-purple-300 text-sm font-semibold tracking-widest uppercase">
            🤖 Doubt Clarifier & Code Generator
          </span>
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight mb-4">
          <span className="gradient-text">Clario</span>
        </h1>
        <p className="text-purple-200 text-lg md:text-xl font-medium max-w-md mx-auto leading-relaxed">
          Ask Clario any doubt — math, science, or code — and get a clear AI-powered answer.
        </p>
      </div>

      {/* Card */}
      <div className="glass-card w-full max-w-2xl p-8 animate-slide-up">
        <div className="mb-6 flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
          <div>
            <p className="text-purple-300 text-xs font-semibold uppercase tracking-widest mb-2">
              Choose how you want the answer
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => onModeChange('explain')}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                  mode === 'explain'
                    ? 'bg-purple-500 text-white'
                    : 'bg-white/10 text-purple-200 hover:bg-white/15'
                }`}
              >
                Explain
              </button>
              <button
                type="button"
                onClick={() => onModeChange('code')}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                  mode === 'code'
                    ? 'bg-purple-500 text-white'
                    : 'bg-white/10 text-purple-200 hover:bg-white/15'
                }`}
              >
                Code
              </button>
            </div>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Textarea */}
          <div className="flex flex-col gap-2">
            <label className="text-purple-200 text-sm font-semibold tracking-wide">
              Your Question or Doubt
            </label>
            <textarea
              id="question-input"
              className="input-field w-full px-5 py-4 text-base min-h-[120px]"
              placeholder="e.g. Solve 3x + 7 = 25 step-by-step or generate a React login form..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              disabled={loading}
              maxLength={500}
            />
            <div className="flex justify-between items-center">
              <span className="text-purple-400/60 text-xs">
                Ask anything — science, math, programming, history...
              </span>
              <span className="text-purple-400/60 text-xs">
                {question.length}/500
              </span>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="flex items-start gap-3 bg-red-500/10 border border-red-400/30 rounded-xl px-4 py-3">
              <span className="text-red-400 text-lg leading-none">⚠️</span>
              <p className="text-red-300 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Generate Button */}
          <button
            id="generate-btn"
            type="submit"
            disabled={loading || !question.trim()}
            className="btn-primary relative w-full py-4 text-base tracking-wide"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Generating...
                </>
              ) : (
                <>
                  <span>✨</span> Generate Answer
                </>
              )}
            </span>
          </button>
        </form>

        {/* Example suggestions */}
        <div className="mt-6">
          <p className="text-purple-400 text-xs font-semibold tracking-widest uppercase mb-3">
            Try an example →
          </p>
          <div className="flex flex-wrap gap-2">
            {examples.map((ex) => (
              <button
                key={ex}
                id={`example-${ex.replace(/\s+/g, '-').toLowerCase()}`}
                type="button"
                onClick={() => setQuestion(ex)}
                disabled={loading}
                className="btn-nav text-xs px-3 py-1.5 rounded-lg"
              >
                {ex}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer hint */}
      <p className="text-purple-500/50 text-xs mt-8 animate-fade-in">
        Powered by Groq Llama 3 · AI doubt clarifier and code generator
      </p>
    </div>
  );
}

import React from 'react';

function renderTerminalOutput(outputText) {
  return (
    <div className="bg-slate-900/90 border border-purple-500/20 rounded-3xl overflow-hidden shadow-xl shadow-purple-950/20">
      <div className="flex items-center gap-2 px-4 py-3 bg-slate-950/80 border-b border-purple-500/10">
        <span className="h-3.5 w-3.5 rounded-full bg-red-500" />
        <span className="h-3.5 w-3.5 rounded-full bg-yellow-400" />
        <span className="h-3.5 w-3.5 rounded-full bg-green-500" />
        <p className="text-purple-300 text-xs font-semibold uppercase tracking-[0.2em] ml-2">
          Output Preview
        </p>
      </div>
      <div className="p-4">
        <pre className="text-purple-100 text-sm font-mono whitespace-pre-wrap leading-relaxed">{outputText}</pre>
      </div>
    </div>
  );
}

function renderChatContent(content) {
  const parts = content.split(/(```[\s\S]*?```)/g);
  return parts.map((part, idx) => {
    if (!part) return null;
    if (part.startsWith('```')) {
      let code = part.replace(/^```[a-zA-Z0-9]*\n?/, '').replace(/```$/, '');
      const outputMatch = code.match(/(?:\n|^)\s*(?:#|\/\/|--|%|;)\s*(?:Output|Expected output|Result)\s*[:\-]\s*([\s\S]*)$/i);
      const outputText = outputMatch ? outputMatch[1].trim() : null;
      if (outputMatch) {
        code = code.slice(0, outputMatch.index).trim();
      }

      return (
        <div key={idx} className="space-y-4">
          <pre
            className="bg-slate-950/90 text-slate-100 rounded-3xl p-4 overflow-x-auto text-sm leading-relaxed font-mono whitespace-pre-wrap"
          >
            <code>{code}</code>
          </pre>
          {outputText && renderTerminalOutput(outputText)}
        </div>
      );
    }

    return part
      .split(/\n\n+/)
      .filter(Boolean)
      .map((paragraph, paragraphIndex) => {
        const text = paragraph.trim();
        const outputMatch = text.match(/^(?:###?\s*)?output[:\s-]*\n?(.*)$/i);
        if (outputMatch) {
          return (
            <div key={`${idx}-${paragraphIndex}`} className="mb-4">
              {renderTerminalOutput(outputMatch[1].trim())}
            </div>
          );
        }

        return (
          <div key={`${idx}-${paragraphIndex}`} className="text-purple-100 text-base leading-relaxed mb-4 whitespace-pre-wrap">
            {text}
          </div>
        );
      });
  });
}

export default function ChatView({ question, slides, onRestart }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12 relative z-10">
      <div className="glass-card w-full max-w-3xl p-8 animate-slide-up">
        <div className="mb-8">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <p className="text-purple-300 text-xs font-semibold uppercase tracking-widest mb-1">
                💬 Code Chat
              </p>
              <h1 className="text-3xl font-bold text-white">Chat-style answer</h1>
            </div>
            <button
              onClick={onRestart}
              className="btn-nav px-4 py-2 text-sm text-purple-200 hover:text-white"
            >
              Ask Another
            </button>
          </div>

          <div className="bg-slate-950/80 border border-white/10 rounded-3xl p-5 space-y-4">
            <div className="chat-bubble user bubble-user bg-white/10 border border-white/10 rounded-3xl p-5 text-purple-100">
              <p className="text-sm uppercase tracking-[0.2em] text-purple-300 mb-3">You</p>
              <p className="text-base leading-relaxed">{question}</p>
            </div>

            {slides.map((slide, index) => (
              <div key={index} className="chat-bubble assistant bubble-assistant bg-slate-900/90 border border-purple-500/10 rounded-3xl p-5">
                <div className="mb-4">
                  <p className="text-sm uppercase tracking-[0.2em] text-purple-300">Clario</p>
                  <h2 className="text-xl font-semibold text-white mt-1">{slide.title}</h2>
                </div>
                <div>{renderChatContent(slide.content)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

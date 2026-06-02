import { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import InputBox from './components/InputBox';
import SlideCard from './components/SlideCard';
import ChatView from './components/ChatView';
import NavigationControls from './components/NavigationControls';
import Spinner from './components/Spinner';
import { explainQuestion } from './services/api';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';

function ExplainerApp() {
  const [view, setView] = useState('home'); // 'home' | 'loading' | 'slides'
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState('right');
  const [error, setError] = useState(null);
  const [questionTitle, setQuestionTitle] = useState('');
  const [mode, setMode] = useState('explain');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem('clario_user'));

  // Load history item if navigated from Profile
  useEffect(() => {
    if (location.state?.viewSlides) {
      const historyItem = location.state.viewSlides;
      setQuestionTitle(historyItem.question);
      setSlides(historyItem.slides);
      setCurrentSlide(0);
      setDirection('right');
      setView('slides');
      // Clear state so a refresh goes back to home
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // If not logged in, redirect to login
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Handle question generation
  const handleGenerate = async (question, selectedMode) => {
    setError(null);
    setMode(selectedMode);
    setQuestionTitle(question);
    setLoading(true);
    setView('loading');

    try {
      const data = await explainQuestion(question, user?._id || user?.id, selectedMode);
      setSlides(data);
      setCurrentSlide(0);
      setDirection('right');
      setView('slides');
    } catch (err) {
      const msg =
        err?.response?.data?.error ||
        (err.code === 'ECONNABORTED' ? 'Request timed out. Please try again.' : null) ||
        (err.code === 'ERR_NETWORK' ? 'Cannot connect to server. Make sure the backend is running on port 5000.' : null) ||
        'Something went wrong. Please try again.';
      setError(msg);
      setView('home');
    } finally {
      setLoading(false);
    }
  };



  // Navigation
  const handleNext = useCallback(() => {
    if (currentSlide < slides.length - 1) {
      setDirection('right');
      setCurrentSlide((s) => s + 1);
    }
  }, [currentSlide, slides.length]);

  const handlePrev = useCallback(() => {
    if (currentSlide > 0) {
      setDirection('left');
      setCurrentSlide((s) => s - 1);
    }
  }, [currentSlide]);

  const handleRestart = () => {
    setSlides([]);
    setCurrentSlide(0);
    setError(null);
    setView('home');
  };

  // Keyboard navigation
  useEffect(() => {
    if (view !== 'slides') return;

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [view, handleNext, handlePrev]);

  if (!user) return null; // Avoid flicker before redirect

  const shouldRenderChat =
    mode === 'code' || slides.some((slide) => /```/.test(slide.content));

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Decorative background orbs */}
      <div
        className="orb w-[500px] h-[500px] top-[-150px] right-[-150px]"
        style={{ background: 'radial-gradient(circle, #7c3aed, transparent)' }}
      />
      <div
        className="orb w-[400px] h-[400px] bottom-[-100px] left-[-100px]"
        style={{ background: 'radial-gradient(circle, #a21caf, transparent)' }}
      />
      <div
        className="orb w-[300px] h-[300px] top-[40%] left-[30%]"
        style={{ background: 'radial-gradient(circle, #4f46e5, transparent)', opacity: 0.15 }}
      />

      {/* Top Bar with Profile Link */}
      <div className="absolute top-0 right-0 p-4 z-50 flex items-center gap-4 animate-fade-in">
        <button 
          onClick={() => navigate('/profile')}
          className="btn-nav px-4 py-2 text-sm text-purple-300 hover:text-white flex items-center gap-2"
        >
          <div className="w-6 h-6 rounded-full bg-purple-600/50 flex items-center justify-center text-xs font-bold text-white border border-purple-400/30">
            {user.name.charAt(0).toUpperCase()}
          </div>
          {user.name}
        </button>
      </div>

      {/* Home / Input View */}
      {view === 'home' && (
        <InputBox
          onGenerate={handleGenerate}
          loading={loading}
          error={error}
          mode={mode}
          onModeChange={setMode}
        />
      )}

      {/* Loading View */}
      {view === 'loading' && (
        <div className="flex flex-col items-center justify-center min-h-screen px-4 relative z-10 animate-fade-in">
          <div className="glass-card w-full max-w-md p-10 text-center">
            <p className="text-purple-300 text-sm font-semibold tracking-widest uppercase mb-2">
              Processing your doubt
            </p>
            <p className="text-white text-xl font-bold mb-6 leading-snug">
              "{questionTitle}"
            </p>
            <Spinner />
          </div>
        </div>
      )}

      {/* Slides View */}
      {view === 'slides' && slides.length > 0 && shouldRenderChat && (
        <ChatView question={questionTitle} slides={slides} onRestart={handleRestart} />
      )}

      {view === 'slides' && slides.length > 0 && !shouldRenderChat && (
        <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12 relative z-10">
          {/* Header */}
          <div className="text-center mb-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 glass-card-inner px-4 py-2 mb-4">
              <span className="text-purple-300 text-xs font-semibold tracking-widest uppercase">
                Here's information
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white max-w-xl mx-auto leading-snug">
              {questionTitle}
            </h1>
          </div>

          {/* Slide Card */}
          <div className="w-full max-w-2xl">
            <SlideCard
              key={`slide-${currentSlide}`}
              slide={slides[currentSlide]}
              index={currentSlide}
              total={slides.length}
              direction={direction}
            />
          </div>

          {/* Navigation */}
          <NavigationControls
            current={currentSlide}
            total={slides.length}
            onPrev={handlePrev}
            onNext={handleNext}
            onRestart={handleRestart}
          />

          {/* Back to home */}
          <button
            id="btn-back-home"
            onClick={handleRestart}
            className="mt-6 text-purple-400/60 hover:text-purple-300 text-sm font-medium transition-colors duration-200 flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Ask a new question
          </button>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/app" element={<ExplainerApp />} />
        <Route path="/" element={<Navigate to="/app" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

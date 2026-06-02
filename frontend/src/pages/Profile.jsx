import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUserHistory } from '../services/api';
import Spinner from '../components/Spinner';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('clario_user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      
      // Fetch history
      getUserHistory(parsedUser._id || parsedUser.id)
        .then((data) => {
          setHistory(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error('Failed to load history:', err);
          setLoading(false);
        });
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('clario_user');
    navigate('/login');
  };

  const handleViewAgain = (item) => {
    navigate('/app', { state: { viewSlides: item } });
  };

  if (!user) return null;

  return (
    <div className="flex flex-col items-center min-h-screen px-4 py-12 relative z-10 w-full max-w-4xl mx-auto">
      {/* Decorative background orbs */}
      <div
        className="orb w-[500px] h-[500px] top-[-150px] right-[-150px] fixed -z-10"
        style={{ background: 'radial-gradient(circle, #7c3aed, transparent)' }}
      />
      <div
        className="orb w-[400px] h-[400px] bottom-[-100px] left-[-100px] fixed -z-10"
        style={{ background: 'radial-gradient(circle, #a21caf, transparent)' }}
      />

      <div className="flex w-full items-center justify-between mb-10 animate-fade-in">
        <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
          Your <span className="gradient-text">Profile</span>
        </h1>
        <div className="flex gap-3">
          <Link to="/app" className="btn-primary px-4 py-2 text-sm tracking-wide flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Ask Question
          </Link>
          <button 
            onClick={handleLogout} 
            className="btn-nav px-4 py-2 text-sm tracking-wide text-purple-300 hover:text-white flex items-center gap-2"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full animate-slide-up">
        {/* User Card */}
        <div className="glass-card p-8 text-center h-fit md:col-span-1">
          <div className="w-24 h-24 bg-purple-600/30 rounded-full flex items-center justify-center text-4xl font-extrabold text-white mx-auto mb-5 border-2 border-purple-400/50 shadow-xl shadow-purple-900/20">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <h2 className="text-2xl font-bold text-white mb-1">{user.name}</h2>
          <p className="text-purple-300 text-sm mb-6 bg-purple-900/20 py-1 px-3 rounded-full inline-block border border-purple-500/20">
            {user.email}
          </p>
        </div>

        {/* History Section */}
        <div className="glass-card p-6 md:col-span-2">
          <h3 className="text-xl font-bold text-white mb-4 border-b border-white/10 pb-3 flex items-center gap-2">
            <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Your Explanations
          </h3>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Spinner />
            </div>
          ) : history.length > 0 ? (
            <div className="flex flex-col gap-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
              {history.map((item) => (
                <div key={item._id} className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-colors flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-semibold truncate mb-1" title={item.question}>
                      {item.question}
                    </h4>
                    <p className="text-purple-300/60 text-xs">
                      {new Date(item.createdAt).toLocaleDateString()} • {item.slides.length} slides
                    </p>
                  </div>
                  <button 
                    onClick={() => handleViewAgain(item)}
                    className="shrink-0 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold py-2 px-4 rounded-lg transition-colors flex items-center gap-1 shadow-md shadow-purple-900/20"
                  >
                    View Again
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white/5 rounded-xl border border-white/5">
              <svg className="w-12 h-12 text-purple-400/50 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p className="text-purple-200 font-medium">No explanations yet.</p>
              <p className="text-purple-400/60 text-sm mt-1">Ask your first question to see it here!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

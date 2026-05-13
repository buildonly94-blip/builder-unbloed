import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Gamepad2, 
  X, 
  ChevronRight, 
  TrendingUp, 
  Puzzle,
  Zap,
  RotateCcw,
  ExternalLink,
  ShieldCheck,
  MousePointer2,
  Home,
  Flame,
  Clock,
  LayoutGrid,
  Shield
} from 'lucide-react';
import gamesData from './data/games.json';

export default function App() {
  const [selectedGame, setSelectedGame] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeTab, setActiveTab] = useState('home'); // 'home', 'games'
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);

  const featuredGame = gamesData[0] || null;

  useEffect(() => {
    const savedPlay = localStorage.getItem('recentlyPlayed');
    if (savedPlay) setRecentlyPlayed(JSON.parse(savedPlay));
  }, []);

  const addToRecent = (game) => {
    if (!game) return;
    const updated = [game, ...recentlyPlayed.filter(g => g && g.id !== game.id)].slice(0, 10);
    setRecentlyPlayed(updated);
    localStorage.setItem('recentlyPlayed', JSON.stringify(updated));
  };

  const filteredGames = useMemo(() => {
    return gamesData.filter(game => {
      const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          game.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || game.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const categories = useMemo(() => {
    return ['All', ...new Set(gamesData.map(g => g.category))];
  }, []);

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Puzzle': return <Puzzle size={16} />;
      case 'Action': return <Zap size={16} />;
      case 'Retro': return <RotateCcw size={16} />;
      case 'Shooter': return <ShieldCheck size={16} />;
      case 'Sports': return <TrendingUp size={16} />;
      case 'Casual': return <Gamepad2 size={16} />;
      default: return <LayoutGrid size={16} />;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-orange-600 selection:text-white">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,#ea580c33,transparent_50%)]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-600/10 blur-[150px] rounded-full" />
        <div className="absolute top-1/2 left-1/4 w-[300px] h-[300px] bg-orange-600/5 blur-[100px] rounded-full" />
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-[#050505]/80 backdrop-blur-2xl border-b border-white/5 py-4">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between gap-8">
          <div className="flex items-center gap-3 shrink-0 cursor-pointer" onClick={() => setActiveTab('home')}>
            <motion.div 
              whileHover={{ rotate: 180 }}
              className="bg-orange-600 p-2 rounded-xl"
            >
              <Gamepad2 size={24} />
            </motion.div>
            <h1 className="text-2xl font-black tracking-tighter uppercase italic">Luke's<span className="text-orange-600 ml-2">ARCADE</span></h1>
          </div>

          <div className="hidden lg:flex items-center gap-1 bg-white/5 p-1 rounded-2xl border border-white/5">
            {[
              { id: 'home', label: 'Home', icon: <Home size={18} /> },
              { id: 'games', label: 'Games', icon: <LayoutGrid size={18} /> },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
                  activeTab === tab.id ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20' : 'text-white/40 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex-1 max-w-md relative hidden md:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
            <input 
              type="text" 
              placeholder="Quick search games..."
              className="w-full bg-white/5 border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-orange-600/50 transition-all placeholder:text-white/10"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (activeTab !== 'games' && e.target.value) setActiveTab('games');
              }}
            />
          </div>

          <button className="sm:hidden p-3 bg-white/5 rounded-xl border border-white/5" onClick={() => setActiveTab('games')}>
            <LayoutGrid size={24} className="text-orange-600" />
          </button>
        </div>
      </nav>

      {/* Main Content Sections */}
      <AnimatePresence mode="wait">
        {activeTab === 'home' && (
          <motion.div 
            key="home"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="relative z-10"
          >
            {/* Featured Hero */}
            <section className="max-w-7xl mx-auto px-6 py-12">
               <div className="relative rounded-[3rem] overflow-hidden aspect-[21/9] flex items-center group shadow-2xl hover:shadow-orange-600/5 transition-all duration-700">
                  <img 
                    src={featuredGame?.thumbnail || "https://images.unsplash.com/photo-1614064548237-096f735f344f?auto=format&fit=crop&q=80&w=2000"} 
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                    alt="Featured"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />
                  <div className="relative z-10 px-12 max-w-2xl">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="bg-orange-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Featured</span>
                      {featuredGame && <span className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10">{featuredGame.category}</span>}
                    </div>
                    <h2 className="text-6xl md:text-7xl font-black mb-6 tracking-tighter leading-none italic uppercase">
                      {featuredGame ? (
                        <>
                          {featuredGame.title.split(' ')[0]}<br/>
                          <span className="text-orange-600">{featuredGame.title.split(' ').slice(1).join(' ')}</span>
                        </>
                      ) : (
                        <>GAME<br/><span className="text-orange-600">VAULT</span></>
                      )}
                    </h2>
                    <p className="text-white/60 mb-8 text-lg font-medium leading-relaxed max-w-md">
                      {featuredGame?.description || "Explore curated unblocked titles built for the modern gamer."}
                    </p>
                    <button 
                      onClick={() => {
                        if (featuredGame) {
                          setSelectedGame(featuredGame);
                          addToRecent(featuredGame);
                        } else {
                          setActiveTab('games');
                        }
                      }}
                      className="group flex items-center gap-3 bg-white text-black px-10 py-5 rounded-2xl font-black text-xs tracking-[0.2em] uppercase hover:bg-orange-600 hover:text-white transition-all shadow-xl"
                    >
                      {featuredGame ? 'PLAY NOW' : 'EXPLORE'} <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
               </div>
            </section>

            {/* Quick Stats */}
            <section className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
              {[
                { label: 'Total Games', value: gamesData.length, icon: <LayoutGrid className="text-orange-600" /> },
                { label: 'Active Users', value: '4.2k', icon: <TrendingUp className="text-green-500" /> },
                { label: 'Latency', value: '0.2ms', icon: <Zap className="text-yellow-500" /> },
                { label: 'Uptime', value: '100%', icon: <Shield className="text-blue-500" /> },
              ].map((stat, i) => (
                <div key={i} className="bg-white/5 border border-white/5 p-6 rounded-3xl flex items-center gap-4 hover:bg-white/10 transition-all cursor-default group">
                  <div className="p-3 bg-white/5 rounded-2xl group-hover:scale-110 transition-transform">{stat.icon}</div>
                  <div>
                    <div className="text-sm font-black text-white/20 uppercase tracking-widest mb-1">{stat.label}</div>
                    <div className="text-2xl font-black">{stat.value}</div>
                  </div>
                </div>
              ))}
            </section>

            {/* Trending Section */}
            <section className="max-w-7xl mx-auto px-6 mb-20">
              <div className="flex items-center gap-4 mb-10">
                <Flame size={24} className="text-orange-600" />
                <h3 className="text-3xl font-black italic uppercase tracking-tighter">Trending<span className="text-white/20">Now</span></h3>
                <div className="h-px flex-1 bg-white/5 ml-4" />
                <button onClick={() => setActiveTab('games')} className="text-xs font-black text-orange-600 uppercase tracking-widest hover:text-white transition-colors">See all Titles</button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                {(gamesData.length > 1 ? gamesData.slice(1, 5) : gamesData.slice(0, 1)).map(game => (
                  <GameCard key={game.id} game={game} onClick={() => { setSelectedGame(game); addToRecent(game); }} />
                ))}
                {gamesData.length === 0 && (
                  <div className="col-span-full py-20 flex flex-col items-center text-center">
                    <LayoutGrid size={48} className="text-white/5 mb-6" />
                    <p className="text-white/20 font-black uppercase tracking-widest text-sm">Archiving new titles...</p>
                  </div>
                )}
              </div>
            </section>

            {recentlyPlayed.length > 0 && (
              <section className="max-w-7xl mx-auto px-6 mb-20">
                <div className="flex items-center gap-4 mb-10">
                  <Clock size={24} className="text-blue-500" />
                  <h3 className="text-3xl font-black italic uppercase tracking-tighter">Recently<span className="text-white/20">Played</span></h3>
                  <div className="h-px flex-1 bg-white/5 ml-4" />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
                  {recentlyPlayed.map(game => (
                    <GameCard key={game.id} game={game} onClick={() => setSelectedGame(game)} />
                  ))}
                </div>
              </section>
            )}
          </motion.div>
        )}

        {activeTab === 'games' && (
          <motion.div 
             key="games"
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             className="max-w-7xl mx-auto px-6 py-12 relative z-10"
          >
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                <div>
                  <h2 className="text-5xl font-black italic uppercase tracking-tighter mb-2">Game<span className="text-orange-600">Vault</span></h2>
                  <p className="text-white/30 text-sm font-medium">Explore our premium collection of unblocked titles.</p>
                </div>
                <div className="flex items-center gap-3 overflow-x-auto pb-4 no-scrollbar">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-black tracking-widest uppercase transition-all whitespace-nowrap border ${
                        selectedCategory === category 
                          ? 'bg-orange-600 border-orange-500 text-white' 
                          : 'bg-white/5 border-white/5 text-white/40 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {getCategoryIcon(category)}
                      {category}
                    </button>
                  ))}
                </div>
             </div>

             <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {filteredGames.map(game => (
                  <GameCard key={game.id} game={game} onClick={() => { setSelectedGame(game); addToRecent(game); }} />
                ))}
             </div>

             {filteredGames.length === 0 && (
                <div className="py-32 text-center">
                  <div className="bg-white/5 w-24 h-24 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 border border-white/5 opacity-50">
                    <Search size={40} className="text-white/20" />
                  </div>
                  <h3 className="text-3xl font-black italic uppercase tracking-tighter mb-2">No matches found</h3>
                  <p className="text-white/30 text-sm max-w-sm mx-auto">Try refining your search or changing categories to find what you're looking for.</p>
                </div>
             )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Footer */}
      <footer className="border-t border-white/5 mt-32 py-24 px-6 relative z-10 bg-black/40 backdrop-blur-3xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-20">
          <div className="max-w-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-orange-600 p-2 rounded-xl"><Gamepad2 size={24} /></div>
              <h1 className="text-2xl font-black tracking-tighter uppercase italic">Luke's<span className="text-orange-600 ml-2">ARCADE</span></h1>
            </div>
            <p className="text-white/30 text-sm font-medium leading-relaxed italic">
              "Redefining the digital playground since 2024. Play anything, anywhere, unblocked."
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-12 sm:gap-24">
            <div>
              <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-600 mb-8">Lobby</h5>
              <ul className="space-y-4 text-sm font-bold text-white/30">
                <li><button onClick={() => setActiveTab('games')} className="hover:text-white transition-colors">Game Vault</button></li>
                <li><button onClick={() => setActiveTab('games')} className="hover:text-white transition-colors">Trending</button></li>
              </ul>
            </div>
            <div>
              <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-600 mb-8">Community</h5>
              <ul className="space-y-4 text-sm font-bold text-white/30">
                <li><a href="#" className="hover:text-white transition-colors">Discord Server</a></li>
                <li><a href="#" className="hover:text-white transition-colors">GitHub Repo</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Suggest Titles</a></li>
              </ul>
            </div>
          </div>
          
          <div className="bg-white/5 p-10 rounded-[3rem] border border-white/5 hidden lg:block">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]" />
              <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Server Core Online</span>
            </div>
            <div className="font-black text-4xl tracking-tighter italic">v4.0.2</div>
            <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest mt-2">Latest Stable Release</div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-20 flex flex-col sm:flex-row justify-between items-center gap-6 border-t border-white/5 mt-20 opacity-30 text-[10px] font-black uppercase tracking-[0.2em]">
          <span>© 2026 Luke's ARCADE Collective</span>
          <div className="flex gap-8">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Cookies</a>
          </div>
        </div>
      </footer>

      {/* Game Modal */}
      <AnimatePresence>
        {selectedGame && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-0 md:p-12 lg:p-20"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-[#050505] w-full h-full md:rounded-[3rem] overflow-hidden flex flex-col shadow-[0_0_150px_rgba(0,0,0,0.9)] border border-white/10"
            >
              <div className="px-8 py-5 border-b border-white/5 flex items-center justify-between bg-black/60 backdrop-blur-3xl">
                <div className="flex items-center gap-5">
                  <div className="bg-orange-600 p-2.5 rounded-2xl shadow-lg shadow-orange-600/20">
                    <Gamepad2 size={24} />
                  </div>
                  <div>
                    <h4 className="font-black italic uppercase tracking-tighter text-2xl leading-none mb-1">{selectedGame.title}</h4>
                    <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] font-sans">Level {Math.floor(Math.random() * 99) + 1} Active</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => window.open(selectedGame.url, '_blank')} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-white/5" title="Open Original Site">
                    <ExternalLink size={20} className="text-white/40" />
                  </button>
                  <button 
                    onClick={() => {
                        const iframe = document.getElementById('game-frame');
                        if (iframe) iframe.src = iframe.src;
                    }}
                    className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-white/5"
                    title="Soft Reboot"
                  >
                    <RotateCcw size={20} className="text-white/40" />
                  </button>
                  <div className="h-8 w-px bg-white/10 mx-2" />
                  <button 
                    onClick={() => setSelectedGame(null)}
                    className="group bg-red-500/10 hover:bg-red-500 p-3 rounded-2xl transition-all border border-red-500/20"
                  >
                    <X size={20} className="text-red-500 group-hover:text-white" />
                  </button>
                </div>
              </div>
              
              <div className="flex-1 bg-[#050505] relative">
                <iframe 
                  id="game-frame"
                  src={selectedGame.url} 
                  className="absolute inset-0 w-full h-full border-0"
                  allow="accelerometer *; ambient-light-sensor *; autoplay *; clipboard-read *; clipboard-write *; encrypted-media *; fullscreen *; geolocation *; gyroscope *; local-network-access *; magnetometer *; midi *; payment *; picture-in-picture *; screen-wake-lock *; speaker *; sync-xhr *; vibrate *; vr *; web-share *"
                  sandbox="allow-downloads allow-forms allow-modals allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts allow-top-navigation-by-user-activation allow-storage-access-by-user-activation"
                  title={selectedGame.title}
                  referrerPolicy="no-referrer"
                />
              </div>
              
              <div className="px-10 py-6 bg-black/80 backdrop-blur-md flex flex-col sm:flex-row justify-between items-center gap-8">
                <div className="flex items-center gap-6">
                   <div className="flex -space-x-3">
                      {[1,2,3].map(i => (
                        <div key={i} className={`w-8 h-8 rounded-full border-2 border-black bg-white/${i*10} backdrop-blur-sm`} />
                      ))}
                   </div>
                   <p className="text-[11px] font-bold text-white/30 tracking-wide uppercase italic">
                     Currently <span className="text-white">1,248 players</span> are active in this world.
                   </p>
                </div>
                <button 
                   onClick={() => setSelectedGame(null)}
                   className="w-full sm:w-auto bg-orange-600 hover:bg-orange-500 px-12 py-4 rounded-2xl font-black italic text-xs tracking-[0.2em] uppercase transition-all shadow-xl shadow-orange-600/30"
                >
                  Terminate Runtime
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function GameCard({ game, onClick }) {
  return (
    <motion.div
      whileHover={{ y: -12, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="group cursor-pointer"
    >
      <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-white/5 border border-white/5 group-hover:border-orange-600/40 transition-all duration-500 shadow-2xl">
        <img 
          src={game.thumbnail} 
          alt={game.title}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />
        
        <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
          <div className="flex items-center gap-2 mb-3 opacity-0 group-hover:opacity-100 transition-all delay-100 -translate-y-2 group-hover:translate-y-0">
             <span className="text-[10px] font-black text-orange-500 bg-orange-500/10 px-3 py-1 rounded-lg tracking-widest uppercase border border-orange-500/20 backdrop-blur-sm">
              {game.category}
            </span>
          </div>
          <h4 className="font-black text-xl italic uppercase tracking-tighter text-white group-hover:text-orange-500 transition-colors drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
            {game.title}
          </h4>
        </div>

        <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all scale-50 group-hover:scale-100 duration-500">
          <div className="bg-orange-600 p-3 rounded-2xl shadow-xl shadow-orange-600/50">
            <MousePointer2 size={20} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

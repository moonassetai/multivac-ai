import React, { useState } from 'react';
import { Search, ArrowRight, Zap, Code, Image as ImageIcon, Video } from 'lucide-react';

const LandingPage = ({ onEnter, onOpenDeck, onOpenMarketplace }) => {
    const [searchHover, setSearchHover] = useState(false);

    const handleLaunch = () => {
        const isElectron = /electron/i.test(navigator.userAgent);
        const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

        if (isElectron || isLocalhost) {
            onEnter();
        } else {
            // If on public web, maybe redirect to repo or show a "Download" toast
            window.open('https://github.com/moonassetai/multivac-ai', '_blank');
        }
    };

    return (
        <div className="min-h-screen bg-[#050b14] text-[#cbd5e1] font-['Inter'] selection:bg-[#e879f9] selection:text-white overflow-hidden relative flex flex-col">

            {/* Background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/10 via-[#050b14] to-[#050b14]"></div>
                <div className="absolute top-0 left-0 w-full h-full opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}></div>
            </div>

            {/* Navbar */}
            <nav className="relative z-50 w-full px-8 py-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                        <div className="w-4 h-4 rounded-full bg-indigo-500 shadow-[0_0_10px_#6366f1]"></div>
                    </div>
                    <span className="text-xl font-bold tracking-wider text-white font-['Rajdhani'] uppercase">MULTIVAC AI</span>
                </div>
                <div className="flex items-center gap-6">
                    <button
                        onClick={onOpenDeck}
                        className="text-gray-500 hover:text-white text-sm font-medium transition-colors"
                    >
                        Brand Deck
                    </button>
                    <button
                        onClick={handleLaunch}
                        className="text-gray-500 hover:text-white text-sm font-medium transition-colors"
                    >
                        Local App
                    </button>
                    <a
                        href="https://github.com/moonassetai/multivac-ai"
                        target="_blank"
                        rel="noreferrer"
                        className="text-gray-500 hover:text-white text-sm font-medium transition-colors"
                    >
                        GitHub
                    </a>
                </div>
            </nav>

            {/* Main Content - Centered */}
            <main className="flex-1 flex flex-col items-center justify-center relative z-10 px-4 -mt-20">

                {/* Logo / Badge */}
                <div className="mb-8 p-3 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm animate-fade-in">
                    <img src="/logo.png" alt="Logo" className="w-16 h-16 object-contain" onError={(e) => e.target.style.display = 'none'} />
                    {/* Fallback if logo img fails */}
                    <div className="hidden w-16 h-16 items-center justify-center text-3xl">🌌</div>
                </div>

                <h1 className="text-5xl md:text-7xl font-bold text-center text-white font-['Short_Stack'] tracking-tight mb-6 max-w-4xl leading-tight">
                    The Intelligence <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Marketplace</span>
                </h1>

                <p className="text-lg text-slate-400 max-w-2xl text-center mb-12 leading-relaxed font-light">
                    Discover and deploy trusted AI agents, tools, and workflows. <br className="hidden md:block" />
                    From coding assistants to autonomous game agents.
                </p>

                {/* Search Interaction */}
                <div
                    onClick={onOpenMarketplace}
                    onMouseEnter={() => setSearchHover(true)}
                    onMouseLeave={() => setSearchHover(false)}
                    className="w-full max-w-2xl relative group cursor-pointer"
                >
                    {/* Glow Effect behind search */}
                    <div className={`absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full opacity-20 blur-xl transition-opacity duration-500 ${searchHover ? 'opacity-40' : ''}`}></div>

                    <div className="relative bg-[#0f1420] border border-white/10 rounded-full p-2 flex items-center shadow-2xl transition-all duration-300 group-hover:border-white/20 group-hover:bg-[#131926]">
                        <div className="pl-6 pr-4 text-slate-500 group-hover:text-indigo-400 transition-colors">
                            <Search size={24} />
                        </div>
                        <div className="flex-1 py-3 text-lg text-slate-400 font-light select-none">
                            Find your next AI tool...
                        </div>
                        <button className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-full p-3 px-6 font-medium transition-colors shadow-lg flex items-center gap-2">
                            Explore <ArrowRight size={18} />
                        </button>
                    </div>

                    {/* Quick Tags underneath */}
                    <div className="flex flex-wrap justify-center gap-2 mt-6 opacity-60">
                        <span className="text-xs text-slate-500 uppercase tracking-widest mr-2 py-1">Trending:</span>
                        {['Chatbots', 'Coding', 'Image Gen', 'Productivity'].map(tag => (
                            <span key={tag} className="px-3 py-1 rounded-full bg-white/5 border border-white/5 text-xs text-slate-400">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>

            </main>

            {/* Footer Minimal */}
            <footer className="relative z-10 w-full px-8 py-6 flex items-center justify-between text-xs text-slate-600 font-mono">
                <div>&copy; 2026 Multivac AI</div>
                <div className="flex items-center gap-4">
                    <span>v2.5.0-beta</span>
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span>Systems Operational</span>
                </div>
            </footer>

        </div>
    );
};

export default LandingPage;

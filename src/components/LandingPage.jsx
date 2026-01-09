import React from 'react';
import { ArrowRight, Download, Terminal, Zap, Cpu, Globe, Newspaper, Gamepad, Mic, Layers, Box, Hand, Bot, Check, X, Calendar, Rocket, Clock } from 'lucide-react';

const LandingPage = ({ onEnter, onOpenDeck, onOpenMarketplace }) => {
    const handleLaunch = () => {
        const isElectron = /electron/i.test(navigator.userAgent);
        const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

        // Allow launch if in Electron OR Localhost (dev mode)
        if (isElectron || isLocalhost) {
            onEnter();
        } else {
            const downloadLink = document.getElementById('download-link');
            if (downloadLink) {
                downloadLink.scrollIntoView({ behavior: 'smooth', block: 'center' });
                downloadLink.classList.add('ring-4', 'ring-[#22d3ee]/50');
                setTimeout(() => downloadLink.classList.remove('ring-4', 'ring-[#22d3ee]/50'), 1000);
            }
        }
    };

    return (
        <div className="min-h-screen bg-[#050b14] text-[#cbd5e1] font-['Inter'] selection:bg-[#e879f9] selection:text-white overflow-x-hidden">

            {/* Global Background Effects */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(125deg,rgba(6,182,212,0.05)_0%,transparent_40%),radial-gradient(circle_at_90%_10%,rgba(236,72,153,0.1)_0%,transparent_50%)]"></div>
                <div className="absolute top-0 left-0 w-full h-full opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}></div>
            </div>

            {/* Navbar */}
            <nav className="fixed top-0 w-full z-50 flex items-center justify-between px-8 py-6 backdrop-blur-md border-b border-white/5 bg-[#0f172a]/80">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden shadow-[0_0_15px_rgba(34,211,238,0.5)] border border-[#22d3ee]/30">
                        <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-2xl font-bold tracking-wider text-white font-['Rajdhani'] uppercase">MULTIVAC AI</span>
                </div>
                <div className="flex items-center gap-6">
                    <button
                        onClick={onOpenDeck}
                        className="text-gray-400 hover:text-white font-['Rajdhani'] font-semibold tracking-wider transition-colors uppercase"
                    >
                        Brand Deck
                    </button>
                    <button
                        onClick={onOpenMarketplace}
                        className="text-gray-400 hover:text-[#e879f9] font-['Rajdhani'] font-semibold tracking-wider transition-colors uppercase flex items-center gap-2"
                    >
                        Discovery <span className="text-xs bg-[#e879f9]/20 text-[#e879f9] px-1.5 py-0.5 rounded border border-[#e879f9]/30">NEW</span>
                    </button>
                    <button
                        onClick={handleLaunch}
                        className="bg-[#22d3ee] hover:bg-[#06b6d4] text-[#050b14] font-bold font-['Rajdhani'] tracking-wider px-6 py-2 rounded transition-all hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] uppercase"
                    >
                        Launch System
                    </button>
                </div>
            </nav>

            {/* Content Container (Standard Width) */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-20 flex flex-col gap-24">

                {/* SLIDE 1: HERO */}
                <section className="min-h-[80vh] flex flex-col items-center justify-center text-center relative overflow-hidden rounded-2xl border border-white/10 bg-[#0f172a] shadow-[0_0_50px_rgba(139,92,246,0.15)] bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1280&h=720&fit=crop')" }}>
                    <div className="absolute inset-0 bg-[#050b14]/80 backdrop-blur-sm"></div>
                    <div className="relative z-10 px-8 py-16 max-w-4xl mx-auto">
                        <div className="inline-block bg-[#e879f9]/10 border border-[#e879f9] text-[#e879f9] px-4 py-2 rounded font-['Rajdhani'] font-bold tracking-widest mb-6 animate-pulse">
                            OFFICIAL LAUNCH
                        </div>
                        <h1 className="text-7xl md:text-9xl font-bold font-['Rajdhani'] uppercase tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#22d3ee] to-[#e879f9] drop-shadow-[0_0_30px_rgba(34,211,238,0.3)]">
                            MULTIVAC AI
                        </h1>
                        <p className="text-2xl md:text-3xl text-[#e879f9] font-['Rajdhani'] font-semibold mb-8">
                            Bridging AI, Gaming, and Vision in a Single Interface
                        </p>
                        <p className="text-lg text-gray-400 italic font-light max-w-2xl mx-auto border-t border-white/10 pt-6">
                            "The last question was asked for the first time, half in jest, on May 31, 2026..." — Isaac Asimov
                        </p>
                    </div>
                </section>

                {/* SLIDE 2: THE PROBLEM */}
                <SlideContainer title="The Problem">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <ul className="space-y-6">
                            {[
                                { title: "Limited Action", text: "Current AI assistants can answer questions but cannot navigate complex game engines or OS tasks." },
                                { title: "Fragmented Workflow", text: "Game devs switch between Blender, Unity, Discord, and Browsers constantly." },
                                { title: "No Autonomous Agents", text: "You have to play alone or script complex bots manually." },
                                { title: "Cloud Dependency", text: "High latency cloud AI is too slow for real-time gaming or asset generation." }
                            ].map((item, i) => (
                                <li key={i} className="flex gap-4 items-start">
                                    <Gamepad className="text-[#e879f9] mt-1 shrink-0" size={20} />
                                    <div>
                                        <strong className="text-white block font-['Rajdhani'] text-xl">{item.title}:</strong>
                                        <span className="text-gray-400">{item.text}</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl h-[400px]">
                            <img src="https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=600&h=400&fit=crop" alt="Frustrated Gamer" className="w-full h-full object-cover" />
                        </div>
                    </div>
                </SlideContainer>

                {/* SLIDE 3: SOLUTION */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-0 rounded-2xl overflow-hidden border border-white/10 bg-[#0f172a] shadow-2xl">
                    <div className="p-12 md:p-16 flex flex-col justify-center">
                        <h2 className="text-5xl font-bold font-['Rajdhani'] uppercase mb-8 border-l-4 border-[#e879f9] pl-6 text-white">The Solution</h2>
                        <h3 className="text-3xl text-[#22d3ee] font-['Rajdhani'] font-semibold mb-4">Multivac AI: Gaming Edition</h3>
                        <p className="text-lg text-gray-400 mb-6 leading-relaxed">
                            A sophisticated local entity evolving from Asimov's supercomputer. It combines Gemini 2.5 Native Audio with precise game control and vision.
                        </p>
                        <p className="text-lg text-gray-300 leading-relaxed border-l-2 border-[#22d3ee] pl-4">
                            <strong className="text-white">Universal Game Master:</strong> Whether managing your RGB environment, generating assets on the fly, or playing alongside you as an AI Agent, Multivac executes complex gaming workflows.
                        </p>
                    </div>
                    <div className="h-[400px] md:h-auto relative">
                        <img src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=640&h=720&fit=crop" alt="Solution" className="absolute inset-0 w-full h-full object-cover" />
                    </div>
                </div>

                {/* SLIDE 4 & 5: CAPABILITIES */}
                <SlideContainer title="Core Capabilities">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <Tile icon={<Mic />} title="Multivac Voice" text="Real-time, low-latency command channel. Shout commands in-game without alt-tabbing." />
                        <Tile icon={<Terminal />} title="Input Control" text="System-wide keyboard and mouse automation. It can execute complex combos or manage inventory." />
                        <Tile icon={<Layers />} title="Window Mgmt" text="Launch games, resize streams, and focus Discord via natural language commands." />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Tile icon={<Box />} title="Asset Gen" text="Generate 3D game assets, textures, and simple levels via voice prompts directly to STL/OBJ." />
                        <Tile icon={<Hand />} title="Vision & Gesture" text="'Minority Report' style HUD control via webcam. Pinch to mute, swipe to switch scenes." />
                        <Tile icon={<Bot />} title="AI Game Agent" text="NEW: Deploy an autonomous AI agent to test levels or play coop as a smart NPC." highlight />
                    </div>
                </SlideContainer>

                {/* SLIDE 6: DEMO FLOW */}
                <SlideContainer title="From Concept to Level">
                    <div className="relative pt-12 pb-8">
                        {/* Line */}
                        <div className="absolute top-[55px] left-[50px] right-[50px] h-[2px] bg-white/10"></div>
                        <div className="absolute top-[55px] left-[50px] w-[70%] h-[2px] bg-gradient-to-r from-[#22d3ee] to-[#e879f9] shadow-[0_0_10px_#e879f9]"></div>

                        <div className="flex flex-col md:flex-row justify-between relative z-10 gap-8">
                            <TimelineItem step="1" title="Voice Command" text='"Create a sci-fi corridor asset."' color="#22d3ee" />
                            <TimelineItem step="2" title="Generation" text="Multivac generates 3D mesh." color="#e879f9" />
                            <TimelineItem step="3" title="Iteration" text='"Add battle damage textures."' color="#22d3ee" />
                            <TimelineItem step="4" title="Deployment" text="Exports to Unity/Unreal Engine." color="#e879f9" />
                        </div>
                    </div>
                </SlideContainer>

                {/* SLIDE 9: COMPETITIVE LANDSCAPE */}
                <SlideContainer title="Competitive Landscape">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-separate border-spacing-y-2">
                            <thead>
                                <tr>
                                    <th className="p-4 text-gray-400 font-['Rajdhani'] uppercase tracking-wider border-b border-white/10">Feature</th>
                                    <th className="p-4 text-[#22d3ee] font-['Rajdhani'] uppercase tracking-wider border-b border-white/10 font-bold">Multivac AI</th>
                                    <th className="p-4 text-gray-500 font-['Rajdhani'] uppercase tracking-wider border-b border-white/10">Cloud AI</th>
                                    <th className="p-4 text-gray-500 font-['Rajdhani'] uppercase tracking-wider border-b border-white/10">Engine</th>
                                </tr>
                            </thead>
                            <tbody>
                                <TableRow feature="Full OS Control" multivac={true} cloud={false} engine={false} />
                                <TableRow feature="Voice-to-Asset" multivac={true} cloud={false} engine={false} />
                                <TableRow feature="Gaming Agents" multivac={true} cloud={false} engine={false} />
                                <TableRow feature="Multi-Modal" multivac={true} cloud={true} engine={false} />
                            </tbody>
                        </table>
                    </div>
                </SlideContainer>

                {/* SLIDE 11: ROADMAP */}
                <SlideContainer title="Roadmap">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white/5 p-8 rounded-2xl border border-white/10">
                            <h3 className="text-2xl font-['Rajdhani'] font-bold text-white mb-6 flex items-center gap-3">
                                <Calendar className="text-[#22d3ee]" /> Near Term
                            </h3>
                            <ul className="space-y-4 text-gray-300">
                                <li className="flex items-center gap-2"><div className="w-2 h-2 bg-[#22d3ee] rounded-full"></div>Autonomous Gaming Agent</li>
                                <li className="flex items-center gap-2"><div className="w-2 h-2 bg-[#22d3ee] rounded-full"></div>Mobile Companion App</li>
                                <li className="flex items-center gap-2"><div className="w-2 h-2 bg-[#22d3ee] rounded-full"></div>Twitch/Stream Integration</li>
                            </ul>
                        </div>
                        <div className="bg-white/5 p-8 rounded-2xl border border-white/10">
                            <h3 className="text-2xl font-['Rajdhani'] font-bold text-white mb-6 flex items-center gap-3">
                                <Rocket className="text-[#e879f9]" /> Future Vision
                            </h3>
                            <ul className="space-y-4 text-gray-300">
                                <li className="flex items-center gap-2"><div className="w-2 h-2 bg-[#e879f9] rounded-full"></div>Procedural World Gen</li>
                                <li className="flex items-center gap-2"><div className="w-2 h-2 bg-[#e879f9] rounded-full"></div>Plugin Marketplace</li>
                                <li className="flex items-center gap-2"><div className="w-2 h-2 bg-[#e879f9] rounded-full"></div>Voice Cloning for NPCs</li>
                            </ul>
                        </div>
                    </div>
                </SlideContainer>

                {/* CALL TO ACTION */}
                <section className="relative rounded-2xl overflow-hidden shadow-2xl text-center py-24 px-8 border border-white/20">
                    <div className="absolute inset-0">
                        <img src="https://images.unsplash.com/photo-1614294148960-9aa740632a87?w=1280&h=720&fit=crop" className="w-full h-full object-cover" alt="Background" />
                        <div className="absolute inset-0 bg-[#050b14]/90 backdrop-blur-sm"></div>
                    </div>
                    <div className="relative z-10 max-w-2xl mx-auto">
                        <h2 className="text-5xl md:text-6xl font-bold font-['Rajdhani'] font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#22d3ee] to-[#e879f9]">
                            Experience the Future
                        </h2>
                        <p className="text-xl text-gray-300 mb-8">Clone the repo. Start the engine. Meet your new coop partner.</p>

                        <div className="bg-black/50 border border-[#22d3ee]/30 rounded p-4 font-mono text-[#22d3ee] inline-block mb-10">
                            &gt; .\start_multivac.bat
                        </div>
                        <br />

                        <div className="flex flex-col md:flex-row gap-6 justify-center">
                            <a
                                href="https://github.com/moonassetai/multivac-ai"
                                target="_blank"
                                id="download-link"
                                className="bg-transparent border-2 border-white/20 hover:border-white text-white px-8 py-4 rounded-full font-['Rajdhani'] font-bold text-xl uppercase tracking-widest transition-all hover:bg-white/5"
                            >
                                <div className="flex items-center gap-2">
                                    <Download size={20} /> GitHub
                                </div>
                            </a>
                            <button
                                onClick={handleLaunch}
                                className="bg-gradient-to-r from-[#22d3ee] to-[#e879f9] text-white px-10 py-4 rounded-full font-['Rajdhani'] font-bold text-xl uppercase tracking-widest shadow-[0_10px_20px_rgba(232,121,249,0.3)] hover:scale-105 transition-transform"
                            >
                                <div className="flex items-center gap-2">
                                    Launch Date: May 31, 2026
                                </div>
                            </button>
                        </div>

                        <p className="text-gray-500 mt-12 font-['Rajdhani'] uppercase tracking-widest">Built by OKI Moon | moonassetai</p>
                        {/* SLIDE 12: THE LAST QUESTION STORY */}
                        <section className="max-w-4xl mx-auto mb-24 px-6 md:px-0">
                            <div className="bg-[#0f172a] rounded-2xl border border-white/10 p-8 shadow-2xl relative overflow-hidden group hover:border-[#22d3ee]/30 transition-colors">
                                <div className="absolute inset-0 bg-gradient-to-br from-[#22d3ee]/5 to-transparent pointer-events-none"></div>

                                <div className="relative z-10 text-center mb-8">
                                    <h2 className="text-3xl font-['Rajdhani'] font-bold text-white mb-2 flex items-center justify-center gap-3">
                                        <Clock className="text-[#e879f9] animate-pulse" /> The Origin Story
                                    </h2>
                                    <p className="text-gray-400 text-sm max-w-lg mx-auto">
                                        "The Last Question" by Isaac Asimov — The philosophical foundation of Multivac.
                                    </p>
                                </div>

                                <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-lg border border-white/10 bg-black">
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        src="https://www.youtube.com/embed/BmPcWuv6Mcw?si=oogIfuGrNVrTeTO9"
                                        title="YouTube video player"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        referrerPolicy="strict-origin-when-cross-origin"
                                        allowFullScreen
                                        className="absolute inset-0 w-full h-full"
                                    ></iframe>
                                </div>
                            </div>
                        </section>

                    </div>
                </section>

            </div>

            <footer className="text-center py-8 text-gray-600 border-t border-white/5 mt-12 font-mono text-xs">
                &copy; 2026 Multivac AI. All systems nominal.
            </footer>
        </div>
    );
};

// --- Sub-Components ---

const SlideContainer = ({ title, children }) => (
    <section className="bg-[#0f172a] rounded-2xl border border-white/10 p-8 md:p-16 shadow-[0_0_50px_rgba(139,92,246,0.15)] relative overflow-hidden">
        {/* Decorative Grid BG */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='1'/%3E%3Ccircle cx='13' cy='13' r='1'/%3E%3C/g%3E%3C/svg%3E")` }}></div>
        <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-['Rajdhani'] font-bold uppercase mb-12 text-white border-l-4 border-[#e879f9] pl-6">
                {title}
            </h2>
            {children}
        </div>
    </section>
);

const Tile = ({ icon, title, text, highlight }) => (
    <div className={`
        relative p-8 rounded-2xl border transition-all duration-300 group overflow-hidden
        ${highlight
            ? 'bg-gradient-to-br from-[#22d3ee]/10 to-[#e879f9]/10 border-[#e879f9] shadow-[0_0_30px_rgba(232,121,249,0.1)]'
            : 'bg-[#1e293b]/50 border-white/5 hover:border-[#22d3ee]/50'}
    `}>
        {/* Top Border Gradient */}
        <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-[#22d3ee] to-[#e879f9]"></div>

        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#22d3ee] to-[#3b82f6] flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform">
            {React.cloneElement(icon, { size: 32 })}
        </div>
        <h3 className="text-2xl font-['Rajdhani'] font-bold text-white mb-4">{title}</h3>
        <p className="text-gray-400 group-hover:text-gray-300">{text}</p>
    </div>
);

const TimelineItem = ({ step, title, text, color }) => (
    <div className="flex-1 flex flex-col items-center text-center relative z-10">
        <div
            className="w-8 h-8 rounded-full bg-[#0f172a] border-2 mb-6 shadow-[0_0_0_4px_rgba(255,255,255,0.05)] flex items-center justify-center font-bold text-xs"
            style={{ borderColor: color, color: color, boxShadow: `0 0 0 4px ${color}33` }}
        >
            {step}
        </div>
        <h3 className="text-2xl font-['Rajdhani'] font-semibold text-white mb-2">{title}</h3>
        <p className="text-gray-400">{text}</p>
    </div>
);

const TableRow = ({ feature, multivac, cloud, engine }) => (
    <tr className="group hover:bg-[#22d3ee]/5 transition-colors">
        <td className="p-4 border-b border-white/5 text-white font-semibold rounded-l-lg">{feature}</td>
        <td className="p-4 border-b border-white/5 text-center bg-[#22d3ee]/5 border-x border-[#22d3ee]/10">
            {multivac ? <Check className="mx-auto text-[#22d3ee]" /> : <X className="mx-auto text-red-500/50" />}
        </td>
        <td className="p-4 border-b border-white/5 text-center">
            {cloud ? <Check className="mx-auto text-gray-500" /> : <X className="mx-auto text-gray-600" />}
        </td>
        <td className="p-4 border-b border-white/5 text-center rounded-r-lg">
            {engine ? <Check className="mx-auto text-gray-500" /> : <X className="mx-auto text-gray-600" />}
        </td>
    </tr>
);

export default LandingPage;

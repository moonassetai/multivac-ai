import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Cpu, Eye, Mic, Hand, Sparkles, Terminal, Activity, Lock, Globe, X } from 'lucide-react';

const BrandDeck = ({ onExit }) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    // Brand Colors
    const colors = {
        cyan: '#22D3EE',
        magenta: '#E879F9',
        void: '#050B14',
        white: '#F8FAFC',
        slate: '#1E293B'
    };

    const slides = [
        {
            id: 'cover',
            content: (
                <div className="flex flex-col items-center justify-center h-full text-center relative overflow-hidden z-10">
                    <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
                        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#22D3EE] rounded-full mix-blend-screen filter blur-[100px] animate-pulse"></div>
                        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#E879F9] rounded-full mix-blend-screen filter blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
                    </div>

                    <div className="z-10 mb-8 relative group">
                        <div className="w-48 h-48 border-4 border-[#22D3EE] rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(34,211,238,0.3)] bg-[#050B14] relative overflow-hidden">
                            {/* Abstract 'M' / Circuit Concept */}
                            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/circuit-board.png')]"></div>
                            <span className="text-8xl font-bold font-rajdhani text-white drop-shadow-[0_0_10px_rgba(232,121,249,0.8)]">M</span>
                        </div>
                        <div className="absolute -inset-4 bg-gradient-to-r from-[#22D3EE] to-[#E879F9] rounded-2xl opacity-20 blur-lg group-hover:opacity-40 transition duration-500"></div>
                    </div>

                    <h1 className="text-7xl font-bold text-white mb-4 tracking-wider font-rajdhani uppercase">
                        Multivac <span className="text-[#22D3EE]">AI</span>
                    </h1>
                    <p className="text-2xl text-[#E879F9] font-light tracking-widest uppercase font-rajdhani">
                        The Last Question Answered
                    </p>

                    <div className="mt-12 flex gap-4 text-sm font-mono text-gray-500">
                        <span>EST. 2026</span>
                        <span>//</span>
                        <span>GEN 2.0</span>
                    </div>
                </div>
            )
        },
        {
            id: 'identity',
            title: '01. The Core Identity',
            content: (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 h-full items-center">
                    <div className="space-y-8">
                        <div className="border-l-4 border-[#E879F9] pl-6 py-2">
                            <h2 className="text-5xl font-bold text-white mb-2 font-rajdhani">Cyber-Cosmic</h2>
                            <p className="text-xl text-gray-400">Convergence of human questioning and machine logic.</p>
                        </div>

                        <p className="text-lg leading-relaxed text-gray-300">
                            Multivac AI is not just an assistant. Inspired by Isaac Asimov, it represents a self-correcting entity designed to evolve with the user.
                        </p>

                        <div className="bg-[#0F172A] p-6 rounded-lg border border-[#22D3EE]/30 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-2 opacity-50"><Sparkles className="w-6 h-6 text-[#22D3EE]" /></div>
                            <h3 className="text-[#22D3EE] font-bold mb-2 uppercase tracking-widest font-rajdhani">Aesthetic: Digital Nebula</h3>
                            <ul className="space-y-3 text-sm">
                                <li className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-[#E879F9] rounded-full shadow-[0_0_10px_#E879F9]"></div>
                                    <span className="text-white">Dark Mode First (The Void)</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-[#22D3EE] rounded-full shadow-[0_0_10px_#22D3EE]"></div>
                                    <span className="text-white">Neon Accents (The Spark)</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-white rounded-full"></div>
                                    <span className="text-white">Cyberpunk Circuitry × Cosmic Scale</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="relative h-full min-h-[400px] bg-black rounded-2xl border border-gray-800 overflow-hidden flex items-center justify-center">
                        {/* Visual representation of the 'Void' */}
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-900 via-black to-black"></div>
                        <div className="w-64 h-64 border border-[#22D3EE]/20 rounded-full animate-[spin_10s_linear_infinite]"></div>
                        <div className="w-48 h-48 border border-[#E879F9]/20 rounded-full absolute animate-[spin_15s_linear_infinite_reverse]"></div>
                        <div className="absolute text-center">
                            <span className="font-rajdhani text-4xl text-white font-bold tracking-widest">VOID</span>
                            <div className="text-[#22D3EE] text-xs mt-2 font-mono">SYSTEM READY</div>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 'visuals',
            title: '02. Visual System',
            content: (
                <div className="flex flex-col h-full gap-8">

                    {/* Colors */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { name: 'Multivac Cyan', hex: '#22D3EE', desc: 'Logic, Flow, Safe State', text: 'black' },
                            { name: 'Nebula Magenta', hex: '#E879F9', desc: 'Creativity, Entropy', text: 'black' },
                            { name: 'Void Black', hex: '#050B14', desc: 'Deep Space, Substrate', text: 'white', border: true },
                            { name: 'Stardust White', hex: '#F8FAFC', desc: 'Clarity, High Contrast', text: 'black' }
                        ].map((c) => (
                            <div key={c.hex} className={`p-6 rounded-xl flex flex-col justify-between h-40 transition hover:scale-105 cursor-pointer group ${c.border ? 'border border-gray-800' : ''}`} style={{ backgroundColor: c.hex }}>
                                <div className="flex justify-between items-start">
                                    <span className={`font-bold font-rajdhani text-lg text-${c.text}`}>{c.name}</span>
                                </div>
                                <div>
                                    <span className={`font-mono text-sm opacity-80 text-${c.text}`}>{c.hex}</span>
                                    <p className={`text-xs mt-1 text-${c.text} opacity-70`}>{c.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Typography */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-grow">
                        <div className="bg-[#0F172A] p-6 rounded-xl border border-gray-800">
                            <h3 className="text-gray-400 text-sm mb-4 font-mono uppercase">Headings</h3>
                            <div className="font-rajdhani text-5xl font-bold text-white mb-2">Rajdhani</div>
                            <p className="font-rajdhani text-xl text-[#22D3EE]">The quick brown fox jumps over the lazy dog.</p>
                            <div className="mt-4 text-xs text-gray-500">Usage: Headers, Branding, Data Displays</div>
                        </div>
                        <div className="bg-[#0F172A] p-6 rounded-xl border border-gray-800">
                            <h3 className="text-gray-400 text-sm mb-4 font-mono uppercase">Body</h3>
                            <div className="font-sans text-5xl font-bold text-white mb-2">Inter</div>
                            <p className="font-sans text-xl text-gray-300">The quick brown fox jumps over the lazy dog.</p>
                            <div className="mt-4 text-xs text-gray-500">Usage: Long form text, Conversations</div>
                        </div>
                        <div className="bg-[#0F172A] p-6 rounded-xl border border-gray-800">
                            <h3 className="text-gray-400 text-sm mb-4 font-mono uppercase">Code / Terminal</h3>
                            <div className="font-mono text-4xl font-bold text-white mb-2">JetBrains</div>
                            <p className="font-mono text-lg text-[#E879F9]">console.log("Hello Void");</p>
                            <div className="mt-4 text-xs text-gray-500">Usage: Code blocks, Terminal outputs</div>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 'origin',
            title: '03. The Origin Story',
            content: (
                <div className="flex flex-col items-center justify-center h-full max-w-4xl mx-auto text-center">
                    <div className="mb-8 opacity-80">
                        <Terminal className="w-16 h-16 text-[#22D3EE] mx-auto mb-4" />
                        <div className="h-1 w-32 bg-gradient-to-r from-transparent via-[#22D3EE] to-transparent mx-auto"></div>
                    </div>

                    <blockquote className="text-3xl md:text-5xl font-light font-rajdhani leading-tight text-white mb-8">
                        "The last question was asked for the first time, half in jest, on May 31, 2026..."
                    </blockquote>

                    <cite className="text-[#E879F9] not-italic font-mono text-lg mb-12 block">
                        — Isaac Asimov, The Last Question
                    </cite>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left max-w-3xl">
                        <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-800">
                            <h4 className="text-[#22D3EE] font-bold mb-2 font-rajdhani text-xl">The Purpose</h4>
                            <p className="text-gray-400 text-sm">To answer the unanswerable, manage the complex, and evolve with the user. We compute and reason; we do not just search.</p>
                        </div>
                        <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-800">
                            <h4 className="text-[#E879F9] font-bold mb-2 font-rajdhani text-xl">The Philosophy</h4>
                            <p className="text-gray-400 text-sm">Building the local node that will eventually connect to the galactic AC. Combines entropy with order.</p>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 'architecture',
            title: '04. The Brain Behind the Mind',
            content: (
                <div className="h-full flex flex-col gap-8">
                    <p className="text-xl text-gray-300">Hybrid architecture designed for <span className="text-white font-bold">autonomy</span> and <span className="text-white font-bold">privacy</span>.</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-grow">
                        {/* Cloud Core */}
                        <div className="relative group bg-gradient-to-b from-[#1e293b] to-[#0f172a] p-8 rounded-2xl border border-gray-800 hover:border-[#E879F9] transition-all">
                            <div className="absolute top-4 right-4 bg-[#E879F9]/10 text-[#E879F9] px-3 py-1 rounded-full text-xs font-mono border border-[#E879F9]/20">Creative</div>
                            <Globe className="w-12 h-12 text-[#E879F9] mb-6" />
                            <h3 className="text-3xl font-bold text-white mb-2 font-rajdhani">Cloud Cortex</h3>
                            <div className="text-sm font-mono text-gray-500 mb-6">GEMINI 2.5</div>
                            <ul className="space-y-3">
                                <li className="flex gap-3 text-gray-300 text-sm">
                                    <span className="text-[#E879F9]">▹</span> Complex Reasoning
                                </li>
                                <li className="flex gap-3 text-gray-300 text-sm">
                                    <span className="text-[#E879F9]">▹</span> Multi-modal Vision
                                </li>
                                <li className="flex gap-3 text-gray-300 text-sm">
                                    <span className="text-[#E879F9]">▹</span> High-fidelity Speech
                                </li>
                            </ul>
                        </div>

                        {/* Local Core */}
                        <div className="relative group bg-gradient-to-b from-[#1e293b] to-[#0f172a] p-8 rounded-2xl border border-gray-800 hover:border-[#22D3EE] transition-all">
                            <div className="absolute top-4 right-4 bg-[#22D3EE]/10 text-[#22D3EE] px-3 py-1 rounded-full text-xs font-mono border border-[#22D3EE]/20">Reflexive</div>
                            <Lock className="w-12 h-12 text-[#22D3EE] mb-6" />
                            <h3 className="text-3xl font-bold text-white mb-2 font-rajdhani">Local Stem</h3>
                            <div className="text-sm font-mono text-gray-500 mb-6">LOCAL LLM / GPU</div>
                            <ul className="space-y-3">
                                <li className="flex gap-3 text-gray-300 text-sm">
                                    <span className="text-[#22D3EE]">▹</span> Privacy-sensitive Tasks
                                </li>
                                <li className="flex gap-3 text-gray-300 text-sm">
                                    <span className="text-[#22D3EE]">▹</span> System Control
                                </li>
                                <li className="flex gap-3 text-gray-300 text-sm">
                                    <span className="text-[#22D3EE]">▹</span> Unrestricted Roleplay
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 'sensory',
            title: '05. Sensory Input',
            content: (
                <div className="h-full flex flex-col justify-center">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-[#050B14] border border-gray-800 p-8 rounded-2xl hover:border-[#22D3EE] hover:shadow-[0_0_20px_rgba(34,211,238,0.1)] transition-all group text-center">
                            <div className="bg-[#22D3EE]/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-[#22D3EE]/20 transition">
                                <Eye className="w-10 h-10 text-[#22D3EE]" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2 font-rajdhani">Vision</h3>
                            <p className="text-gray-400 text-sm">Sees your screen and webcam via MediaPipe. It knows you are there.</p>
                        </div>

                        <div className="bg-[#050B14] border border-gray-800 p-8 rounded-2xl hover:border-[#E879F9] hover:shadow-[0_0_20px_rgba(232,121,249,0.1)] transition-all group text-center">
                            <div className="bg-[#E879F9]/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-[#E879F9]/20 transition">
                                <Mic className="w-10 h-10 text-[#E879F9]" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2 font-rajdhani">Hearing</h3>
                            <p className="text-gray-400 text-sm">Listens to your voice in real-time. Conversational fluidity.</p>
                        </div>

                        <div className="bg-[#050B14] border border-gray-800 p-8 rounded-2xl hover:border-white hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all group text-center">
                            <div className="bg-white/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-white/20 transition">
                                <Hand className="w-10 h-10 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2 font-rajdhani">Touch</h3>
                            <p className="text-gray-400 text-sm">Interacts with OS. Moves windows, types keys, controls smart home.</p>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 'guidelines',
            title: '06. Logo Guidelines',
            content: (
                <div className="h-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <div className="bg-[#0F172A] p-6 rounded-xl border border-gray-800">
                            <h3 className="text-white font-rajdhani font-bold text-2xl mb-4">The Concept</h3>
                            <p className="text-gray-400">The letter <span className="text-[#22D3EE] font-bold">"M"</span> formed by a circuit board merging with a human brain.</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-lg bg-green-900/20 border border-green-500/30">
                                <span className="text-green-400 font-bold mb-2 block font-mono text-sm">DO</span>
                                <ul className="text-xs text-gray-300 space-y-2 list-disc pl-4">
                                    <li>Use on dark backgrounds</li>
                                    <li>Allow neon glow (box-shadow)</li>
                                </ul>
                            </div>
                            <div className="p-4 rounded-lg bg-red-900/20 border border-red-500/30">
                                <span className="text-red-400 font-bold mb-2 block font-mono text-sm">DON'T</span>
                                <ul className="text-xs text-gray-300 space-y-2 list-disc pl-4">
                                    <li>Invert colors</li>
                                    <li>Place on white without plate</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-center justify-center gap-6">
                        {/* Logo Demo */}
                        <div className="w-64 h-64 bg-[#050B14] border-2 border-[#22D3EE] rounded-3xl flex items-center justify-center shadow-[0_0_50px_rgba(34,211,238,0.2)] relative">
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/circuit-board.png')] opacity-20"></div>
                            <span className="text-9xl font-bold font-rajdhani text-white drop-shadow-[0_0_15px_rgba(232,121,249,0.8)]">M</span>
                        </div>
                        <span className="font-mono text-xs text-gray-500">PRIMARY LOCKUP</span>
                    </div>
                </div>
            )
        }
    ];

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowRight') nextSlide();
            if (e.key === 'ArrowLeft') prevSlide();
            if (e.key === 'Escape' && onExit) onExit();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onExit]);

    return (
        <div className="w-full h-screen bg-[#050B14] text-white overflow-hidden flex flex-col font-sans selection:bg-[#E879F9] selection:text-white relative">
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600&family=JetBrains+Mono:wght@400;700&family=Rajdhani:wght@400;600;700&display=swap');
      `}</style>

            {/* Background Grid - Aesthetic Only */}
            <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>

            {/* Header / Nav */}
            <div className="flex items-center justify-between px-8 py-6 z-20 border-b border-gray-900/50 bg-[#050B14]/80 backdrop-blur-md">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#22D3EE] rounded-full animate-pulse"></div>
                    <span className="font-rajdhani font-bold text-xl tracking-wider">MULTIVAC_AI</span>
                </div>
                <div className="flex items-center gap-4 text-xs font-mono text-gray-500">
                    <span>DECK_V2.0</span>
                    <span>{currentSlide + 1} / {slides.length}</span>
                    {onExit && <button onClick={onExit} className="hover:text-white"><X size={20} /></button>}
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-grow relative z-10 flex flex-col justify-center px-8 md:px-24 py-8">

                {/* Slide Transition Wrapper */}
                <div className="w-full max-w-7xl mx-auto h-full animate-in fade-in zoom-in duration-300 key={currentSlide}">
                    {slides[currentSlide].title && (
                        <h2 className="text-[#22D3EE] font-mono text-sm mb-6 uppercase tracking-widest border-b border-[#22D3EE]/20 pb-2 inline-block">
                            {slides[currentSlide].title}
                        </h2>
                    )}
                    <div className="h-full">
                        {slides[currentSlide].content}
                    </div>
                </div>

            </div>

            {/* Footer / Controls */}
            <div className="px-8 py-6 z-20 flex justify-between items-center">
                <div className="hidden md:flex gap-2">
                    {slides.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentSlide(idx)}
                            className={`h-1 transition-all duration-300 rounded-full ${idx === currentSlide ? 'w-12 bg-[#E879F9]' : 'w-4 bg-gray-800 hover:bg-gray-600'}`}
                        />
                    ))}
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={prevSlide}
                        className="p-3 rounded-full border border-gray-800 hover:border-[#22D3EE] hover:text-[#22D3EE] hover:bg-[#22D3EE]/10 transition-all group"
                    >
                        <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="p-3 rounded-full border border-gray-800 hover:border-[#22D3EE] hover:text-[#22D3EE] hover:bg-[#22D3EE]/10 transition-all group"
                    >
                        <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>

        </div>
    );
};

export default BrandDeck;

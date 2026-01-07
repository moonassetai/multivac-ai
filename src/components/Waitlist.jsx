import React from 'react';
import { Lock, Clock, ShieldCheck, Mail } from 'lucide-react';

const Waitlist = ({ user, onLogout }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-3xl overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none mix-blend-overlay"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-900/10 rounded-full blur-[100px] animate-pulse"></div>

            <div className="relative z-10 w-full max-w-lg p-8 mx-4">
                {/* Header Icon */}
                <div className="flex justify-center mb-8">
                    <div className="relative">
                        <img src="/logo.png" alt="Multivac Logo" className="w-24 h-24 rounded-2xl shadow-[0_0_30px_rgba(34,211,238,0.3)] border border-cyan-500/50 animate-pulse" />
                        <div className="absolute -bottom-2 -right-2 bg-zinc-900 p-2 rounded-full border border-zinc-700">
                            <Lock className="w-4 h-4 text-zinc-400" />
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="text-center space-y-4 mb-8">
                    <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-white to-zinc-500 tracking-tight">
                        ACCESS PENDING
                    </h1>
                    <p className="text-zinc-400 text-sm leading-relaxed">
                        Welcome, <span className="text-cyan-400 font-mono">{user?.displayName || "User"}</span>.
                        <br />
                        Your account <span className="text-zinc-500 text-xs">({user?.email})</span> has been registered and added to the <b className="text-white">Multivac V2.0 Priority Waitlist</b>.
                    </p>
                </div>

                {/* Status Card */}
                <div className="bg-zinc-900/50 border border-white/5 rounded-xl p-6 backdrop-blur-md mb-8">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></div>
                        <span className="text-xs font-bold text-zinc-300 uppercase tracking-widest">Status: Under Review</span>
                    </div>
                    <div className="space-y-3">
                        <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                            <div className="h-full w-3/4 bg-cyan-900/50"></div>
                        </div>
                        <p className="text-[10px] text-zinc-500">
                            We are rolling out access in waves to ensure system stability.
                            You will be notified via email when your neural link is active.
                        </p>
                    </div>
                </div>

                {/* Footer / Actions */}
                <div className="flex flex-col items-center gap-4">
                    <button
                        onClick={onLogout}
                        className="text-zinc-500 hover:text-white text-xs transition-colors flex items-center gap-2"
                    >
                        <ShieldCheck className="w-3 h-3" />
                        Sign Out / Switch Account
                    </button>

                    <div className="text-[10px] text-zinc-700 uppercase tracking-widest font-mono">
                        Multivac AI • Gen 2 • 2026
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Waitlist;

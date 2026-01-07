import React, { useState } from 'react';
import { auth, googleProvider, signInWithPopup } from '../firebaseConfig';
import { Lock, AlertCircle } from 'lucide-react';

const Login = () => {
    const [error, setError] = useState(null);

    const handleGoogleLogin = async () => {
        try {
            setError(null);
            await signInWithPopup(auth, googleProvider);
            // Auth state change is handled in Dashboard listener
        } catch (err) {
            console.error("Login failed:", err);
            setError(err.message);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md">
            <div className="w-full max-w-md p-8 bg-zinc-900/80 border border-cyan-500/30 rounded-2xl shadow-[0_0_50px_rgba(6,182,212,0.15)] flex flex-col items-center">

                {/* Animated Icon */}
                <div className="mb-8 relative">
                    <img src="/logo.png" alt="Multivac Logo" className="w-24 h-24 rounded-2xl shadow-[0_0_30px_rgba(34,211,238,0.3)] border border-cyan-500/50" />
                </div>

                <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-2">
                    MULTIVAC ACCESS
                </h2>
                <p className="text-zinc-400 text-sm mb-8 text-center">
                    Identity verification required to access the system core.
                </p>

                {error && (
                    <div className="mb-6 p-3 w-full bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2 text-red-400 text-xs">
                        <AlertCircle className="w-4 h-4" />
                        <span>{error}</span>
                    </div>
                )}

                <button
                    onClick={handleGoogleLogin}
                    className="w-full py-3 px-4 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-cyan-500/50 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 group"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                            fill="currentColor"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            className="text-white"
                        />
                        <path
                            fill="currentColor"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            className="text-white" // Usually colored, but keep minimal for theme
                            style={{ fill: '#34A853' }}
                        />
                        <path
                            fill="currentColor"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z"
                            style={{ fill: '#FBBC05' }}
                        />
                        <path
                            fill="currentColor"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            style={{ fill: '#EA4335' }}
                        />
                    </svg>
                    <span className="text-zinc-300 font-medium group-hover:text-white">
                        Continue with Google
                    </span>
                </button>

                <div className="mt-8 text-[10px] text-zinc-600 uppercase tracking-widest">
                    Secure Connection • End-to-End Encrypted
                </div>
            </div>
        </div>
    );
};

export default Login;

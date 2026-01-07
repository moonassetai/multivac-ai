import React, { useState, Suspense } from 'react';
import LandingPage from './components/LandingPage';
import BrandDeck from './components/BrandDeck';

// Lazy load Dashboard so its Electron dependencies don't crash the web version
const Dashboard = React.lazy(() => import('./Dashboard'));

function App() {
    const [view, setView] = useState('landing'); // 'landing' or 'dashboard'

    if (view === 'dashboard') {
        return (
            <Suspense fallback={<div className="h-screen w-full bg-black text-green-500 flex items-center justify-center font-mono">Initializing Neural Core...</div>}>
                <Dashboard />
            </Suspense>
        );
    }

    if (view === 'brand') {
        return <BrandDeck onExit={() => setView('landing')} />;
    }

    return (
        <>
            <LandingPage onEnter={() => setView('dashboard')} onOpenDeck={() => setView('brand')} />

            {/* Persistent Background Music */}
            <div className="fixed bottom-0 left-0 w-full z-[100] opacity-80 hover:opacity-100 transition-opacity">
                <iframe
                    width="100%"
                    height="20"
                    scrolling="no"
                    frameBorder="no"
                    allow="autoplay"
                    src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/soundcloud%253Atracks%253A2243124260&color=%237e5cac&inverse=false&auto_play=true&show_user=true"
                ></iframe>
            </div>
        </>
    );
}

export default App;

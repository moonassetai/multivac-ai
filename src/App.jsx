import React, { useState, Suspense } from 'react';
import LandingPage from './components/LandingPage';
import BrandDeck from './components/BrandDeck';

// Lazy load Dashboard so its Electron dependencies don't crash the web version
const Dashboard = React.lazy(() => import('./Dashboard'));
import MarketplaceWindow from './components/MarketplaceWindow';

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

    if (view === 'marketplace') {
        return (
            <div className="min-h-screen bg-[#050b14] flex items-center justify-center p-4">
                {/* Background from Landing Page for consistency */}
                <div className="fixed inset-0 pointer-events-none z-0">
                    <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(125deg,rgba(6,182,212,0.05)_0%,transparent_40%),radial-gradient(circle_at_90%_10%,rgba(236,72,153,0.1)_0%,transparent_50%)]"></div>
                    <div className="absolute top-0 left-0 w-full h-full opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}></div>
                </div>

                <MarketplaceWindow
                    onClose={() => setView('landing')}
                    isModularMode={false}
                    style={{
                        position: 'relative',
                        transform: 'none',
                        top: 'auto',
                        left: 'auto',
                        width: '1000px',
                        height: '700px',
                        maxWidth: '100%',
                        maxHeight: '100%'
                    }}
                />
            </div>
        );
    }

    return (
        <>
            <LandingPage
                onEnter={() => setView('dashboard')}
                onOpenDeck={() => setView('brand')}
                onOpenMarketplace={() => setView('marketplace')}
            />

            {/* Persistent Background Music */}
            {/* Persistent Background Music Removed per User Request */}
        </>
    );
}

export default App;

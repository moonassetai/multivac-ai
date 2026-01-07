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

    return <LandingPage onEnter={() => setView('dashboard')} onOpenDeck={() => setView('brand')} />;
}

export default App;

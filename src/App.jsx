import React, { useState, Suspense } from 'react';
import Website from './Website';

// Lazy load Dashboard (The "Local App")
// This ensures that Electron/Node dependencies are not loaded when visiting the Website version.
const Dashboard = React.lazy(() => import('./Dashboard'));

function App() {
    const [mode, setMode] = useState('web'); // 'web' (Cloud Infrastructure) | 'local' (Local Infrastructure)

    // Mode Switcher: Local App
    if (mode === 'local') {
        return (
            <Suspense fallback={<div className="h-screen w-full bg-black text-green-500 flex items-center justify-center font-mono">Initializing Neural Core...</div>}>
                <Dashboard />
            </Suspense>
        );
    }

    // Default: Website App (Cloud Infrastructure)
    return <Website onLaunch={() => setMode('local')} />;
}

export default App;

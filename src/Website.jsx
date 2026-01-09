import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import DiscoveryDashboard from './components/DiscoveryDashboard';
import BrandDeck from './components/BrandDeck';

/**
 * Website Container ("Cloud App")
 * Hosted on Vercel/Web. Independent of Local Backend.
 */
const Website = ({ onLaunch }) => {
    const [page, setPage] = useState('landing'); // 'landing', 'marketplace', 'brand'

    // Shared background for consistency across web pages
    const WebBackground = () => (
        <div className="fixed inset-0 pointer-events-none z-0">
            <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(125deg,rgba(6,182,212,0.05)_0%,transparent_40%),radial-gradient(circle_at_90%_10%,rgba(236,72,153,0.1)_0%,transparent_50%)]"></div>
            <div className="absolute top-0 left-0 w-full h-full opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}></div>
        </div>
    );

    if (page === 'brand') {
        return <BrandDeck onExit={() => setPage('landing')} />;
    }

    if (page === 'marketplace') {
        return (
            <div className="min-h-screen bg-[#050b14] flex items-center justify-center p-4 relative overflow-hidden font-['Inter']">
                <WebBackground />

                {/* Back Button */}
                <button
                    onClick={() => setPage('landing')}
                    className="absolute top-8 left-8 z-50 text-gray-400 hover:text-white flex items-center gap-2 font-['Rajdhani'] font-bold tracking-wider uppercase transition-colors"
                >
                    ← Back to Home
                </button>

                <DiscoveryDashboard onClose={() => setPage('landing')} />
            </div>
        );
    }

    // Default: Landing Page
    return (
        <>
            {/* LandingPage has its own background, but we can wrap it if needed. 
               Currently LandingPage handles its own full-screen layout. */}
            <LandingPage
                onEnter={onLaunch}
                onOpenDeck={() => setPage('brand')}
                onOpenMarketplace={() => setPage('marketplace')}
            />
        </>
    );
};

export default Website;

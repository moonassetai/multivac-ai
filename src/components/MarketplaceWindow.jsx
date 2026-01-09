import React, { useState, useEffect, useRef } from 'react';
import { X, Search, Star, ExternalLink, GripHorizontal, ShoppingBag, Filter, Move, Download, GitBranch } from 'lucide-react';
import toolsData from '../data/tools.json';

const MarketplaceWindow = ({ onClose, style, onMouseDown, isModularMode }) => {
    const [activeTab, setActiveTab] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [tools, setTools] = useState([]);
    const [filteredTools, setFilteredTools] = useState([]);

    // Categories based on the reference image + "All"
    const categories = [
        "All",
        "AI Chatbots",
        "AI Coding Assistance",
        "AI Image Generation",
        "AI Video Generation",
        "AI Writing Generation",
        "AI Presentation",
        "AI Spreadsheet",
        "AI Meeting Notes",
        "AI Workflow Automation",
        "AI Graphic Design",
        "AI Knowledge Management",
        "AI Data Visualization",
        "AI Productivity" // Fallback
    ];

    useEffect(() => {
        // Load data on mount
        setTools(toolsData);
    }, []);

    useEffect(() => {
        // Filter logic
        let result = tools;

        // 1. Category Filter
        if (activeTab !== 'All') {
            result = result.filter(tool => tool.category === activeTab);
        }

        // 2. Search Filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(tool =>
                tool.name.toLowerCase().includes(query) ||
                tool.description.toLowerCase().includes(query)
            );
        }

        setFilteredTools(result);
    }, [activeTab, searchQuery, tools]);

    const formatNumber = (num) => {
        if (!num) return '0';
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
        return num.toString();
    };

    return (
        <div
            className={`fixed flex flex-col glass-panel border border-white/20 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ${!isModularMode ? 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2' : ''}`}
            style={{
                width: '900px', // Standard width
                height: '600px', // Standard height
                zIndex: 60, // High Z-Index
                ...style
            }}
            onMouseDown={onMouseDown}
        >
            {/* Header */}
            <div className="h-14 bg-white/5 border-b border-white/10 flex items-center justify-between px-4 cursor-move">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
                        <ShoppingBag size={20} />
                    </div>
                    <span className="font-bold text-white tracking-wide">AI Marketplace</span>
                    <span className="text-xs bg-white/10 px-2 py-0.5 rounded text-gray-400">
                        {tools.length} Tools
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    {/* Search Bar */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                        <input
                            type="text"
                            placeholder="Find AI tools..."
                            className="bg-black/30 border border-white/10 rounded-full py-1.5 pl-9 pr-4 text-sm text-white focus:outline-none focus:border-indigo-500 w-48 transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <button onClick={onClose} className="p-2 hover:bg-red-500/20 rounded-full group transition-colors">
                        <X size={18} className="text-gray-400 group-hover:text-red-400" />
                    </button>
                </div>
            </div>

            {/* Categories Tabs */}
            <div className="px-4 py-3 bg-white/5 border-b border-white/10 overflow-x-auto scrollbar-hide flex gap-2">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setActiveTab(cat)}
                        className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${activeTab === cat
                                ? 'bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]'
                                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Content Grid */}
            <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredTools.length > 0 ? (
                        filteredTools.map((tool, index) => (
                            <ToolCard key={index} tool={tool} formatNumber={formatNumber} />
                        ))
                    ) : (
                        <div className="col-span-full flex flex-col items-center justify-center h-64 text-gray-500">
                            <Search size={48} className="mb-4 opacity-50" />
                            <p>No tools found for "{searchQuery}"</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer Status */}
            <div className="h-8 bg-black/40 border-t border-white/5 flex items-center justify-between px-4 text-[10px] text-gray-500">
                <span>Data updated daily (00:00 UTC)</span>
                <span className="flex items-center gap-1">
                    Powered by <GitBranch size={10} /> GitHub Actions
                </span>
            </div>
        </div>
    );
};

const ToolCard = ({ tool, formatNumber }) => {
    const getPricingColor = (pricing) => {
        switch (pricing?.toLowerCase()) {
            case 'free': return 'bg-green-500/20 text-green-400 border-green-500/30';
            case 'open source': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
            case 'freemium': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
            case 'paid': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
            default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
        }
    };

    return (
        <div className="group relative bg-white/5 hover:bg-white/10 border border-white/10 hover:border-indigo-500/50 rounded-xl p-4 transition-all duration-300 flex flex-col h-[180px]">
            <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                    <h3 className="font-bold text-white text-base truncate pr-2" title={tool.name}>{tool.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[10px] px-2 py-0.5 rounded border ${getPricingColor(tool.pricing)}`}>
                            {tool.pricing || 'Unknown'}
                        </span>
                        {tool.stars > 0 && (
                            <span className="flex items-center gap-1 text-[10px] text-yellow-400">
                                <Star size={10} fill="currentColor" />
                                {formatNumber(tool.stars)}
                            </span>
                        )}
                    </div>
                </div>
                {/* External Link */}
                <a
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 bg-white/5 hover:bg-indigo-500 rounded-lg text-gray-400 hover:text-white transition-colors"
                >
                    <ExternalLink size={14} />
                </a>
            </div>

            <p className="text-gray-400 text-xs line-clamp-3 mb-auto leading-relaxed">
                {tool.description}
            </p>

            <div className="mt-4 flex items-center justify-between text-[10px] text-gray-500 border-t border-white/5 pt-2">
                <span className="truncate max-w-[120px]">{tool.category}</span>
                {tool.forks > 0 && (
                    <span className="flex items-center gap-1">
                        <GitBranch size={10} /> {formatNumber(tool.forks)}
                    </span>
                )}
            </div>

            {/* Hover Glow Effect */}
            <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 rounded-xl pointer-events-none transition-opacity duration-300" />
        </div>
    );
};

export default MarketplaceWindow;

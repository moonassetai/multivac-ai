import React, { useState, useEffect } from 'react';
import { Search, Filter, ArrowLeft, RefreshCw, Zap } from 'lucide-react';
import ToolCard from './ToolCard';

const API_BASE = "http://127.0.0.1:8000";

const AiToolsDashboard = ({ onExit }) => {
    const [tools, setTools] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [sortBy, setSortBy] = useState("score");

    useEffect(() => {
        fetchCategories();
        fetchTools();
    }, []);

    useEffect(() => {
        // Debounce search/filter could be done here, but for now we filter client side or re-fetch
        // Since we have client-side filtering for search, but server side for sort
        fetchTools();
    }, [selectedCategory, sortBy]);

    const fetchCategories = async () => {
        try {
            const res = await fetch(`${API_BASE}/api/tools/categories`);
            if (res.ok) {
                const data = await res.json();
                setCategories(["All", ...data]);
            }
        } catch (error) {
            console.error("Failed to fetch categories", error);
        }
    };

    const fetchTools = async () => {
        setLoading(true);
        try {
            let url = `${API_BASE}/api/tools?sort_by=${sortBy}`;
            if (selectedCategory !== "All") {
                url += `&category=${encodeURIComponent(selectedCategory)}`;
            }
            const res = await fetch(url);
            if (res.ok) {
                const data = await res.json();
                setTools(data);
            }
        } catch (error) {
            console.error("Failed to fetch tools", error);
        } finally {
            setLoading(false);
        }
    };

    // Client-side search filtering
    const filteredTools = tools.filter(tool =>
        tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#050b14] text-white font-['Inter']">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-[#0f172a]/90 backdrop-blur-md border-b border-white/5 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={onExit} className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-400 hover:text-white">
                        <ArrowLeft size={20} />
                    </button>
                    <div className="flex items-center gap-2">
                        <Zap className="text-[#22d3ee]" size={24} />
                        <h1 className="text-xl font-bold font-['Rajdhani'] uppercase tracking-wider">
                            AI Tools <span className="text-[#e879f9]">Explorer</span>
                        </h1>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                     <div className="relative hidden md:block w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                        <input
                            type="text"
                            placeholder="Search tools..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-[#1e293b] border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-[#22d3ee]/50 transition-all"
                        />
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 py-8">

                {/* Controls */}
                <div className="flex flex-col md:flex-row gap-4 mb-8 justify-between items-center">
                    <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto no-scrollbar">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-['Rajdhani'] font-bold uppercase tracking-wider border transition-all ${
                                    selectedCategory === cat
                                    ? 'bg-[#22d3ee]/10 border-[#22d3ee] text-[#22d3ee]'
                                    : 'bg-[#1e293b]/50 border-white/5 text-gray-400 hover:border-white/20'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto">
                         <div className="relative block md:hidden w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-[#1e293b] border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm"
                            />
                        </div>

                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="bg-[#1e293b] border border-white/10 rounded-lg px-4 py-2 text-sm text-gray-300 focus:outline-none"
                        >
                            <option value="score">Top Ranked</option>
                            <option value="stars">Most Stars</option>
                            <option value="newest">Newest</option>
                            <option value="updated">Recently Updated</option>
                        </select>
                    </div>
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <RefreshCw className="animate-spin text-[#22d3ee]" size={32} />
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredTools.map(tool => (
                                <ToolCard key={tool.id} tool={tool} />
                            ))}
                        </div>
                        {filteredTools.length === 0 && (
                            <div className="text-center py-20 text-gray-500">
                                <p>No tools found matching your criteria.</p>
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
};

export default AiToolsDashboard;

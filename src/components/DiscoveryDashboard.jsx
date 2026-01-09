import React, { useState, useEffect } from 'react';
import {
    X, Search, Star, ExternalLink, Filter, Globe, ChevronRight,
    Zap, Code, Image as ImageIcon, Video, PenTool, Layout, FileSpreadsheet,
    Mic, Workflow, Database, BarChart, CheckCircle2, TrendingUp, Briefcase,
    MapPin, Clock, DollarSign, GripVertical, Sparkles, Crown, Award, Play
} from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import toolsData from '../data/tools.json';

// --- MOCK DATA FOR NEWS & JOBS ---
const MOCK_NEWS = [
    { id: 1, title: "OpenAI releases GPT-5 Preview", source: "TechCrunch", time: "2h ago", url: "#", category: "LLM" },
    { id: 2, title: "Midjourney v7 introduces 3D model generation", source: "The Verge", time: "4h ago", url: "#", category: "Image Gen" },
    { id: 3, title: "Google DeepMind solves new protein folding challenge", source: "Nature", time: "12h ago", url: "#", category: "Research" },
    { id: 4, title: "LangChain raises $25M Series A", source: "VentureBeat", time: "1d ago", url: "#", category: "Funding" },
    { id: 5, title: "Meta open sources Llama 4 70B", source: "Hugging Face", time: "1d ago", url: "#", category: "Open Source" },
];

const MOCK_JOBS = [
    { id: 1, role: "Senior AI Engineer", company: "Anthropic", location: "San Francisco, CA", type: "Full-time", salary: "$200k - $350k", url: "#", featured: true },
    { id: 2, role: "Machine Learning Researcher", company: "DeepMind", location: "London, UK", type: "Hybrid", salary: "£120k - £180k", url: "#", featured: false },
    { id: 3, role: "AI Product Manager", company: "Notion", location: "Remote", type: "Remote", salary: "$160k - $240k", url: "#", featured: true },
    { id: 4, role: "Computer Vision Engineer", company: "Tesla", location: "Austin, TX", type: "On-site", salary: "$180k - $300k", url: "#", featured: false },
    { id: 5, role: "Generative AI Specialist", company: "Adobe", location: "San Jose, CA", type: "Hybrid", salary: "$190k - $280k", url: "#", featured: false },
];

// Featured Tools (Top tier)
const FEATURED_TOOLS = ['ChatGPT', 'Claude', 'Midjourney', 'GitHub Copilot'];

const DiscoveryDashboard = ({ onClose, style, onMouseDown, isModularMode }) => {
    const [activeSection, setActiveSection] = useState('Tools');
    const [searchQuery, setSearchQuery] = useState('');
    const [tools, setTools] = useState([]);
    const [filteredTools, setFilteredTools] = useState([]);
    const [featuredTools, setFeaturedTools] = useState([]);
    const [regularTools, setRegularTools] = useState([]);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    useEffect(() => {
        const initializedTools = toolsData.map((t, i) => ({
            ...t,
            id: `tool-${i}`,
            isFeatured: FEATURED_TOOLS.includes(t.name)
        }));
        setTools(initializedTools);
        setFilteredTools(initializedTools);
    }, []);

    useEffect(() => {
        if (!searchQuery) {
            setFilteredTools(tools);
        } else {
            const query = searchQuery.toLowerCase();
            setFilteredTools(tools.filter(t =>
                t.name.toLowerCase().includes(query) ||
                t.description.toLowerCase().includes(query)
            ));
        }
    }, [searchQuery, tools]);

    // Separate featured and regular tools
    useEffect(() => {
        setFeaturedTools(filteredTools.filter(t => t.isFeatured));
        setRegularTools(filteredTools.filter(t => !t.isFeatured));
    }, [filteredTools]);

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (active.id !== over.id) {
            setFilteredTools((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    return (
        <div
            className={`fixed flex flex-col backdrop-blur-3xl bg-[#0a0e17]/98 border border-white/10 rounded-2xl shadow-2xl overflow-hidden font-['Inter'] text-slate-300 transition-all duration-300 ${!isModularMode ? 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2' : ''}`}
            style={{ width: '1200px', height: '800px', zIndex: 60, ...style }}
            onMouseDown={onMouseDown}
        >
            {/* Header */}
            <div className="h-16 border-b border-white/5 bg-gradient-to-r from-indigo-900/20 to-purple-900/20 flex items-center justify-between px-6 z-50">
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-2 text-white font-bold text-xl tracking-tight">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                            <Sparkles size={18} />
                        </div>
                        Discovery
                    </div>

                    {/* Tabs */}
                    <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1">
                        {['Tools', 'News', 'Jobs'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveSection(tab)}
                                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeSection === tab
                                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Search */}
                <div className="flex-1 max-w-md mx-8 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                    <input
                        type="text"
                        placeholder={`Search ${activeSection}...`}
                        className="w-full bg-[#161b27] border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-slate-400 hover:text-white transition-colors">
                    <X size={20} />
                </button>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-hidden flex bg-gradient-to-br from-[#0a0e17] to-[#0f1115]">

                {/* Main Panel */}
                <div className="flex-1 overflow-y-auto">
                    {activeSection === 'Tools' && (
                        <div className="p-6 space-y-6">
                            {/* Featured Hero Banner */}
                            {featuredTools.length > 0 && (
                                <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-8 shadow-2xl">
                                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>

                                    <div className="relative z-10">
                                        <div className="flex items-center gap-2 mb-4">
                                            <Crown className="text-yellow-300" size={24} />
                                            <h2 className="text-2xl font-bold text-white">Featured AI Tools</h2>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            {featuredTools.slice(0, 2).map((tool) => (
                                                <FeaturedToolCard key={tool.id} tool={tool} />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Exclusive Spotlight */}
                            {featuredTools.length > 2 && (
                                <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-xl p-6 border border-purple-500/20">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2">
                                            <Award className="text-purple-400" size={20} />
                                            <h3 className="text-lg font-bold text-white">Exclusive Spotlight</h3>
                                        </div>
                                        <button className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1">
                                            View all <ChevronRight size={14} />
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        {featuredTools.slice(2, 4).map((tool) => (
                                            <SpotlightToolCard key={tool.id} tool={tool} />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* All Tools Grid */}
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-white">All AI Tools</h3>
                                    <span className="text-xs text-slate-500">Drag to reorder</span>
                                </div>

                                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                                    <SortableContext items={regularTools.map(t => t.id)} strategy={rectSortingStrategy}>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                            {regularTools.map((tool) => (
                                                <SortableToolCard key={tool.id} tool={tool} />
                                            ))}
                                        </div>
                                    </SortableContext>
                                </DndContext>
                            </div>
                        </div>
                    )}

                    {activeSection === 'News' && (
                        <div className="p-6">
                            <div className="max-w-4xl mx-auto space-y-4">
                                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                                    <TrendingUp className="text-emerald-500" /> Recent Breakthroughs
                                </h2>
                                {MOCK_NEWS.map((news) => (
                                    <NewsCard key={news.id} news={news} />
                                ))}
                            </div>
                        </div>
                    )}

                    {activeSection === 'Jobs' && (
                        <div className="p-6">
                            <div className="max-w-4xl mx-auto space-y-3">
                                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                                    <Briefcase className="text-purple-500" /> Top AI Opportunities
                                </h2>
                                {MOCK_JOBS.map((job) => (
                                    <JobCard key={job.id} job={job} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="w-80 border-l border-white/5 bg-[#0a0e17] p-6 hidden xl:block overflow-y-auto">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Sparkles size={12} /> Trending Today
                    </h3>
                    <ul className="space-y-4">
                        {[
                            { name: "AutoGPT v0.5", metric: "12k new stars", rank: 1 },
                            { name: "LangChain", metric: "8.5k forks", rank: 2 },
                            { name: "Stable Diffusion XL", metric: "6.2k mentions", rank: 3 },
                            { name: "Whisper v3", metric: "4.8k downloads", rank: 4 }
                        ].map(item => (
                            <li key={item.rank} className="flex items-center gap-3 group cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-colors">
                                <span className="text-slate-600 font-mono text-xs w-6">#{item.rank}</span>
                                <div className="flex-1">
                                    <div className="text-sm text-slate-300 font-medium group-hover:text-indigo-400 transition-colors">{item.name}</div>
                                    <div className="text-xs text-slate-500">{item.metric}</div>
                                </div>
                                <ChevronRight size={14} className="text-slate-600 group-hover:text-slate-400" />
                            </li>
                        ))}
                    </ul>

                    <div className="mt-8 pt-8 border-t border-white/5">
                        <div className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 rounded-xl p-4 border border-indigo-500/20">
                            <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                                <Crown size={16} className="text-yellow-400" /> Premium Listing
                            </h4>
                            <p className="text-xs text-slate-400 mb-3">Feature your AI tool at the top of search results</p>
                            <button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold py-2 rounded-lg hover:from-indigo-500 hover:to-purple-500 transition-all shadow-lg">
                                Get Featured
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Featured Tool Card (Large Hero Style)
const FeaturedToolCard = ({ tool }) => (
    <a href={tool.url} target="_blank" rel="noreferrer" className="group relative bg-black/40 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:border-white/40 transition-all overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

        <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center text-2xl font-bold text-white border border-white/20">
                    {tool.name.charAt(0)}
                </div>
                <Play size={20} className="text-white/60 group-hover:text-white transition-colors" />
            </div>

            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">{tool.name}</h3>
            <p className="text-sm text-white/70 line-clamp-2 mb-4">{tool.description}</p>

            <div className="flex items-center gap-3">
                <span className="text-xs bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded border border-yellow-500/30 flex items-center gap-1">
                    <Star size={10} fill="currentColor" /> Featured
                </span>
                <span className="text-xs text-white/50">{tool.pricing || 'Free'}</span>
            </div>
        </div>
    </a>
);

// Spotlight Tool Card (Medium Size)
const SpotlightToolCard = ({ tool }) => (
    <a href={tool.url} target="_blank" rel="noreferrer" className="group bg-[#1a1f2e]/60 backdrop-blur-sm rounded-lg p-4 border border-purple-500/20 hover:border-purple-400/40 hover:bg-[#1a1f2e] transition-all">
        <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-lg font-bold text-purple-300 border border-purple-500/20">
                {tool.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-white truncate group-hover:text-purple-300 transition-colors">{tool.name}</h4>
                <p className="text-xs text-slate-500">{tool.category}</p>
            </div>
        </div>
        <p className="text-xs text-slate-400 line-clamp-2">{tool.description}</p>
    </a>
);

// Regular Sortable Tool Card
const SortableToolCard = ({ tool }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: tool.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 999 : 1,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="group bg-[#1a1f2e] border border-white/5 rounded-xl p-4 hover:border-indigo-500/40 hover:shadow-lg hover:shadow-indigo-500/10 transition-all flex flex-col h-[200px]"
        >
            <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-slate-400 font-bold border border-white/5">
                    {tool.name.charAt(0)}
                </div>
                <div
                    {...attributes}
                    {...listeners}
                    className="p-1 text-slate-600 hover:text-white cursor-grab active:cursor-grabbing transition-colors"
                >
                    <GripVertical size={16} />
                </div>
            </div>

            <h3 className="text-base font-bold text-white mb-1 truncate group-hover:text-indigo-400 transition-colors">{tool.name}</h3>
            <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
                    <Star size={8} /> {tool.stars ? `${(tool.stars / 1000).toFixed(1)}k` : 'N/A'}
                </span>
                <span className="text-[10px] bg-slate-700/50 text-slate-400 px-1.5 py-0.5 rounded">
                    {tool.pricing || 'Free'}
                </span>
            </div>

            <p className="text-xs text-slate-400 line-clamp-3 mb-auto leading-relaxed">
                {tool.description}
            </p>

            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-500">
                <span className="bg-white/5 px-2 py-0.5 rounded truncate max-w-[120px]">{tool.category}</span>
                <a href={tool.url} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-indigo-400 transition-colors">
                    Visit <ExternalLink size={10} />
                </a>
            </div>
        </div>
    );
};

// News Card
const NewsCard = ({ news }) => (
    <div className="bg-[#1a1f2e] border border-white/5 p-5 rounded-xl flex items-center justify-between hover:border-indigo-500/30 hover:bg-[#1f2535] transition-all group cursor-pointer">
        <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded border border-indigo-500/20">
                    {news.category}
                </span>
                <span className="text-xs text-slate-500">{news.source}</span>
                <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
                <span className="text-xs text-slate-500 flex items-center gap-1"><Clock size={10} /> {news.time}</span>
            </div>
            <h3 className="text-white font-medium mb-1 group-hover:text-indigo-400 transition-colors">{news.title}</h3>
        </div>
        <ExternalLink size={16} className="text-slate-600 group-hover:text-white transition-colors ml-4" />
    </div>
);

// Job Card
const JobCard = ({ job }) => (
    <div className={`bg-[#1a1f2e] border p-5 rounded-xl flex items-center justify-between hover:bg-[#1f2535] transition-all group cursor-pointer ${job.featured ? 'border-purple-500/30 bg-gradient-to-r from-purple-900/10 to-transparent' : 'border-white/5'
        }`}>
        <div className="flex items-start gap-4 flex-1">
            <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center text-xl font-bold text-slate-500 border border-white/5">
                {job.company.charAt(0)}
            </div>
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-white font-bold text-lg group-hover:text-purple-400 transition-colors">{job.role}</h3>
                    {job.featured && (
                        <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded border border-purple-500/30 flex items-center gap-1">
                            <Crown size={10} /> Featured
                        </span>
                    )}
                </div>
                <p className="text-slate-400 text-sm mb-2">{job.company}</p>
                <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded"><MapPin size={10} /> {job.location}</span>
                    <span className="flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded"><Clock size={10} /> {job.type}</span>
                </div>
            </div>
        </div>
        <div className="text-right ml-4">
            <div className="text-sm font-medium text-emerald-400 mb-2 flex items-center justify-end gap-1">
                <DollarSign size={12} /> {job.salary}
            </div>
            <button className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg transition-colors font-medium">
                Apply Now
            </button>
        </div>
    </div>
);

export default DiscoveryDashboard;

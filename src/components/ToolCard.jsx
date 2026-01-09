import React from 'react';
import { Star, GitFork, Download, ExternalLink, Calendar } from 'lucide-react';

const ToolCard = ({ tool }) => {
    const getPricingColor = (pricing) => {
        switch (pricing?.toLowerCase()) {
            case 'free/open source': return 'text-green-400 border-green-400/30 bg-green-400/10';
            case 'paid': return 'text-red-400 border-red-400/30 bg-red-400/10';
            case 'freemium': return 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10';
            default: return 'text-gray-400 border-gray-400/30 bg-gray-400/10';
        }
    };

    return (
        <div className="group relative bg-[#0f172a] rounded-xl border border-white/10 p-6 hover:border-[#22d3ee]/50 transition-all hover:shadow-[0_0_20px_rgba(34,211,238,0.1)] flex flex-col h-full">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <span className="text-xs font-mono text-[#22d3ee] mb-1 block uppercase tracking-wider">{tool.category}</span>
                    <h3 className="text-xl font-bold text-white font-['Rajdhani'] group-hover:text-[#22d3ee] transition-colors line-clamp-1" title={tool.name}>
                        {tool.name}
                    </h3>
                </div>
                <div className={`text-xs px-2 py-1 rounded border font-mono uppercase ${getPricingColor(tool.pricing)}`}>
                    {tool.pricing}
                </div>
            </div>

            <p className="text-gray-400 text-sm mb-6 line-clamp-3 flex-grow">
                {tool.description || "No description available."}
            </p>

            <div className="flex items-center gap-4 text-xs text-gray-500 font-mono mb-4">
                <div className="flex items-center gap-1">
                    <Star size={14} className="text-yellow-500" />
                    {tool.stars.toLocaleString()}
                </div>
                <div className="flex items-center gap-1">
                    <GitFork size={14} className="text-blue-400" />
                    {tool.forks.toLocaleString()}
                </div>
                {tool.downloads > 0 && (
                    <div className="flex items-center gap-1">
                        <Download size={14} className="text-green-400" />
                        {tool.downloads.toLocaleString()}
                    </div>
                )}
            </div>

            <div className="pt-4 border-t border-white/5 flex justify-between items-center mt-auto">
                <span className="text-xs text-gray-600 font-mono flex items-center gap-1">
                    <Calendar size={12} />
                    {new Date(tool.last_updated || tool.created_at).toLocaleDateString()}
                </span>
                <a
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-[#e879f9] hover:text-white text-sm font-bold font-['Rajdhani'] uppercase tracking-wider transition-colors"
                >
                    View <ExternalLink size={14} />
                </a>
            </div>
        </div>
    );
};

export default ToolCard;

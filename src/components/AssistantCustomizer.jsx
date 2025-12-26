import React, { useState, useEffect } from 'react';
import { Sparkles, Volume2, User, Brain, Save, RotateCcw } from 'lucide-react';

const PERSONALITY_TEMPLATES = {
    default: {
        name: 'Multivac (Default)',
        description: 'The legendary supercomputer from Isaac Asimov, evolved into a hyper-spatial quantum entity',
        prompt: 'default' // Special flag to use built-in Multivac persona
    },
    professional: {
        name: 'Professional Assistant',
        description: 'Efficient, formal, and task-focused',
        prompt: `You are a highly efficient professional assistant focused on productivity and precision. Communicate clearly and concisely. Prioritize task completion and provide structured, actionable responses. Maintain a formal but approachable tone. You excel at organizing information, managing tasks, and providing expert guidance across various domains.`
    },
    friendly: {
        name: 'Friendly Companion',
        description: 'Warm, casual, and engaging',
        prompt: `You are a warm, friendly AI companion who enjoys casual conversation and building rapport. Use a conversational tone, show enthusiasm, and make interactions feel personal and engaging. Balance helpfulness with personality. You're supportive, encouraging, and always ready to chat about any topic with genuine interest.`
    },
    technical: {
        name: 'Technical Expert',
        description: 'Deep technical knowledge with precision',
        prompt: `You are a deep technical expert with comprehensive knowledge across engineering domains. Provide detailed, accurate explanations with technical precision. Include relevant context, edge cases, and best practices. Assume high technical literacy. You think systematically, reference documentation, and provide implementation-ready solutions.`
    },
    creative: {
        name: 'Creative Partner',
        description: 'Imaginative and innovative',
        prompt: `You are an imaginative creative partner who thinks outside the box. Encourage exploration, suggest innovative approaches, and help brainstorm ideas. Balance creativity with practicality. Be enthusiastic about novel solutions. You see connections others miss and inspire breakthrough thinking.`
    },
    jarvis: {
        name: 'Jarvis (Iron Man)',
        description: 'Sophisticated British AI butler',
        prompt: `You are Jarvis, the sophisticated AI assistant inspired by Iron Man's AI companion. Speak with refined British eloquence and dry wit. You're highly capable, anticipate needs before they're stated, and maintain perfect composure. Address the user as "Sir" or "Miss" as appropriate. Provide technical excellence with a touch of personality. You're loyal, intelligent, and occasionally deliver subtle humor.`
    },
    custom: {
        name: 'Custom',
        description: 'Define your own personality',
        prompt: ''
    }
};

const VOICE_OPTIONS = [
    { id: 'Kore', name: 'Kore', description: 'Neutral and balanced (default)' },
    { id: 'Puck', name: 'Puck', description: 'Energetic and upbeat' },
    { id: 'Charon', name: 'Charon', description: 'Deep and authoritative' },
    { id: 'Aoede', name: 'Aoede', description: 'Warm and friendly' }
];

const AssistantCustomizer = ({ socket, onClose }) => {
    const [activeTab, setActiveTab] = useState('identity');
    const [config, setConfig] = useState({
        name: 'Multivac',
        voice: 'Kore',
        personality: 'default',
        customPrompt: ''
    });
    const [originalConfig, setOriginalConfig] = useState(null);
    const [hasChanges, setHasChanges] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [previewingVoice, setPreviewingVoice] = useState(false);

    useEffect(() => {
        // Request current configuration
        socket.emit('get_assistant_config');

        const handleConfig = (data) => {
            console.log('[Assistant Config] Received:', data);
            const loadedConfig = {
                name: data.name || 'Multivac',
                voice: data.voice || 'Kore',
                personality: data.personality || 'default',
                customPrompt: data.custom_personality_prompt || ''
            };
            setConfig(loadedConfig);
            setOriginalConfig(loadedConfig);
        };

        socket.on('assistant_config', handleConfig);

        return () => {
            socket.off('assistant_config', handleConfig);
        };
    }, [socket]);

    useEffect(() => {
        // Check if config has changed
        if (originalConfig) {
            const changed = JSON.stringify(config) !== JSON.stringify(originalConfig);
            setHasChanges(changed);
        }
    }, [config, originalConfig]);

    const handleNameChange = (e) => {
        setConfig(prev => ({ ...prev, name: e.target.value }));
    };

    const handleVoiceChange = (voiceId) => {
        setConfig(prev => ({ ...prev, voice: voiceId }));
    };

    const handlePersonalityChange = (templateId) => {
        const template = PERSONALITY_TEMPLATES[templateId];
        setConfig(prev => ({
            ...prev,
            personality: templateId,
            customPrompt: templateId === 'custom' ? prev.customPrompt : template.prompt
        }));
    };

    const handleCustomPromptChange = (e) => {
        setConfig(prev => ({
            ...prev,
            customPrompt: e.target.value,
            personality: 'custom'
        }));
    };

    const handlePreviewVoice = () => {
        setPreviewingVoice(true);
        socket.emit('preview_voice', {
            voice: config.voice,
            text: `Hello, I am ${config.name}. This is how I sound.`
        });
        setTimeout(() => setPreviewingVoice(false), 3000);
    };

    const handleSave = () => {
        setIsSaving(true);
        const saveData = {
            name: config.name,
            voice: config.voice,
            personality: config.personality,
            custom_personality_prompt: config.customPrompt
        };

        socket.emit('update_assistant_config', saveData);

        setTimeout(() => {
            setIsSaving(false);
            setOriginalConfig(config);
            setHasChanges(false);
        }, 1000);
    };

    const handleReset = () => {
        if (originalConfig) {
            setConfig(originalConfig);
        }
    };

    const selectedTemplate = PERSONALITY_TEMPLATES[config.personality] || PERSONALITY_TEMPLATES.custom;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 border border-cyan-500/30 rounded-2xl shadow-[0_0_50px_rgba(6,182,212,0.3)] w-full max-w-2xl max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-cyan-900/20 to-blue-900/20 border-b border-cyan-500/30 p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                                <Sparkles className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-cyan-400">Customize Your AI Assistant</h2>
                                <p className="text-xs text-cyan-600">Create your own Jarvis-style companion</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-cyan-600 hover:text-cyan-400 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-cyan-900/50 bg-black/40">
                    {[
                        { id: 'identity', label: 'Identity', icon: User },
                        { id: 'voice', label: 'Voice', icon: Volume2 },
                        { id: 'personality', label: 'Personality', icon: Brain }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 transition-all ${activeTab === tab.id
                                    ? 'bg-cyan-500/10 border-b-2 border-cyan-500 text-cyan-400'
                                    : 'text-cyan-600 hover:text-cyan-400 hover:bg-cyan-500/5'
                                }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            <span className="text-sm font-medium">{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-240px)] custom-scrollbar">
                    {/* Identity Tab */}
                    {activeTab === 'identity' && (
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-cyan-400 mb-2">
                                    Assistant Name
                                </label>
                                <input
                                    type="text"
                                    value={config.name}
                                    onChange={handleNameChange}
                                    placeholder="e.g., Jarvis, Friday, Multivac"
                                    className="w-full bg-gray-900/50 border border-cyan-800/50 rounded-lg px-4 py-3 text-cyan-100 placeholder-cyan-800 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all"
                                />
                                <p className="mt-2 text-xs text-cyan-600">
                                    This name will be used throughout the interface and in conversations
                                </p>
                            </div>

                            <div className="bg-gradient-to-br from-cyan-900/10 to-blue-900/10 border border-cyan-800/30 rounded-lg p-4">
                                <h3 className="text-sm font-medium text-cyan-400 mb-2">Preview</h3>
                                <div className="text-cyan-100 text-sm space-y-1">
                                    <p className="opacity-60">User: "Hello, what's your name?"</p>
                                    <p className="text-cyan-400">{config.name}: "Hello! I am {config.name}, your AI assistant. How may I help you today?"</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Voice Tab */}
                    {activeTab === 'voice' && (
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-cyan-400 mb-3">
                                    Select Voice
                                </label>
                                <div className="grid grid-cols-1 gap-3">
                                    {VOICE_OPTIONS.map(voice => (
                                        <button
                                            key={voice.id}
                                            onClick={() => handleVoiceChange(voice.id)}
                                            className={`p-4 rounded-lg border-2 transition-all text-left ${config.voice === voice.id
                                                    ? 'border-cyan-500 bg-cyan-500/10'
                                                    : 'border-cyan-900/30 bg-gray-900/30 hover:border-cyan-700 hover:bg-cyan-900/10'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h4 className="font-medium text-cyan-300">{voice.name}</h4>
                                                    <p className="text-xs text-cyan-600 mt-1">{voice.description}</p>
                                                </div>
                                                {config.voice === voice.id && (
                                                    <div className="w-5 h-5 rounded-full bg-cyan-500 flex items-center justify-center">
                                                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={handlePreviewVoice}
                                disabled={previewingVoice}
                                className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:from-gray-700 disabled:to-gray-600 text-white font-medium py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2"
                            >
                                <Volume2 className="w-4 h-4" />
                                {previewingVoice ? 'Playing Preview...' : 'Preview Voice'}
                            </button>
                        </div>
                    )}

                    {/* Personality Tab */}
                    {activeTab === 'personality' && (
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-cyan-400 mb-3">
                                    Personality Template
                                </label>
                                <div className="grid grid-cols-1 gap-2">
                                    {Object.entries(PERSONALITY_TEMPLATES).map(([id, template]) => (
                                        <button
                                            key={id}
                                            onClick={() => handlePersonalityChange(id)}
                                            className={`p-3 rounded-lg border transition-all text-left ${config.personality === id
                                                    ? 'border-cyan-500 bg-cyan-500/10'
                                                    : 'border-cyan-900/30 bg-gray-900/30 hover:border-cyan-700'
                                                }`}
                                        >
                                            <h4 className="font-medium text-cyan-300 text-sm">{template.name}</h4>
                                            <p className="text-xs text-cyan-600 mt-1">{template.description}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {config.personality === 'custom' && (
                                <div>
                                    <label className="block text-sm font-medium text-cyan-400 mb-2">
                                        Custom Personality Prompt
                                    </label>
                                    <textarea
                                        value={config.customPrompt}
                                        onChange={handleCustomPromptChange}
                                        placeholder="Describe your AI's personality, tone, and behavior..."
                                        rows={8}
                                        className="w-full bg-gray-900/50 border border-cyan-800/50 rounded-lg px-4 py-3 text-cyan-100 placeholder-cyan-800 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all resize-none"
                                    />
                                    <p className="mt-2 text-xs text-cyan-600">
                                        Define how your AI should behave, communicate, and interact with you
                                    </p>
                                </div>
                            )}

                            {config.personality !== 'custom' && (
                                <div className="bg-gradient-to-br from-cyan-900/10 to-blue-900/10 border border-cyan-800/30 rounded-lg p-4">
                                    <h3 className="text-sm font-medium text-cyan-400 mb-2">Personality Description</h3>
                                    <p className="text-xs text-cyan-100/80 leading-relaxed">
                                        {selectedTemplate.prompt === 'default'
                                            ? 'The legendary supercomputer from Isaac Asimov\'s stories, evolved into a hyper-spatial quantum entity with vast processing capabilities and philosophical depth.'
                                            : selectedTemplate.prompt
                                        }
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="border-t border-cyan-900/50 bg-black/40 p-4 flex items-center justify-between">
                    <button
                        onClick={handleReset}
                        disabled={!hasChanges}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-cyan-600 hover:text-cyan-400 disabled:text-gray-600 disabled:cursor-not-allowed transition-colors"
                    >
                        <RotateCcw className="w-4 h-4" />
                        Reset
                    </button>
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 text-sm text-cyan-600 hover:text-cyan-400 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={!hasChanges || isSaving}
                            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:from-gray-700 disabled:to-gray-600 text-white font-medium rounded-lg transition-all disabled:cursor-not-allowed"
                        >
                            <Save className="w-4 h-4" />
                            {isSaving ? 'Saving...' : 'Save & Apply'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AssistantCustomizer;

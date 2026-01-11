'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Option, ProCon, Mood, Personality, DecisionContext, generateId, detectTimeOfDay } from '@/lib/decisionEngine';
import ContextPanel from './ContextPanel';

interface DecisionInputProps {
    onCalculate: (data: {
        title: string;
        options: Option[];
        importance: number;
        mood: Mood;
        personality: Personality;
        context: DecisionContext;
    }) => void;
    isCalculating: boolean;
    initialOptions?: Option[];
}

const moods: { value: Mood; label: string; emoji: string }[] = [
    { value: 'neutral', label: 'Neutral', emoji: '😐' },
    { value: 'stressed', label: 'Stressed', emoji: '😰' },
    { value: 'tired', label: 'Tired', emoji: '😴' },
    { value: 'excited', label: 'Excited', emoji: '🤩' },
    { value: 'sad', label: 'Sad', emoji: '😢' },
    { value: 'confused', label: 'Confused', emoji: '😵' },
];

const personalities: { value: Personality; label: string; description: string }[] = [
    { value: 'balanced', label: 'Balanced', description: 'Consider all factors equally' },
    { value: 'logical', label: 'Logical', description: 'Pure calculation, no emotional weight' },
    { value: 'emotional', label: 'Emotional', description: 'Higher weight on comfort factors' },
    { value: 'risk-taker', label: 'Risk-Taker', description: 'Embrace uncertainty' },
    { value: 'conservative', label: 'Conservative', description: 'Prefer safe choices' },
];

function createEmptyOption(): Option {
    return {
        id: generateId(),
        name: '',
        pros: [{ id: generateId(), text: '', weight: 5 }],
        cons: [{ id: generateId(), text: '', weight: 5 }],
        confidence: 5,
    };
}

export default function DecisionInput({ onCalculate, isCalculating, initialOptions }: DecisionInputProps) {
    const [title, setTitle] = useState('');
    const [options, setOptions] = useState<Option[]>(initialOptions || [createEmptyOption(), createEmptyOption()]);
    const [activeOptionIndex, setActiveOptionIndex] = useState(0);
    const [importance, setImportance] = useState(5);
    const [mood, setMood] = useState<Mood>('neutral');
    const [personality, setPersonality] = useState<Personality>('balanced');
    const [context, setContext] = useState<DecisionContext>({
        timeOfDay: detectTimeOfDay(),
        urgency: 5,
        stressLevel: 5,
    });

    // Update options when initialOptions changes (from AI analysis)
    useEffect(() => {
        if (initialOptions && initialOptions.length > 0) {
            setOptions(initialOptions);
        }
    }, [initialOptions]);

    const activeOption = options[activeOptionIndex];

    const addOption = () => {
        if (options.length < 6) {
            setOptions([...options, createEmptyOption()]);
            setActiveOptionIndex(options.length);
        }
    };

    const removeOption = (index: number) => {
        if (options.length > 2) {
            const newOptions = options.filter((_, i) => i !== index);
            setOptions(newOptions);
            if (activeOptionIndex >= newOptions.length) {
                setActiveOptionIndex(newOptions.length - 1);
            } else if (activeOptionIndex > index) {
                setActiveOptionIndex(activeOptionIndex - 1);
            }
        }
    };

    const updateOption = (index: number, updates: Partial<Option>) => {
        setOptions(options.map((opt, i) => i === index ? { ...opt, ...updates } : opt));
    };

    const addPro = () => {
        const newPros = [...activeOption.pros, { id: generateId(), text: '', weight: 5 }];
        updateOption(activeOptionIndex, { pros: newPros });
    };

    const addCon = () => {
        const newCons = [...activeOption.cons, { id: generateId(), text: '', weight: 5 }];
        updateOption(activeOptionIndex, { cons: newCons });
    };

    const updatePro = (id: string, field: 'text' | 'weight', value: string | number) => {
        const newPros = activeOption.pros.map(p => p.id === id ? { ...p, [field]: value } : p);
        updateOption(activeOptionIndex, { pros: newPros });
    };

    const updateCon = (id: string, field: 'text' | 'weight', value: string | number) => {
        const newCons = activeOption.cons.map(c => c.id === id ? { ...c, [field]: value } : c);
        updateOption(activeOptionIndex, { cons: newCons });
    };

    const removePro = (id: string) => {
        if (activeOption.pros.length > 1) {
            const newPros = activeOption.pros.filter(p => p.id !== id);
            updateOption(activeOptionIndex, { pros: newPros });
        }
    };

    const removeCon = (id: string) => {
        if (activeOption.cons.length > 1) {
            const newCons = activeOption.cons.filter(c => c.id !== id);
            updateOption(activeOptionIndex, { cons: newCons });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validate
        const validOptions = options.filter(opt =>
            opt.name.trim() &&
            (opt.pros.some(p => p.text.trim()) || opt.cons.some(c => c.text.trim()))
        ).map(opt => ({
            ...opt,
            pros: opt.pros.filter(p => p.text.trim()),
            cons: opt.cons.filter(c => c.text.trim()),
        }));

        if (!title.trim()) {
            alert('Please enter a decision title');
            return;
        }

        if (validOptions.length < 2) {
            alert('Please add at least 2 options with names and pros/cons');
            return;
        }

        onCalculate({
            title: title.trim(),
            options: validOptions,
            importance,
            mood,
            personality,
            context,
        });
    };

    return (
        <motion.div
            className="card p-6 relative z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <span className="text-[var(--spider-red)]">🎯</span>
                Decision Input
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Decision Title */}
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                        What decision are you facing?
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g., Which job offer should I accept?"
                        className="w-full"
                    />
                </div>

                {/* Options Tabs */}
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-3">
                        Your Options ({options.length}/6)
                    </label>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {options.map((option, index) => (
                            <motion.div
                                key={option.id}
                                layout
                                className="relative"
                            >
                                <button
                                    type="button"
                                    onClick={() => setActiveOptionIndex(index)}
                                    className={`px-4 py-2 rounded-lg border transition-all ${activeOptionIndex === index
                                        ? 'border-[var(--spider-blue)] bg-[var(--spider-blue)]/20 text-white'
                                        : 'border-gray-700 hover:border-gray-600 text-gray-400'
                                        }`}
                                >
                                    {option.name || `Option ${index + 1}`}
                                </button>
                                {options.length > 2 && (
                                    <button
                                        type="button"
                                        onClick={() => removeOption(index)}
                                        className="absolute -top-2 -right-2 w-5 h-5 bg-gray-800 rounded-full text-gray-500 hover:text-red-400 hover:bg-gray-700 transition-colors text-xs flex items-center justify-center"
                                    >
                                        ×
                                    </button>
                                )}
                            </motion.div>
                        ))}
                        {options.length < 6 && (
                            <button
                                type="button"
                                onClick={addOption}
                                className="px-4 py-2 rounded-lg border border-dashed border-gray-700 text-gray-500 hover:border-[var(--spider-blue)] hover:text-[var(--spider-blue)] transition-all"
                            >
                                + Add Option
                            </button>
                        )}
                    </div>

                    {/* Active Option Editor */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeOption.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                            className="bg-[var(--background)] rounded-lg p-4 border border-gray-800"
                        >
                            {/* Option Name */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                    Option Name
                                </label>
                                <input
                                    type="text"
                                    value={activeOption.name}
                                    onChange={(e) => updateOption(activeOptionIndex, { name: e.target.value })}
                                    placeholder={`e.g., Company A, Stay in current job...`}
                                    className="w-full"
                                />
                            </div>

                            {/* Confidence Slider */}
                            <div className="mb-4">
                                <label className="flex justify-between text-sm font-medium text-gray-400 mb-2">
                                    <span>How confident are you about this option?</span>
                                    <span className="text-[var(--spider-blue)]">{activeOption.confidence}/10</span>
                                </label>
                                <input
                                    type="range"
                                    min="1"
                                    max="10"
                                    value={activeOption.confidence}
                                    onChange={(e) => updateOption(activeOptionIndex, { confidence: parseInt(e.target.value) })}
                                    className="w-full"
                                />
                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                    <span>Very uncertain</span>
                                    <span>Very confident</span>
                                </div>
                            </div>

                            {/* Pros and Cons Grid */}
                            <div className="grid md:grid-cols-2 gap-4">
                                {/* Pros */}
                                <div>
                                    <label className="block text-sm font-medium text-green-400 mb-2 flex items-center gap-2">
                                        <span>✅</span> Pros
                                    </label>
                                    <div className="space-y-2">
                                        {activeOption.pros.map((pro) => (
                                            <div key={pro.id} className="flex gap-2 items-center">
                                                <input
                                                    type="text"
                                                    value={pro.text}
                                                    onChange={(e) => updatePro(pro.id, 'text', e.target.value)}
                                                    placeholder="Add a benefit..."
                                                    className="flex-1 py-2 px-3 text-sm"
                                                />
                                                <div className="flex items-center gap-1 min-w-[70px]">
                                                    <input
                                                        type="range"
                                                        min="1"
                                                        max="10"
                                                        value={pro.weight}
                                                        onChange={(e) => updatePro(pro.id, 'weight', parseInt(e.target.value))}
                                                        className="w-12"
                                                    />
                                                    <span className="text-xs text-gray-400 w-4">{pro.weight}</span>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removePro(pro.id)}
                                                    className="text-gray-500 hover:text-red-400 transition-colors"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={addPro}
                                        className="mt-2 text-sm text-green-400 hover:text-green-300 transition-colors"
                                    >
                                        + Add Pro
                                    </button>
                                </div>

                                {/* Cons */}
                                <div>
                                    <label className="block text-sm font-medium text-[var(--spider-red)] mb-2 flex items-center gap-2">
                                        <span>❌</span> Cons
                                    </label>
                                    <div className="space-y-2">
                                        {activeOption.cons.map((con) => (
                                            <div key={con.id} className="flex gap-2 items-center">
                                                <input
                                                    type="text"
                                                    value={con.text}
                                                    onChange={(e) => updateCon(con.id, 'text', e.target.value)}
                                                    placeholder="Add a drawback..."
                                                    className="flex-1 py-2 px-3 text-sm"
                                                />
                                                <div className="flex items-center gap-1 min-w-[70px]">
                                                    <input
                                                        type="range"
                                                        min="1"
                                                        max="10"
                                                        value={con.weight}
                                                        onChange={(e) => updateCon(con.id, 'weight', parseInt(e.target.value))}
                                                        className="w-12"
                                                    />
                                                    <span className="text-xs text-gray-400 w-4">{con.weight}</span>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeCon(con.id)}
                                                    className="text-gray-500 hover:text-red-400 transition-colors"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={addCon}
                                        className="mt-2 text-sm text-[var(--spider-red)] hover:opacity-80 transition-opacity"
                                    >
                                        + Add Con
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Context Awareness */}
                <ContextPanel context={context} onChange={setContext} />

                {/* Importance Slider */}
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                        How important is this decision? <span className="text-[var(--spider-blue)]">{importance}/10</span>
                    </label>
                    <input
                        type="range"
                        min="1"
                        max="10"
                        value={importance}
                        onChange={(e) => setImportance(parseInt(e.target.value))}
                        className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Minor</span>
                        <span>Life-changing</span>
                    </div>
                </div>

                {/* Mood Selector */}
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-3">
                        How are you feeling right now?
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {moods.map((m) => (
                            <motion.button
                                key={m.value}
                                type="button"
                                onClick={() => setMood(m.value)}
                                className={`mood-pill ${mood === m.value ? 'active' : ''}`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {m.emoji} {m.label}
                            </motion.button>
                        ))}
                    </div>
                </div>

                {/* Personality Profile */}
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-3">
                        Decision-making style
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                        {personalities.map((p) => (
                            <motion.button
                                key={p.value}
                                type="button"
                                onClick={() => setPersonality(p.value)}
                                className={`p-3 rounded-lg border transition-all text-center ${personality === p.value
                                    ? 'border-[var(--spider-blue)] bg-[var(--spider-blue)]/10'
                                    : 'border-gray-700 hover:border-gray-600'
                                    }`}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <div className="text-sm font-medium">{p.label}</div>
                                <div className="text-xs text-gray-500 mt-1 hidden md:block">{p.description}</div>
                            </motion.button>
                        ))}
                    </div>
                </div>

                {/* Submit Button */}
                <motion.button
                    type="submit"
                    disabled={isCalculating}
                    className="btn-primary w-full text-lg py-4 flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                >
                    {isCalculating ? (
                        <>
                            <div className="web-spinner w-6 h-6"></div>
                            Analyzing {options.filter(o => o.name.trim()).length} options...
                        </>
                    ) : (
                        <>
                            🕸️ Analyze My Options
                        </>
                    )}
                </motion.button>
            </form>
        </motion.div>
    );
}

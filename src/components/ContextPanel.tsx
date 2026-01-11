'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DecisionContext, detectTimeOfDay } from '@/lib/decisionEngine';

interface ContextPanelProps {
    context: DecisionContext;
    onChange: (context: DecisionContext) => void;
}

const timeOptions: { value: DecisionContext['timeOfDay']; label: string; emoji: string }[] = [
    { value: 'morning', label: 'Morning', emoji: '🌅' },
    { value: 'afternoon', label: 'Afternoon', emoji: '☀️' },
    { value: 'evening', label: 'Evening', emoji: '🌆' },
    { value: 'night', label: 'Night', emoji: '🌙' },
];

export default function ContextPanel({ context, onChange }: ContextPanelProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    const handleTimeChange = (timeOfDay: DecisionContext['timeOfDay']) => {
        onChange({ ...context, timeOfDay });
    };

    const handleUrgencyChange = (urgency: number) => {
        onChange({ ...context, urgency });
    };

    const handleStressChange = (stressLevel: number) => {
        onChange({ ...context, stressLevel });
    };

    const autoDetectTime = () => {
        onChange({ ...context, timeOfDay: detectTimeOfDay() });
    };

    return (
        <div className="mb-6">
            <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-3"
            >
                <motion.span
                    animate={{ rotate: isExpanded ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    ▶
                </motion.span>
                <span>⏰ Context Awareness</span>
                <span className="text-xs text-gray-600">
                    (affects how we weigh your decision)
                </span>
            </button>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <div className="bg-[var(--background)] rounded-lg p-4 space-y-4 border border-gray-800">
                            {/* Time of Day */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-sm text-gray-400">Time of Day</label>
                                    <button
                                        type="button"
                                        onClick={autoDetectTime}
                                        className="text-xs text-[var(--spider-blue)] hover:underline"
                                    >
                                        Auto-detect
                                    </button>
                                </div>
                                <div className="flex gap-2">
                                    {timeOptions.map((option) => (
                                        <button
                                            key={option.value}
                                            type="button"
                                            onClick={() => handleTimeChange(option.value)}
                                            className={`flex-1 py-2 px-2 rounded-lg border text-sm transition-all ${context.timeOfDay === option.value
                                                    ? 'border-[var(--spider-blue)] bg-[var(--spider-blue)]/10 text-white'
                                                    : 'border-gray-700 hover:border-gray-600 text-gray-400'
                                                }`}
                                        >
                                            <span className="block text-lg mb-1">{option.emoji}</span>
                                            <span className="hidden sm:block text-xs">{option.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Urgency */}
                            <div>
                                <label className="flex justify-between text-sm text-gray-400 mb-2">
                                    <span>Urgency Level</span>
                                    <span className={`font-medium ${context.urgency > 7 ? 'text-[var(--spider-red)]' :
                                            context.urgency < 3 ? 'text-green-400' : 'text-[var(--spider-blue)]'
                                        }`}>
                                        {context.urgency}/10
                                    </span>
                                </label>
                                <input
                                    type="range"
                                    min="1"
                                    max="10"
                                    value={context.urgency}
                                    onChange={(e) => handleUrgencyChange(parseInt(e.target.value))}
                                    className="w-full"
                                />
                                <div className="flex justify-between text-xs text-gray-600 mt-1">
                                    <span>No rush</span>
                                    <span>Decide now!</span>
                                </div>
                            </div>

                            {/* Stress Level */}
                            <div>
                                <label className="flex justify-between text-sm text-gray-400 mb-2">
                                    <span>Current Stress Level</span>
                                    <span className={`font-medium ${context.stressLevel > 7 ? 'text-[var(--spider-red)]' :
                                            context.stressLevel < 3 ? 'text-green-400' : 'text-[var(--spider-blue)]'
                                        }`}>
                                        {context.stressLevel}/10
                                    </span>
                                </label>
                                <input
                                    type="range"
                                    min="1"
                                    max="10"
                                    value={context.stressLevel}
                                    onChange={(e) => handleStressChange(parseInt(e.target.value))}
                                    className="w-full"
                                />
                                <div className="flex justify-between text-xs text-gray-600 mt-1">
                                    <span>😌 Calm</span>
                                    <span>😰 Very stressed</span>
                                </div>
                            </div>

                            {/* Info tooltip */}
                            <p className="text-xs text-gray-600 italic">
                                💡 High stress and urgency will favor safer, simpler options.
                                Night-time decisions get a slight penalty for clarity.
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

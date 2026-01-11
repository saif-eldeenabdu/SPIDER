'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Decision, OptionResult } from '@/lib/decisionEngine';

interface ResultPanelProps {
    decision: Decision;
    onReset: () => void;
}

export default function ResultPanel({ decision, onReset }: ResultPanelProps) {
    const [showSpider, setShowSpider] = useState(false);
    const [expandedOption, setExpandedOption] = useState<string | null>(null);

    useEffect(() => {
        // Easter egg: show spider after a moment of viewing results
        const timer = setTimeout(() => {
            if (decision.winningOption && decision.winningOption.score > 15) {
                setShowSpider(true);
            }
        }, 2000);
        return () => clearTimeout(timer);
    }, [decision]);

    const getScoreClass = (score: number) => {
        if (score > 10) return 'text-green-400';
        if (score > 0) return 'text-[var(--spider-blue)]';
        if (score > -10) return 'text-yellow-400';
        return 'text-[var(--spider-red)]';
    };

    const getScoreEmoji = (score: number) => {
        if (score > 20) return '🚀';
        if (score > 10) return '👍';
        if (score > 0) return '🤔';
        if (score > -10) return '👎';
        return '⛔';
    };

    const getRankBadge = (index: number) => {
        if (index === 0) return { emoji: '🥇', label: 'Best Choice', color: 'text-yellow-400' };
        if (index === 1) return { emoji: '🥈', label: 'Runner Up', color: 'text-gray-400' };
        if (index === 2) return { emoji: '🥉', label: 'Third Place', color: 'text-amber-600' };
        return { emoji: `#${index + 1}`, label: '', color: 'text-gray-500' };
    };

    return (
        <motion.div
            className="card p-6 relative z-10"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
            {/* Spider Easter Egg */}
            <AnimatePresence>
                {showSpider && (
                    <motion.div
                        className="absolute top-4 right-4 text-[var(--spider-red)] opacity-30"
                        initial={{ opacity: 0, y: -20, rotate: 0 }}
                        animate={{ opacity: 0.3, y: 0, rotate: 360 }}
                        exit={{ opacity: 0, scale: 0 }}
                        transition={{ duration: 1, type: 'spring' }}
                    >
                        <svg viewBox="0 0 100 100" className="w-12 h-12">
                            <ellipse cx="50" cy="55" rx="18" ry="25" fill="currentColor" />
                            <ellipse cx="50" cy="35" rx="10" ry="12" fill="currentColor" />
                            {/* Spider legs */}
                            <path d="M 32 40 Q 15 30 5 20" stroke="currentColor" strokeWidth="3" fill="none" />
                            <path d="M 68 40 Q 85 30 95 20" stroke="currentColor" strokeWidth="3" fill="none" />
                            <path d="M 30 50 Q 10 50 0 45" stroke="currentColor" strokeWidth="3" fill="none" />
                            <path d="M 70 50 Q 90 50 100 45" stroke="currentColor" strokeWidth="3" fill="none" />
                            <path d="M 30 60 Q 10 65 0 70" stroke="currentColor" strokeWidth="3" fill="none" />
                            <path d="M 70 60 Q 90 65 100 70" stroke="currentColor" strokeWidth="3" fill="none" />
                            <path d="M 35 75 Q 20 85 10 95" stroke="currentColor" strokeWidth="3" fill="none" />
                            <path d="M 65 75 Q 80 85 90 95" stroke="currentColor" strokeWidth="3" fill="none" />
                        </svg>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.h2
                className="text-2xl font-bold mb-6 flex items-center gap-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
            >
                <span className="text-[var(--spider-red)]">📊</span>
                Decision Analysis
            </motion.h2>

            {/* Decision Title */}
            <motion.div
                className="text-center mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                <p className="text-gray-400 text-sm mb-2">Analysis for:</p>
                <h3 className="text-xl font-semibold">&quot;{decision.title}&quot;</h3>
            </motion.div>

            {/* Overall Verdict */}
            <motion.div
                className="bg-gradient-to-r from-[var(--spider-red)]/10 to-[var(--spider-blue)]/10 rounded-lg p-6 mb-6 text-center border border-gray-800"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <p className="text-lg">{decision.explanation}</p>
                {decision.winningOption && (
                    <motion.div
                        className="mt-4"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
                    >
                        <p className="text-3xl font-bold text-[var(--spider-blue)]">
                            {decision.winningOption.optionName}
                        </p>
                        <p className="text-gray-400 mt-2">
                            {decision.winningOption.recommendation}
                        </p>
                    </motion.div>
                )}
            </motion.div>

            {/* Ranked Options */}
            <div className="space-y-3 mb-6">
                <h4 className="text-sm font-medium text-gray-400 mb-3">All Options Ranked</h4>
                {decision.results.map((result, index) => {
                    const badge = getRankBadge(index);
                    const isExpanded = expandedOption === result.optionId;

                    return (
                        <motion.div
                            key={result.optionId}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 + index * 0.1 }}
                            className={`bg-[var(--background)] rounded-lg overflow-hidden border transition-colors ${index === 0
                                    ? 'border-[var(--spider-blue)]/50'
                                    : 'border-gray-800'
                                }`}
                        >
                            <div
                                className="p-4 cursor-pointer hover:bg-gray-900/50 transition-colors"
                                onClick={() => setExpandedOption(isExpanded ? null : result.optionId)}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className={`text-xl ${badge.color}`}>{badge.emoji}</span>
                                        <div>
                                            <p className="font-medium">{result.optionName}</p>
                                            {badge.label && (
                                                <p className="text-xs text-gray-500">{badge.label}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`text-2xl font-bold ${getScoreClass(result.score)}`}>
                                            {result.score > 0 ? '+' : ''}{result.score}
                                        </span>
                                        <span className="text-xl">{getScoreEmoji(result.score)}</span>
                                        <motion.span
                                            className="text-gray-500"
                                            animate={{ rotate: isExpanded ? 180 : 0 }}
                                        >
                                            ▼
                                        </motion.span>
                                    </div>
                                </div>
                            </div>

                            <AnimatePresence>
                                {isExpanded && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="px-4 pb-4 pt-2 border-t border-gray-800">
                                            <p className="text-sm text-gray-400 mb-3">{result.recommendation}</p>

                                            {/* Score Breakdown */}
                                            <div className="bg-gray-900/50 rounded p-3">
                                                <p className="text-xs text-gray-500 mb-2 font-medium">Score Breakdown</p>
                                                <div className="space-y-1 text-sm font-mono">
                                                    {result.breakdown.factors.map((factor, i) => (
                                                        <p key={i} className="text-gray-400">{factor}</p>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Pros/Cons visualization */}
                                            <div className="grid grid-cols-2 gap-3 mt-3">
                                                <div>
                                                    <p className="text-xs text-green-400 mb-1">
                                                        Pros Contribution: +{result.breakdown.prosContribution.toFixed(1)}
                                                    </p>
                                                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                                                        <motion.div
                                                            className="h-full bg-green-400"
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${Math.min(100, result.breakdown.prosContribution * 5)}%` }}
                                                            transition={{ delay: 0.2 }}
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-[var(--spider-red)] mb-1">
                                                        Cons Impact: -{result.breakdown.consContribution.toFixed(1)}
                                                    </p>
                                                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                                                        <motion.div
                                                            className="h-full bg-[var(--spider-red)]"
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${Math.min(100, result.breakdown.consContribution * 5)}%` }}
                                                            transition={{ delay: 0.3 }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    );
                })}
            </div>

            {/* Context Info */}
            <motion.div
                className="flex flex-wrap gap-2 mb-6 text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
            >
                <span className="px-3 py-1 bg-[var(--background)] rounded-full text-gray-400">
                    🎭 Mood: {decision.mood}
                </span>
                <span className="px-3 py-1 bg-[var(--background)] rounded-full text-gray-400">
                    🧠 Style: {decision.personality}
                </span>
                <span className="px-3 py-1 bg-[var(--background)] rounded-full text-gray-400">
                    ⚖️ Importance: {decision.importance}/10
                </span>
                <span className="px-3 py-1 bg-[var(--background)] rounded-full text-gray-400">
                    ⏰ {decision.context.timeOfDay}
                </span>
            </motion.div>

            {/* Easter Egg Message */}
            <motion.p
                className="text-center text-sm text-gray-500 italic mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
            >
                &quot;With great data comes great responsibility.&quot;
            </motion.p>

            {/* Actions */}
            <motion.div
                className="flex gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
            >
                <motion.button
                    onClick={onReset}
                    className="btn-secondary flex-1"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    🔄 New Decision
                </motion.button>
            </motion.div>
        </motion.div>
    );
}

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LegacyDecision } from '@/lib/decisionEngine';
import { getDecisionHistory, deleteDecision, clearHistory } from '@/lib/storage';

interface DecisionHistoryProps {
    onClose?: () => void;
    onSelectDecision?: (decision: LegacyDecision) => void;
}

export default function DecisionHistory({ onClose, onSelectDecision }: DecisionHistoryProps) {
    const [history, setHistory] = useState<LegacyDecision[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = () => {
        const decisions = getDecisionHistory();
        setHistory(decisions);
        setIsLoading(false);
    };

    const handleDelete = (id: string) => {
        deleteDecision(id);
        loadHistory();
    };

    const handleClear = () => {
        if (confirm('Are you sure you want to clear all history?')) {
            clearHistory();
            loadHistory();
        }
    };

    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getScoreClass = (score: number) => {
        if (score > 5) return 'text-green-400';
        if (score < -5) return 'text-[var(--spider-red)]';
        return 'text-[var(--spider-blue)]';
    };

    return (
        <motion.div
            className="card p-6 relative z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <span className="text-[var(--spider-red)]">📜</span>
                    Decision History
                </h2>
                <div className="flex gap-2">
                    {history.length > 0 && (
                        <button
                            onClick={handleClear}
                            className="text-sm text-gray-500 hover:text-red-400 transition-colors"
                        >
                            Clear All
                        </button>
                    )}
                    {onClose && (
                        <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors text-2xl ml-2">
                            ×
                        </button>
                    )}
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-8">
                    <div className="web-spinner"></div>
                </div>
            ) : history.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    <p className="text-4xl mb-4">🕸️</p>
                    <p>No decisions yet. Start analyzing!</p>
                </div>
            ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                    <AnimatePresence>
                        {history.map((decision, index) => (
                            <motion.div
                                key={decision.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-[var(--background)] rounded-lg p-4 hover:bg-gray-900 transition-colors cursor-pointer group"
                                onClick={() => onSelectDecision?.(decision)}
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-medium truncate">{decision.title}</h3>
                                        <p className="text-sm text-gray-500">{formatDate(decision.timestamp)}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`text-lg font-bold ${getScoreClass(decision.score)}`}>
                                            {decision.score > 0 ? '+' : ''}{decision.score}
                                        </span>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(decision.id);
                                            }}
                                            className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition-all"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                                <div className="flex gap-2 mt-2 text-xs">
                                    <span className="px-2 py-0.5 bg-gray-800 rounded">
                                        {decision.mood}
                                    </span>
                                    <span className="px-2 py-0.5 bg-gray-800 rounded">
                                        {decision.personality}
                                    </span>
                                    <span className="px-2 py-0.5 bg-gray-800 rounded">
                                        {decision.pros.length} pros / {decision.cons.length} cons
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            <p className="text-center text-xs text-gray-600 mt-4">
                History is stored locally in your browser
            </p>
        </motion.div>
    );
}

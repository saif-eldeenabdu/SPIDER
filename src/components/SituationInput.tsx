'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { analyzeDecision, AIAnalysisResult } from '@/lib/aiEngine';
import { Option } from '@/lib/decisionEngine';

interface SituationInputProps {
    onAnalysisComplete: (result: AIAnalysisResult) => void;
}

const examplePrompts = [
    "I got a job offer with higher pay but I'd have to relocate...",
    "Should I stay in this relationship or move on?",
    "I'm thinking about buying a car but it's expensive...",
    "I can't decide whether to go back to school or keep working..."
];

export default function SituationInput({ onAnalysisComplete }: SituationInputProps) {
    const [situation, setSituation] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [showExamples, setShowExamples] = useState(false);

    const handleAnalyze = async () => {
        if (!situation.trim()) {
            return;
        }

        setIsAnalyzing(true);

        // Simulate AI processing time for dramatic effect
        await new Promise(resolve => setTimeout(resolve, 2000));

        const result = analyzeDecision(situation);

        setIsAnalyzing(false);
        onAnalysisComplete(result);
    };

    const handleExampleClick = (example: string) => {
        setSituation(example);
        setShowExamples(false);
    };

    return (
        <motion.div
            className="card p-6 relative z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Web strand decorations */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--spider-red)] to-transparent opacity-30" />
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--spider-blue)] to-transparent opacity-30" />

            <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                <motion.span
                    className="text-[var(--spider-red)]"
                    animate={{
                        textShadow: ['0 0 10px rgba(193, 18, 31, 0.5)', '0 0 20px rgba(193, 18, 31, 0.8)', '0 0 10px rgba(193, 18, 31, 0.5)']
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    🕷️
                </motion.span>
                SPIDER Analysis
            </h2>
            <p className="text-gray-400 text-sm mb-6">
                Describe your situation. I'll extract your options and analyze each path forward.
            </p>

            <div className="space-y-4">
                {/* Situation Input */}
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                        What decision are you facing?
                    </label>
                    <textarea
                        value={situation}
                        onChange={(e) => setSituation(e.target.value)}
                        placeholder="Tell me about your situation in your own words..."
                        className="w-full min-h-[120px] resize-none"
                        disabled={isAnalyzing}
                    />
                </div>

                {/* Example prompts */}
                <div>
                    <button
                        type="button"
                        onClick={() => setShowExamples(!showExamples)}
                        className="text-sm text-[var(--spider-blue)] hover:underline flex items-center gap-1"
                    >
                        {showExamples ? '▼' : '▶'} Need inspiration? See examples
                    </button>

                    <AnimatePresence>
                        {showExamples && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden mt-2"
                            >
                                <div className="grid gap-2">
                                    {examplePrompts.map((example, i) => (
                                        <motion.button
                                            key={i}
                                            type="button"
                                            onClick={() => handleExampleClick(example)}
                                            className="text-left text-sm p-3 bg-[var(--background)] rounded-lg border border-gray-800 hover:border-[var(--spider-blue)] transition-colors"
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                        >
                                            "{example}"
                                        </motion.button>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Analyze Button */}
                <motion.button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing || !situation.trim()}
                    className="btn-primary w-full text-lg py-4 flex items-center justify-center gap-3"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                >
                    {isAnalyzing ? (
                        <>
                            <div className="relative">
                                <div className="web-spinner w-6 h-6"></div>
                            </div>
                            <span>Analyzing your situation...</span>
                        </>
                    ) : (
                        <>
                            <motion.span
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            >
                                🕸️
                            </motion.span>
                            Analyze My Situation
                        </>
                    )}
                </motion.button>

                {/* Processing hints */}
                <AnimatePresence>
                    {isAnalyzing && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="text-center space-y-2"
                        >
                            <motion.p
                                className="text-sm text-gray-500"
                                animate={{ opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            >
                                Extracting decision options...
                            </motion.p>
                            <motion.p
                                className="text-sm text-gray-500"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                            >
                                Generating pros and cons...
                            </motion.p>
                            <motion.p
                                className="text-sm text-gray-500"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 1.5, repeat: Infinity, delay: 1 }}
                            >
                                Identifying hidden risks...
                            </motion.p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}

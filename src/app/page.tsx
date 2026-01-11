'use client';

import { useState, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Decision, Option, Mood, Personality, DecisionContext, LegacyDecision,
  calculateMultiOptionScore, generateId, detectTimeOfDay
} from '@/lib/decisionEngine';
import { analyzeDecision, enhanceWithStrategistTone } from '@/lib/aiEngine';
import { saveDecision } from '@/lib/storage';
import { soundEngine } from '@/lib/soundEngine';

type Stage = 'input' | 'analyzing' | 'result';

// Memoized result display component
const ResultDisplay = memo(function ResultDisplay({
  decision,
  onReset
}: {
  decision: Decision;
  onReset: () => void;
}) {
  const winner = decision.winningOption;
  const scoreClass = winner && winner.score > 10 ? 'text-green-400' :
    winner && winner.score > 0 ? 'text-[var(--accent)]' :
      'text-red-400';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Verdict */}
      <div className="text-center py-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
          className="text-6xl mb-4"
        >
          {winner && winner.score > 10 ? '🎯' : winner && winner.score > 0 ? '🤔' : '⚠️'}
        </motion.div>

        {winner && (
          <motion.h2
            className={`text-3xl font-bold mb-2 ${scoreClass}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {winner.optionName}
          </motion.h2>
        )}

        <motion.p
          className="text-xl text-gray-300 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {decision.explanation}
        </motion.p>
      </div>

      {/* Options breakdown */}
      <div className="grid gap-4">
        {decision.results.map((result, i) => (
          <motion.div
            key={result.optionId}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + i * 0.1 }}
            className={`p-4 rounded-xl border ${i === 0 ? 'border-[var(--accent)] bg-[var(--accent)]/5' : 'border-gray-800 bg-gray-900/50'
              }`}
          >
            <div className="flex justify-between items-center mb-3">
              <span className="font-semibold text-lg">{result.optionName}</span>
              <span className={`text-2xl font-bold ${result.score > 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                {result.score > 0 ? '+' : ''}{result.score}
              </span>
            </div>

            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-green-400 font-medium mb-1">Pros</p>
                <ul className="space-y-1 text-gray-400">
                  {decision.options.find(o => o.id === result.optionId)?.pros.map(p => (
                    <li key={p.id}>+ {p.text}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-red-400 font-medium mb-1">Cons</p>
                <ul className="space-y-1 text-gray-400">
                  {decision.options.find(o => o.id === result.optionId)?.cons.map(c => (
                    <li key={c.id}>− {c.text}</li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Reset */}
      <motion.button
        onClick={onReset}
        className="w-full py-4 rounded-xl border border-gray-700 text-gray-400 hover:text-white hover:border-[var(--accent)] transition-all"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        Analyze Another Decision
      </motion.button>
    </motion.div>
  );
});

export default function Home() {
  const [stage, setStage] = useState<Stage>('input');
  const [situation, setSituation] = useState('');
  const [decision, setDecision] = useState<Decision | null>(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);

  // Debounced analysis function
  const runAnalysis = useCallback(async () => {
    if (!situation.trim()) return;

    setStage('analyzing');
    setAnalysisProgress(0);
    soundEngine?.playWebSling();

    // Simulate analysis phases
    const phases = [
      { progress: 20, delay: 300 },
      { progress: 50, delay: 600 },
      { progress: 80, delay: 400 },
      { progress: 100, delay: 300 },
    ];

    for (const phase of phases) {
      await new Promise(r => setTimeout(r, phase.delay));
      setAnalysisProgress(phase.progress);
    }

    // Run AI analysis
    const analysis = analyzeDecision(situation);

    // Calculate scores
    const context: DecisionContext = {
      timeOfDay: detectTimeOfDay(),
      urgency: 5,
      stressLevel: 5,
    };

    const { results, winningOption, explanation } = calculateMultiOptionScore(
      analysis.options,
      7, // importance
      'neutral',
      'balanced',
      context
    );

    // Apply strategist tone
    const strategistAdvice = winningOption
      ? enhanceWithStrategistTone(winningOption.recommendation, winningOption.score)
      : explanation;

    const finalDecision: Decision = {
      id: generateId(),
      title: situation.substring(0, 100),
      options: analysis.options,
      importance: 7,
      mood: 'neutral',
      personality: 'balanced',
      context,
      timestamp: Date.now(),
      results,
      winningOption,
      explanation: strategistAdvice,
    };

    // Save
    const legacy: LegacyDecision = {
      id: finalDecision.id,
      title: finalDecision.title,
      pros: finalDecision.options[0]?.pros || [],
      cons: finalDecision.options[0]?.cons || [],
      importance: finalDecision.importance,
      mood: finalDecision.mood,
      personality: finalDecision.personality,
      timestamp: finalDecision.timestamp,
      score: finalDecision.winningOption?.score || 0,
      recommendation: finalDecision.winningOption?.recommendation || '',
      explanation: finalDecision.explanation,
    };
    saveDecision(legacy);

    soundEngine?.playSuccess();
    setDecision(finalDecision);
    setStage('result');
  }, [situation]);

  const handleReset = useCallback(() => {
    setSituation('');
    setDecision(null);
    setStage('input');
    soundEngine?.playClick();
  }, []);

  return (
    <main className="min-h-screen bg-[#050810] relative overflow-hidden">
      {/* Background web pattern */}
      <div className="fixed inset-0 pointer-events-none">
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]" viewBox="0 0 100 100" preserveAspectRatio="none">
          {[0, 30, 60, 90, 120, 150].map(angle => (
            <line
              key={angle}
              x1="50" y1="50"
              x2={50 + 80 * Math.cos((angle * Math.PI) / 180)}
              y2={50 + 80 * Math.sin((angle * Math.PI) / 180)}
              stroke="#C1121F"
              strokeWidth="0.3"
            />
          ))}
          {[20, 40, 60].map(r => (
            <circle key={r} cx="50" cy="50" r={r} fill="none" stroke="#C1121F" strokeWidth="0.1" />
          ))}
        </svg>

        {/* Animated glow */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--accent)] rounded-full blur-[150px] opacity-10"
          animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.15, 0.05] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-12">
        {/* Header - Always visible */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-5xl font-black tracking-tight mb-2">
            <span className="text-[var(--accent)]">SPIDER</span>
          </h1>
          <p className="text-gray-500 text-sm">Strategic Personal Intelligence for Decision Evaluation</p>
        </motion.div>

        <AnimatePresence mode="wait">
          {/* Input Stage */}
          {stage === 'input' && (
            <motion.div
              key="input"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div>
                <label className="block text-gray-400 text-sm mb-2">
                  Describe your decision
                </label>
                <textarea
                  value={situation}
                  onChange={(e) => setSituation(e.target.value)}
                  placeholder="I'm deciding whether to take a new job offer with higher pay, but it would require relocating to a different city away from my family..."
                  className="w-full h-40 px-4 py-3 bg-gray-900/80 border border-gray-800 rounded-xl text-white placeholder-gray-600 focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] focus:outline-none resize-none transition-colors"
                  autoFocus
                />
              </div>

              <motion.button
                onClick={runAnalysis}
                disabled={!situation.trim()}
                className="w-full py-4 bg-[var(--accent)] text-white font-semibold rounded-xl disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
                whileHover={{ scale: situation.trim() ? 1.01 : 1 }}
                whileTap={{ scale: situation.trim() ? 0.99 : 1 }}
              >
                Analyze Decision
              </motion.button>
            </motion.div>
          )}

          {/* Analyzing Stage */}
          {stage === 'analyzing' && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20"
            >
              {/* Spider spinner */}
              <motion.div
                className="w-16 h-16 mx-auto mb-6 border-2 border-[var(--accent)] border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />

              <p className="text-gray-400 mb-4">
                {analysisProgress < 30 && 'Parsing your situation...'}
                {analysisProgress >= 30 && analysisProgress < 60 && 'Extracting decision options...'}
                {analysisProgress >= 60 && analysisProgress < 90 && 'Generating analysis...'}
                {analysisProgress >= 90 && 'Finalizing recommendation...'}
              </p>

              {/* Progress bar */}
              <div className="w-48 h-1 bg-gray-800 rounded-full mx-auto overflow-hidden">
                <motion.div
                  className="h-full bg-[var(--accent)]"
                  initial={{ width: 0 }}
                  animate={{ width: `${analysisProgress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </motion.div>
          )}

          {/* Result Stage */}
          {stage === 'result' && decision && (
            <motion.div
              key="result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ResultDisplay decision={decision} onReset={handleReset} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="fixed bottom-4 left-0 right-0 text-center text-gray-700 text-xs">
        Your data stays local. No servers. No tracking.
      </div>
    </main>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Hero from '@/components/Hero';
import SituationInput from '@/components/SituationInput';
import DecisionInput from '@/components/DecisionInput';
import ResultPanel from '@/components/ResultPanel';
import SpinWheel from '@/components/SpinWheel';
import DecisionHistory from '@/components/DecisionHistory';
import RegretSimulator from '@/components/RegretSimulator';
import CityBackground from '@/components/CityBackground';
import SpiderEmblem from '@/components/SpiderEmblem';
import AudioControls from '@/components/AudioControls';
import {
  Decision,
  Option,
  Mood,
  Personality,
  DecisionContext,
  calculateMultiOptionScore,
  generateId,
  LegacyDecision,
} from '@/lib/decisionEngine';
import { AIAnalysisResult, enhanceWithStrategistTone } from '@/lib/aiEngine';
import { saveDecision } from '@/lib/storage';
import { soundEngine } from '@/lib/soundEngine';

type AppStage = 'welcome' | 'situation' | 'refine' | 'result';
type ActiveTool = 'none' | 'wheel' | 'history' | 'regret';

export default function Home() {
  const [stage, setStage] = useState<AppStage>('welcome');
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysisResult | null>(null);
  const [currentDecision, setCurrentDecision] = useState<Decision | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [activeTool, setActiveTool] = useState<ActiveTool>('none');
  const [moodBackground, setMoodBackground] = useState<Mood>('neutral');

  const handleStartAnalysis = () => {
    soundEngine?.playWebSling();
    setStage('situation');
  };

  const handleAIAnalysisComplete = (result: AIAnalysisResult) => {
    soundEngine?.playSuccess();
    setAiAnalysis(result);
    setStage('refine');
  };

  const handleCalculate = async (data: {
    title: string;
    options: Option[];
    importance: number;
    mood: Mood;
    personality: Personality;
    context: DecisionContext;
  }) => {
    setIsCalculating(true);
    setMoodBackground(data.mood);
    soundEngine?.playHeartbeat(0.7);

    // Simulate processing time for dramatic effect
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const { results, winningOption, explanation } = calculateMultiOptionScore(
      data.options,
      data.importance,
      data.mood,
      data.personality,
      data.context
    );

    // Enhance with strategist tone
    const strategistAdvice = winningOption
      ? enhanceWithStrategistTone(winningOption.recommendation, winningOption.score)
      : '';

    const decision: Decision = {
      id: generateId(),
      title: data.title,
      options: data.options,
      importance: data.importance,
      mood: data.mood,
      personality: data.personality,
      context: data.context,
      timestamp: Date.now(),
      results,
      winningOption,
      explanation: strategistAdvice || explanation,
    };

    // Save to localStorage
    const legacyDecision: LegacyDecision = {
      id: decision.id,
      title: decision.title,
      pros: decision.options[0]?.pros || [],
      cons: decision.options[0]?.cons || [],
      importance: decision.importance,
      mood: decision.mood,
      personality: decision.personality,
      timestamp: decision.timestamp,
      score: decision.winningOption?.score || 0,
      recommendation: decision.winningOption?.recommendation || '',
      explanation: decision.explanation,
    };
    saveDecision(legacyDecision as LegacyDecision);

    soundEngine?.playSuccess();
    setCurrentDecision(decision);
    setIsCalculating(false);
    setStage('result');
  };

  const handleReset = () => {
    soundEngine?.playClick();
    setCurrentDecision(null);
    setAiAnalysis(null);
    setMoodBackground('neutral');
    setStage('welcome');
  };

  const handleBackToRefine = () => {
    soundEngine?.playClick();
    setCurrentDecision(null);
    setStage('refine');
  };

  const tools = [
    { id: 'wheel' as ActiveTool, label: 'Spin Wheel', emoji: '🎡', description: "Can't decide? Let fate choose!" },
    { id: 'history' as ActiveTool, label: 'History', emoji: '📜', description: 'View past decisions' },
    { id: 'regret' as ActiveTool, label: 'Regret Sim', emoji: '🔮', description: 'Simulate future feelings' },
  ];

  // Dynamic background gradient based on mood
  const moodGradients: Record<Mood, string> = {
    neutral: '',
    stressed: 'bg-gradient-to-b from-transparent via-red-950/5 to-transparent',
    tired: 'bg-gradient-to-b from-transparent via-blue-950/5 to-transparent',
    excited: 'bg-gradient-to-b from-transparent via-yellow-950/5 to-transparent',
    sad: 'bg-gradient-to-b from-transparent via-indigo-950/5 to-transparent',
    confused: 'bg-gradient-to-b from-transparent via-purple-950/5 to-transparent',
  };

  return (
    <>
      <CityBackground />
      <AudioControls />

      <main className={`min-h-screen relative z-10 transition-all duration-1000 ${moodGradients[moodBackground]}`}>
        <div className="max-w-4xl mx-auto px-4 py-8 relative">

          {/* Welcome Stage */}
          <AnimatePresence mode="wait">
            {stage === 'welcome' && (
              <motion.div
                key="welcome"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -20 }}
                className="min-h-[80vh] flex flex-col items-center justify-center text-center"
              >
                <SpiderEmblem size="lg" />

                <motion.h1
                  className="text-5xl md:text-7xl font-bold mt-8 mb-4 tracking-tight"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <span className="text-[var(--text)]">SPIDER</span>
                </motion.h1>

                <motion.p
                  className="text-xl text-gray-400 mb-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  Strategic Personal Intelligence for Decision Evaluation & Reasoning
                </motion.p>

                <motion.p
                  className="text-sm text-gray-500 italic mb-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  "With great data comes great responsibility."
                </motion.p>

                <motion.button
                  onClick={handleStartAnalysis}
                  className="btn-primary text-lg px-8 py-4 flex items-center gap-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    🕸️
                  </motion.span>
                  Start Your Analysis
                </motion.button>

                {/* Signature line */}
                <motion.p
                  className="absolute bottom-8 text-xs text-gray-600"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5 }}
                >
                  "This choice shapes who you become."
                </motion.p>
              </motion.div>
            )}

            {/* Situation Stage */}
            {stage === 'situation' && (
              <motion.div
                key="situation"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Hero />

                {/* Tools Bar */}
                <div className="flex flex-wrap justify-center gap-3 mb-8">
                  {tools.map((tool, index) => (
                    <motion.button
                      key={tool.id}
                      onClick={() => setActiveTool(activeTool === tool.id ? 'none' : tool.id)}
                      className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${activeTool === tool.id
                          ? 'bg-[var(--spider-red)] text-white'
                          : 'bg-[var(--panels)] border border-gray-700 hover:border-[var(--spider-blue)]'
                        }`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span>{tool.emoji}</span>
                      <span className="hidden sm:inline">{tool.label}</span>
                    </motion.button>
                  ))}
                </div>

                {/* Active Tool Panel */}
                <AnimatePresence mode="wait">
                  {activeTool === 'wheel' && (
                    <motion.div key="wheel" className="mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                      <SpinWheel onClose={() => setActiveTool('none')} />
                    </motion.div>
                  )}
                  {activeTool === 'history' && (
                    <motion.div key="history" className="mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                      <DecisionHistory onClose={() => setActiveTool('none')} />
                    </motion.div>
                  )}
                  {activeTool === 'regret' && (
                    <motion.div key="regret" className="mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                      <RegretSimulator onClose={() => setActiveTool('none')} />
                    </motion.div>
                  )}
                </AnimatePresence>

                <SituationInput onAnalysisComplete={handleAIAnalysisComplete} />
              </motion.div>
            )}

            {/* Refine Stage */}
            {stage === 'refine' && aiAnalysis && (
              <motion.div
                key="refine"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Hero />

                {/* AI Insight Banner */}
                <motion.div
                  className="card p-4 mb-6 border-l-4 border-[var(--spider-blue)]"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">🕷️</span>
                    <div>
                      <p className="text-sm text-gray-400 mb-1">
                        Detected: <span className="text-[var(--spider-blue)] font-medium capitalize">{aiAnalysis.detectedType}</span> decision
                        <span className="text-gray-500 ml-2">({Math.round(aiAnalysis.confidence * 100)}% confidence)</span>
                      </p>
                      <p className="text-sm text-gray-300">{aiAnalysis.insight}</p>
                    </div>
                  </div>
                </motion.div>

                <DecisionInput
                  onCalculate={handleCalculate}
                  isCalculating={isCalculating}
                  initialOptions={aiAnalysis.options}
                />

                <motion.button
                  onClick={() => setStage('situation')}
                  className="mt-4 text-sm text-gray-500 hover:text-white transition-colors"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  ← Back to describe situation
                </motion.button>
              </motion.div>
            )}

            {/* Result Stage */}
            {stage === 'result' && currentDecision && (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
              >
                <Hero />
                <ResultPanel decision={currentDecision} onReset={handleReset} />

                <motion.button
                  onClick={handleBackToRefine}
                  className="mt-4 text-sm text-gray-500 hover:text-white transition-colors"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  ← Adjust and recalculate
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer */}
          {stage !== 'welcome' && (
            <motion.footer
              className="text-center text-gray-600 text-sm mt-12 pb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <p className="mb-2">
                Built with 🕷️ by SPIDER Decision Engine
              </p>
              <p className="text-xs text-gray-700">
                Your decisions are stored locally and never leave your browser.
              </p>
            </motion.footer>
          )}
        </div>
      </main>
    </>
  );
}

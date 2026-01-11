'use client';

import { useState } from 'react';
import { simulateRegret } from '@/lib/decisionEngine';

interface RegretSimulatorProps {
    onClose?: () => void;
}

type Timeframe = '1 week' | '1 month' | '1 year';
type Choice = 'yes' | 'no';

export default function RegretSimulator({ onClose }: RegretSimulatorProps) {
    const [decision, setDecision] = useState('');
    const [choice, setChoice] = useState<Choice>('yes');
    const [timeframe, setTimeframe] = useState<Timeframe>('1 month');
    const [regretLevel, setRegretLevel] = useState(5);
    const [result, setResult] = useState<string | null>(null);
    const [isSimulating, setIsSimulating] = useState(false);

    const simulate = () => {
        if (!decision.trim()) {
            alert('Please enter a decision to simulate');
            return;
        }

        setIsSimulating(true);
        setResult(null);

        // Simulate thinking time
        setTimeout(() => {
            const simulation = simulateRegret(decision, choice, timeframe, regretLevel);
            setResult(simulation);
            setIsSimulating(false);
        }, 1500);
    };

    const timeframes: Timeframe[] = ['1 week', '1 month', '1 year'];

    return (
        <div className="card p-6 relative z-10 animate-fadeIn">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <span className="text-[var(--spider-red)]">🔮</span>
                    Regret Simulator
                </h2>
                {onClose && (
                    <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors text-2xl">
                        ×
                    </button>
                )}
            </div>

            <p className="text-gray-400 mb-6">
                Imagine your future self looking back at this decision. How would you feel?
            </p>

            <div className="space-y-6">
                {/* Decision Input */}
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                        What decision are you considering?
                    </label>
                    <input
                        type="text"
                        value={decision}
                        onChange={(e) => setDecision(e.target.value)}
                        placeholder="e.g., Accepting the new job offer"
                        className="w-full"
                    />
                </div>

                {/* Choice Selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                        What are you leaning towards?
                    </label>
                    <div className="flex gap-4">
                        <button
                            onClick={() => setChoice('yes')}
                            className={`flex-1 py-3 rounded-lg border transition-all ${choice === 'yes'
                                    ? 'border-green-500 bg-green-500/10 text-green-400'
                                    : 'border-gray-700 hover:border-gray-600'
                                }`}
                        >
                            ✅ Doing it
                        </button>
                        <button
                            onClick={() => setChoice('no')}
                            className={`flex-1 py-3 rounded-lg border transition-all ${choice === 'no'
                                    ? 'border-[var(--spider-red)] bg-[var(--spider-red)]/10 text-[var(--spider-red)]'
                                    : 'border-gray-700 hover:border-gray-600'
                                }`}
                        >
                            ❌ Not doing it
                        </button>
                    </div>
                </div>

                {/* Timeframe Selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                        How far into the future?
                    </label>
                    <div className="flex gap-2">
                        {timeframes.map((t) => (
                            <button
                                key={t}
                                onClick={() => setTimeframe(t)}
                                className={`flex-1 py-2 rounded-lg border transition-all text-sm ${timeframe === t
                                        ? 'border-[var(--spider-blue)] bg-[var(--spider-blue)]/10 text-[var(--spider-blue)]'
                                        : 'border-gray-700 hover:border-gray-600'
                                    }`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Regret Level Slider */}
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                        How much regret do you anticipate? <span className="text-[var(--spider-red)]">{regretLevel}/10</span>
                    </label>
                    <input
                        type="range"
                        min="1"
                        max="10"
                        value={regretLevel}
                        onChange={(e) => setRegretLevel(parseInt(e.target.value))}
                        className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>😌 No regret</span>
                        <span>😰 Major regret</span>
                    </div>
                </div>

                {/* Simulate Button */}
                <button
                    onClick={simulate}
                    disabled={isSimulating}
                    className="btn-primary w-full text-lg py-4 flex items-center justify-center gap-2"
                >
                    {isSimulating ? (
                        <>
                            <div className="web-spinner w-6 h-6"></div>
                            Simulating future...
                        </>
                    ) : (
                        <>
                            🔮 Simulate Regret
                        </>
                    )}
                </button>

                {/* Result */}
                {result && (
                    <div className="bg-[var(--background)] rounded-lg p-4 animate-fadeIn">
                        <h4 className="font-semibold text-[var(--spider-blue)] mb-2">
                            Future Self Says:
                        </h4>
                        <p className="text-lg">{result}</p>

                        <div className="mt-4 pt-4 border-t border-gray-800">
                            <h5 className="text-sm font-medium text-gray-400 mb-2">Tips:</h5>
                            <ul className="text-sm text-gray-500 space-y-1">
                                {regretLevel > 7 && (
                                    <li>• High anticipated regret often signals you should reconsider</li>
                                )}
                                {timeframe === '1 year' && (
                                    <li>• Long-term perspective helps filter out temporary emotions</li>
                                )}
                                {choice === 'no' && regretLevel > 5 && (
                                    <li>• Fear of regret from inaction can be more painful than action</li>
                                )}
                                <li>• This simulation is a tool for reflection, not a final answer</li>
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

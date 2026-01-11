'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SpinWheelProps {
    onClose?: () => void;
}

export default function SpinWheel({ onClose }: SpinWheelProps) {
    const [options, setOptions] = useState<string[]>(['Option 1', 'Option 2']);
    const [newOption, setNewOption] = useState('');
    const [isSpinning, setIsSpinning] = useState(false);
    const [result, setResult] = useState<string | null>(null);
    const [rotation, setRotation] = useState(0);
    const [showTension, setShowTension] = useState(false);
    const wheelRef = useRef<SVGSVGElement>(null);

    const addOption = () => {
        if (newOption.trim() && options.length < 8) {
            setOptions([...options, newOption.trim()]);
            setNewOption('');
        }
    };

    const removeOption = (index: number) => {
        if (options.length > 2) {
            setOptions(options.filter((_, i) => i !== index));
        }
    };

    const spin = () => {
        if (isSpinning || options.length < 2) return;

        // Tension build-up phase
        setShowTension(true);
        setResult(null);

        setTimeout(() => {
            setShowTension(false);
            setIsSpinning(true);

            const spins = 5 + Math.random() * 5; // 5-10 full rotations
            const extraDegrees = Math.random() * 360;
            const totalRotation = spins * 360 + extraDegrees;

            setRotation(prev => prev + totalRotation);

            setTimeout(() => {
                const finalDegree = (rotation + totalRotation) % 360;
                const segmentSize = 360 / options.length;
                const winningIndex = Math.floor((360 - finalDegree + segmentSize / 2) % 360 / segmentSize);
                setResult(options[winningIndex % options.length]);
                setIsSpinning(false);
            }, 4000);
        }, 800); // Tension build-up duration
    };

    const colors = [
        'var(--spider-red)',
        'var(--spider-blue)',
        '#374151',
        '#4B5563',
        '#C1121F',
        '#2563EB',
        '#1F2937',
        '#6B7280',
    ];

    const renderWheel = () => {
        const segmentAngle = 360 / options.length;

        return options.map((option, index) => {
            const startAngle = index * segmentAngle;
            const endAngle = startAngle + segmentAngle;
            const startRad = (startAngle - 90) * (Math.PI / 180);
            const endRad = (endAngle - 90) * (Math.PI / 180);

            const x1 = 50 + 45 * Math.cos(startRad);
            const y1 = 50 + 45 * Math.sin(startRad);
            const x2 = 50 + 45 * Math.cos(endRad);
            const y2 = 50 + 45 * Math.sin(endRad);

            const largeArc = segmentAngle > 180 ? 1 : 0;

            const midAngle = (startAngle + endAngle) / 2 - 90;
            const midRad = midAngle * (Math.PI / 180);
            const textX = 50 + 28 * Math.cos(midRad);
            const textY = 50 + 28 * Math.sin(midRad);

            return (
                <g key={index}>
                    <path
                        d={`M 50 50 L ${x1} ${y1} A 45 45 0 ${largeArc} 1 ${x2} ${y2} Z`}
                        fill={colors[index % colors.length]}
                        stroke="var(--background)"
                        strokeWidth="0.5"
                    />
                    <text
                        x={textX}
                        y={textY}
                        fill="white"
                        fontSize="4"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        transform={`rotate(${midAngle + 90}, ${textX}, ${textY})`}
                        className="font-medium"
                    >
                        {option.length > 10 ? option.substring(0, 10) + '...' : option}
                    </text>
                </g>
            );
        });
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
                    <span className="text-[var(--spider-red)]">🎡</span>
                    Spin the Wheel
                </h2>
                {onClose && (
                    <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors text-2xl">
                        ×
                    </button>
                )}
            </div>

            {/* Options Input */}
            <div className="mb-6">
                <div className="flex gap-2 mb-3">
                    <input
                        type="text"
                        value={newOption}
                        onChange={(e) => setNewOption(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addOption()}
                        placeholder="Add an option..."
                        className="flex-1"
                        maxLength={30}
                    />
                    <motion.button
                        onClick={addOption}
                        className="btn-secondary px-4"
                        disabled={options.length >= 8}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Add
                    </motion.button>
                </div>
                <div className="flex flex-wrap gap-2">
                    <AnimatePresence>
                        {options.map((option, index) => (
                            <motion.span
                                key={`${option}-${index}`}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="px-3 py-1 bg-[var(--background)] rounded-full text-sm flex items-center gap-2"
                            >
                                <span
                                    className="w-2 h-2 rounded-full"
                                    style={{ backgroundColor: colors[index % colors.length] }}
                                />
                                {option}
                                <button
                                    onClick={() => removeOption(index)}
                                    className="text-gray-500 hover:text-red-400"
                                    disabled={options.length <= 2}
                                >
                                    ×
                                </button>
                            </motion.span>
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            {/* Wheel */}
            <div className="relative flex justify-center mb-6">
                {/* Pointer */}
                <motion.div
                    className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-10"
                    animate={showTension ? { y: [0, 5, 0] } : {}}
                    transition={showTension ? { duration: 0.2, repeat: Infinity } : {}}
                >
                    <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-t-[20px] border-l-transparent border-r-transparent border-t-[var(--spider-red)]"></div>
                </motion.div>

                {/* Tension glow effect */}
                <AnimatePresence>
                    {showTension && (
                        <motion.div
                            className="absolute inset-0 flex items-center justify-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <motion.div
                                className="w-72 h-72 rounded-full bg-[var(--spider-red)]"
                                animate={{
                                    scale: [1, 1.1, 1],
                                    opacity: [0.1, 0.3, 0.1]
                                }}
                                transition={{ duration: 0.3, repeat: Infinity }}
                                style={{ filter: 'blur(40px)' }}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.svg
                    ref={wheelRef}
                    viewBox="0 0 100 100"
                    className="w-64 h-64 drop-shadow-2xl relative z-10"
                    animate={{
                        rotate: rotation,
                        scale: showTension ? [1, 0.95, 1] : 1
                    }}
                    transition={isSpinning ? {
                        rotate: { duration: 4, ease: [0.2, 0.8, 0.3, 1] }
                    } : showTension ? {
                        scale: { duration: 0.2, repeat: Infinity }
                    } : {}}
                >
                    <circle cx="50" cy="50" r="48" fill="var(--panels)" stroke="var(--spider-red)" strokeWidth="2" />
                    {renderWheel()}
                    <circle cx="50" cy="50" r="8" fill="var(--background)" stroke="var(--spider-red)" strokeWidth="1" />
                    <circle cx="50" cy="50" r="3" fill="var(--spider-red)" />
                </motion.svg>

                {/* Web strands connecting to wheel */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 300 300">
                    {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                        <motion.line
                            key={i}
                            x1="150"
                            y1="150"
                            x2={150 + 140 * Math.cos((angle * Math.PI) / 180)}
                            y2={150 + 140 * Math.sin((angle * Math.PI) / 180)}
                            stroke="var(--spider-red)"
                            strokeWidth="0.5"
                            opacity={0.1}
                            animate={isSpinning ? { opacity: [0.1, 0.3, 0.1] } : {}}
                            transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                        />
                    ))}
                </svg>
            </div>

            {/* Result */}
            <AnimatePresence>
                {result && (
                    <motion.div
                        className="text-center mb-6"
                        initial={{ opacity: 0, y: 20, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200 }}
                    >
                        <p className="text-gray-400 text-sm mb-2">The wheel has spoken:</p>
                        <motion.p
                            className="text-2xl font-bold text-[var(--spider-red)]"
                            animate={{
                                textShadow: ['0 0 10px rgba(193, 18, 31, 0.5)', '0 0 30px rgba(193, 18, 31, 0.8)', '0 0 10px rgba(193, 18, 31, 0.5)']
                            }}
                            transition={{ duration: 1, repeat: Infinity }}
                        >
                            {result}
                        </motion.p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Spin Button */}
            <motion.button
                onClick={spin}
                disabled={isSpinning || showTension || options.length < 2}
                className="btn-primary w-full text-lg py-4"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                {showTension ? '⚡ Building tension...' : isSpinning ? '🕸️ Spinning...' : '🎰 Spin the Wheel!'}
            </motion.button>
        </motion.div>
    );
}

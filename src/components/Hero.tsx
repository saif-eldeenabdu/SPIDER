'use client';

import { motion } from 'framer-motion';

export default function Hero() {
    return (
        <section className="text-center py-16 relative z-10 overflow-hidden">
            {/* Animated web background */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Radial web strands */}
                <svg
                    viewBox="0 0 400 400"
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-[0.03]"
                >
                    {/* Radial lines */}
                    {[...Array(16)].map((_, i) => (
                        <motion.line
                            key={`radial-${i}`}
                            x1="200"
                            y1="200"
                            x2={200 + 200 * Math.cos((i * 22.5 * Math.PI) / 180)}
                            y2={200 + 200 * Math.sin((i * 22.5 * Math.PI) / 180)}
                            stroke="currentColor"
                            strokeWidth="0.5"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 1 }}
                            transition={{ duration: 1.5, delay: i * 0.05 }}
                        />
                    ))}
                    {/* Concentric circles */}
                    {[40, 80, 120, 160, 200].map((r, i) => (
                        <motion.circle
                            key={`circle-${i}`}
                            cx="200"
                            cy="200"
                            r={r}
                            stroke="currentColor"
                            strokeWidth="0.5"
                            fill="none"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.5 + i * 0.15 }}
                        />
                    ))}
                </svg>
            </div>

            {/* Glowing orbs */}
            <motion.div
                className="absolute top-10 left-1/4 w-32 h-32 bg-[var(--spider-red)] rounded-full blur-[100px] opacity-20"
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.2, 0.3, 0.2]
                }}
                transition={{ duration: 4, repeat: Infinity }}
            />
            <motion.div
                className="absolute bottom-10 right-1/4 w-32 h-32 bg-[var(--spider-blue)] rounded-full blur-[100px] opacity-20"
                animate={{
                    scale: [1.2, 1, 1.2],
                    opacity: [0.2, 0.3, 0.2]
                }}
                transition={{ duration: 4, repeat: Infinity }}
            />

            <motion.div
                className="relative z-10"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
                {/* Spider logo - hidden easter egg */}
                <motion.div
                    className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-8 opacity-0 hover:opacity-10 transition-opacity duration-500"
                    whileHover={{ scale: 1.1 }}
                >
                    <svg viewBox="0 0 100 100" className="w-16 h-16">
                        <ellipse cx="50" cy="50" rx="20" ry="28" fill="currentColor" />
                        <ellipse cx="50" cy="32" rx="12" ry="14" fill="currentColor" />
                        {/* Legs */}
                        {[-1, 1].map(dir => (
                            [15, 25, 35, 45].map((y, i) => (
                                <path
                                    key={`leg-${dir}-${i}`}
                                    d={`M 50 ${y + 20} Q ${50 + dir * 30} ${y + 10} ${50 + dir * 45} ${y + (i % 2 ? 5 : -5)}`}
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    fill="none"
                                />
                            ))
                        ))}
                    </svg>
                </motion.div>

                <motion.h1
                    className="text-5xl md:text-7xl font-bold mb-4 tracking-tight"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <span className="text-[var(--text)]">Web of </span>
                    <motion.span
                        className="text-[var(--spider-red)] inline-block"
                        animate={{
                            textShadow: [
                                '0 0 20px rgba(193, 18, 31, 0.3)',
                                '0 0 40px rgba(193, 18, 31, 0.5)',
                                '0 0 20px rgba(193, 18, 31, 0.3)'
                            ]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        Decisions
                    </motion.span>
                </motion.h1>

                <motion.p
                    className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto mb-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    Navigate life&apos;s toughest choices with data-driven clarity
                </motion.p>

                <motion.p
                    className="text-sm text-gray-500 italic"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                >
                    &quot;With great data comes great responsibility.&quot;
                </motion.p>

                {/* Animated web strand decoration */}
                <motion.div
                    className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-px h-16 bg-gradient-to-b from-[var(--spider-red)] to-transparent"
                    initial={{ scaleY: 0, opacity: 0 }}
                    animate={{ scaleY: 1, opacity: 0.3 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    style={{ transformOrigin: 'top' }}
                />
            </motion.div>
        </section >
    );
}

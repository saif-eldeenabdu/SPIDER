'use client';

import { motion } from 'framer-motion';

export default function CityBackground() {
    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            {/* Base dark gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#050810] via-[var(--background)] to-[#0a0a15]" />

            {/* Stars */}
            <div className="absolute inset-0">
                {[...Array(50)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-px h-px bg-white rounded-full"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 40}%`,
                        }}
                        animate={{
                            opacity: [0.2, 0.8, 0.2],
                        }}
                        transition={{
                            duration: 2 + Math.random() * 3,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                        }}
                    />
                ))}
            </div>

            {/* City skyline silhouette */}
            <svg
                className="absolute bottom-0 left-0 w-full h-[40vh] opacity-20"
                viewBox="0 0 1920 400"
                preserveAspectRatio="xMidYMax slice"
            >
                <defs>
                    {/* Building gradient */}
                    <linearGradient id="buildingGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#1a1a2e" />
                        <stop offset="100%" stopColor="#0f0f1a" />
                    </linearGradient>

                    {/* Red glow */}
                    <radialGradient id="redGlow" cx="20%" cy="50%" r="30%">
                        <stop offset="0%" stopColor="var(--spider-red)" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="var(--spider-red)" stopOpacity="0" />
                    </radialGradient>

                    {/* Blue glow */}
                    <radialGradient id="blueGlow" cx="80%" cy="50%" r="30%">
                        <stop offset="0%" stopColor="var(--spider-blue)" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="var(--spider-blue)" stopOpacity="0" />
                    </radialGradient>
                </defs>

                {/* Glows */}
                <motion.rect
                    x="0"
                    y="0"
                    width="100%"
                    height="100%"
                    fill="url(#redGlow)"
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 4, repeat: Infinity }}
                />
                <motion.rect
                    x="0"
                    y="0"
                    width="100%"
                    height="100%"
                    fill="url(#blueGlow)"
                    animate={{ opacity: [0.6, 0.3, 0.6] }}
                    transition={{ duration: 4, repeat: Infinity }}
                />

                {/* Buildings - Layer 1 (far) */}
                <g fill="url(#buildingGrad)" opacity="0.4">
                    <rect x="0" y="280" width="60" height="120" />
                    <rect x="80" y="250" width="40" height="150" />
                    <rect x="140" y="300" width="80" height="100" />
                    <rect x="240" y="220" width="50" height="180" />
                    <rect x="320" y="260" width="70" height="140" />
                    <rect x="410" y="200" width="45" height="200" />
                    <rect x="480" y="240" width="90" height="160" />
                    <rect x="600" y="180" width="55" height="220" />
                    <rect x="680" y="260" width="40" height="140" />
                    <rect x="750" y="220" width="100" height="180" />
                    <rect x="880" y="280" width="60" height="120" />
                    <rect x="960" y="200" width="80" height="200" />
                    <rect x="1070" y="250" width="50" height="150" />
                    <rect x="1150" y="180" width="70" height="220" />
                    <rect x="1250" y="240" width="90" height="160" />
                    <rect x="1370" y="200" width="55" height="200" />
                    <rect x="1450" y="260" width="40" height="140" />
                    <rect x="1520" y="220" width="80" height="180" />
                    <rect x="1630" y="280" width="60" height="120" />
                    <rect x="1720" y="240" width="100" height="160" />
                    <rect x="1850" y="260" width="70" height="140" />
                </g>

                {/* Buildings - Layer 2 (closer) */}
                <g fill="#0a0a15" opacity="0.7">
                    <rect x="20" y="320" width="80" height="80" />
                    <rect x="120" y="300" width="50" height="100" />
                    <rect x="200" y="340" width="100" height="60" />
                    <rect x="330" y="290" width="60" height="110" />
                    <rect x="420" y="310" width="90" height="90" />
                    <rect x="540" y="280" width="70" height="120" />
                    <rect x="640" y="320" width="50" height="80" />
                    <rect x="720" y="290" width="110" height="110" />
                    <rect x="860" y="330" width="80" height="70" />
                    <rect x="970" y="300" width="60" height="100" />
                    <rect x="1060" y="320" width="90" height="80" />
                    <rect x="1180" y="290" width="70" height="110" />
                    <rect x="1280" y="310" width="50" height="90" />
                    <rect x="1360" y="280" width="100" height="120" />
                    <rect x="1490" y="320" width="80" height="80" />
                    <rect x="1600" y="300" width="60" height="100" />
                    <rect x="1690" y="330" width="90" height="70" />
                    <rect x="1810" y="300" width="110" height="100" />
                </g>

                {/* Window lights (random dots) */}
                {[...Array(100)].map((_, i) => (
                    <motion.rect
                        key={i}
                        x={50 + Math.random() * 1800}
                        y={200 + Math.random() * 150}
                        width="3"
                        height="4"
                        fill="#ffd700"
                        opacity={0.3}
                        animate={{
                            opacity: Math.random() > 0.7 ? [0.3, 0.8, 0.3] : 0.3,
                        }}
                        transition={{
                            duration: 1 + Math.random() * 2,
                            repeat: Infinity,
                            delay: Math.random() * 3,
                        }}
                    />
                ))}
            </svg>

            {/* Web strands overlay */}
            <svg
                className="absolute inset-0 w-full h-full opacity-[0.03]"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
            >
                {/* Radial web from center */}
                {[0, 30, 60, 90, 120, 150].map((angle) => (
                    <motion.line
                        key={angle}
                        x1="50"
                        y1="50"
                        x2={50 + 60 * Math.cos((angle * Math.PI) / 180)}
                        y2={50 + 60 * Math.sin((angle * Math.PI) / 180)}
                        stroke="white"
                        strokeWidth="0.2"
                        animate={{ opacity: [0.3, 0.8, 0.3] }}
                        transition={{ duration: 3, repeat: Infinity, delay: angle / 100 }}
                    />
                ))}
                {/* Concentric arcs */}
                {[15, 30, 45].map((r) => (
                    <motion.circle
                        key={r}
                        cx="50"
                        cy="50"
                        r={r}
                        fill="none"
                        stroke="white"
                        strokeWidth="0.1"
                        animate={{ opacity: [0.2, 0.5, 0.2] }}
                        transition={{ duration: 4, repeat: Infinity, delay: r / 50 }}
                    />
                ))}
            </svg>

            {/* Moving light beams (police lights, etc.) */}
            <motion.div
                className="absolute bottom-20 left-0 w-[200px] h-[200px] bg-[var(--spider-red)] rounded-full blur-[100px] opacity-10"
                animate={{
                    x: ['-100px', '100vw'],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: 'linear',
                }}
            />
            <motion.div
                className="absolute bottom-40 right-0 w-[200px] h-[200px] bg-[var(--spider-blue)] rounded-full blur-[100px] opacity-10"
                animate={{
                    x: ['100px', '-100vw'],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: 'linear',
                    delay: 5,
                }}
            />
        </div>
    );
}

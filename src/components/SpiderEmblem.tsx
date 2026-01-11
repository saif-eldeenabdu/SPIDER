'use client';

import { motion } from 'framer-motion';

interface SpiderEmblemProps {
    size?: 'sm' | 'md' | 'lg';
    animated?: boolean;
}

export default function SpiderEmblem({ size = 'md', animated = true }: SpiderEmblemProps) {
    const sizeClasses = {
        sm: 'w-16 h-16',
        md: 'w-32 h-32',
        lg: 'w-48 h-48',
    };

    return (
        <motion.div
            className={`relative ${sizeClasses[size]}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, type: 'spring' }}
        >
            <motion.svg
                viewBox="0 0 100 100"
                className="w-full h-full"
                animate={animated ? {
                    filter: [
                        'drop-shadow(0 0 10px rgba(193, 18, 31, 0.3))',
                        'drop-shadow(0 0 20px rgba(193, 18, 31, 0.6))',
                        'drop-shadow(0 0 10px rgba(193, 18, 31, 0.3))',
                    ]
                } : {}}
                transition={{ duration: 2, repeat: Infinity }}
            >
                {/* Web strands connecting to edges */}
                {animated && [0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                    <motion.line
                        key={angle}
                        x1="50"
                        y1="50"
                        x2={50 + 50 * Math.cos((angle * Math.PI) / 180)}
                        y2={50 + 50 * Math.sin((angle * Math.PI) / 180)}
                        stroke="var(--spider-red)"
                        strokeWidth="0.5"
                        opacity="0.3"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1, delay: i * 0.1 }}
                    />
                ))}

                {/* Spider body */}
                <g fill="var(--spider-red)">
                    {/* Abdomen */}
                    <motion.ellipse
                        cx="50"
                        cy="58"
                        rx="16"
                        ry="22"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring' }}
                    />
                    {/* Thorax */}
                    <motion.ellipse
                        cx="50"
                        cy="38"
                        rx="10"
                        ry="12"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3, type: 'spring' }}
                    />

                    {/* Legs - Left side */}
                    <motion.path
                        d="M 42 35 Q 25 25 12 18"
                        stroke="var(--spider-red)"
                        strokeWidth="4"
                        strokeLinecap="round"
                        fill="none"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ delay: 0.4 }}
                    />
                    <motion.path
                        d="M 40 42 Q 22 38 8 35"
                        stroke="var(--spider-red)"
                        strokeWidth="4"
                        strokeLinecap="round"
                        fill="none"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ delay: 0.5 }}
                    />
                    <motion.path
                        d="M 38 52 Q 20 55 8 60"
                        stroke="var(--spider-red)"
                        strokeWidth="4"
                        strokeLinecap="round"
                        fill="none"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ delay: 0.6 }}
                    />
                    <motion.path
                        d="M 40 62 Q 25 72 12 82"
                        stroke="var(--spider-red)"
                        strokeWidth="4"
                        strokeLinecap="round"
                        fill="none"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ delay: 0.7 }}
                    />

                    {/* Legs - Right side */}
                    <motion.path
                        d="M 58 35 Q 75 25 88 18"
                        stroke="var(--spider-red)"
                        strokeWidth="4"
                        strokeLinecap="round"
                        fill="none"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ delay: 0.4 }}
                    />
                    <motion.path
                        d="M 60 42 Q 78 38 92 35"
                        stroke="var(--spider-red)"
                        strokeWidth="4"
                        strokeLinecap="round"
                        fill="none"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ delay: 0.5 }}
                    />
                    <motion.path
                        d="M 62 52 Q 80 55 92 60"
                        stroke="var(--spider-red)"
                        strokeWidth="4"
                        strokeLinecap="round"
                        fill="none"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ delay: 0.6 }}
                    />
                    <motion.path
                        d="M 60 62 Q 75 72 88 82"
                        stroke="var(--spider-red)"
                        strokeWidth="4"
                        strokeLinecap="round"
                        fill="none"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ delay: 0.7 }}
                    />
                </g>

                {/* Glowing eyes */}
                <motion.circle
                    cx="45"
                    cy="34"
                    r="2"
                    fill="white"
                    animate={animated ? { opacity: [0.5, 1, 0.5] } : {}}
                    transition={{ duration: 1.5, repeat: Infinity }}
                />
                <motion.circle
                    cx="55"
                    cy="34"
                    r="2"
                    fill="white"
                    animate={animated ? { opacity: [0.5, 1, 0.5] } : {}}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                />
            </motion.svg>
        </motion.div>
    );
}

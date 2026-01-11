'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { soundEngine } from '@/lib/soundEngine';

export default function AudioControls() {
    const [isMuted, setIsMuted] = useState(true); // Start muted by default
    const [volume, setVolume] = useState(50);
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        // Load preferences from localStorage
        const savedMuted = localStorage.getItem('spider-audio-muted');
        const savedVolume = localStorage.getItem('spider-audio-volume');

        if (savedMuted !== null) {
            setIsMuted(savedMuted === 'true');
        }
        if (savedVolume !== null) {
            setVolume(parseInt(savedVolume));
        }
    }, []);

    useEffect(() => {
        if (soundEngine) {
            soundEngine.setMuted(isMuted);
            soundEngine.setVolume(volume / 100);
        }
        localStorage.setItem('spider-audio-muted', String(isMuted));
        localStorage.setItem('spider-audio-volume', String(volume));
    }, [isMuted, volume]);

    const toggleMute = () => {
        setIsMuted(!isMuted);
        if (!isMuted && soundEngine) {
            soundEngine.playClick();
        }
    };

    const handleVolumeChange = (newVolume: number) => {
        setVolume(newVolume);
        if (soundEngine && !isMuted) {
            soundEngine.playClick();
        }
    };

    return (
        <motion.div
            className="fixed bottom-4 right-4 z-50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
        >
            <div className="flex items-center gap-2 bg-[var(--panels)] border border-gray-800 rounded-full p-1">
                {/* Expand button for volume slider */}
                {isExpanded && (
                    <motion.div
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 100, opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={volume}
                            onChange={(e) => handleVolumeChange(parseInt(e.target.value))}
                            className="w-full h-1"
                            disabled={isMuted}
                        />
                    </motion.div>
                )}

                {/* Volume button */}
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                    title="Adjust volume"
                >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d={isMuted || volume === 0
                            ? "M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"
                            : "M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"
                        } />
                    </svg>
                </button>

                {/* Mute button */}
                <button
                    onClick={toggleMute}
                    className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${isMuted
                            ? 'text-gray-500 hover:text-gray-300'
                            : 'text-[var(--spider-red)] hover:text-red-400'
                        }`}
                    title={isMuted ? 'Unmute' : 'Mute'}
                >
                    {isMuted ? '🔇' : '🔊'}
                </button>
            </div>
        </motion.div>
    );
}

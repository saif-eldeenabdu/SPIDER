// Sound Engine - Web Audio API based sound generation
// Creates audio effects programmatically without external files

class SoundEngine {
    private audioContext: AudioContext | null = null;
    private masterGain: GainNode | null = null;
    private ambienceOscillators: OscillatorNode[] = [];
    private isAmbiencePlaying = false;
    private isMuted = false;
    private volume = 0.5;

    constructor() {
        if (typeof window !== 'undefined') {
            this.initAudioContext();
        }
    }

    private initAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            this.masterGain = this.audioContext.createGain();
            this.masterGain.connect(this.audioContext.destination);
            this.masterGain.gain.value = this.volume;
        } catch (e) {
            console.warn('Web Audio API not supported');
        }
    }

    private ensureContext() {
        if (this.audioContext?.state === 'suspended') {
            this.audioContext.resume();
        }
    }

    setVolume(value: number) {
        this.volume = Math.max(0, Math.min(1, value));
        if (this.masterGain) {
            this.masterGain.gain.value = this.isMuted ? 0 : this.volume;
        }
    }

    getVolume() {
        return this.volume;
    }

    setMuted(muted: boolean) {
        this.isMuted = muted;
        if (this.masterGain) {
            this.masterGain.gain.value = muted ? 0 : this.volume;
        }
    }

    isSoundMuted() {
        return this.isMuted;
    }

    // Web sling sound - whoosh effect
    playWebSling() {
        if (!this.audioContext || !this.masterGain) return;
        this.ensureContext();

        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();

        // Noise-like whoosh
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(400, this.audioContext.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.3);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2000, this.audioContext.currentTime);
        filter.frequency.exponentialRampToValueAtTime(200, this.audioContext.currentTime + 0.3);

        gain.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        osc.start();
        osc.stop(this.audioContext.currentTime + 0.3);
    }

    // Click/select sound - subtle pop
    playClick() {
        if (!this.audioContext || !this.masterGain) return;
        this.ensureContext();

        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, this.audioContext.currentTime);
        osc.frequency.exponentialRampToValueAtTime(400, this.audioContext.currentTime + 0.05);

        gain.gain.setValueAtTime(0.2, this.audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.05);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start();
        osc.stop(this.audioContext.currentTime + 0.05);
    }

    // Heartbeat for tense moments
    playHeartbeat(intensity: number = 0.5) {
        if (!this.audioContext || !this.masterGain) return;
        this.ensureContext();

        const baseFreq = 60 + (intensity * 40); // 60-100 BPM
        const beatInterval = 60 / baseFreq;

        // Two-beat pattern (lub-dub)
        for (let i = 0; i < 2; i++) {
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();

            osc.type = 'sine';
            const startTime = this.audioContext.currentTime + (i * 0.15);
            osc.frequency.setValueAtTime(i === 0 ? 80 : 60, startTime);

            gain.gain.setValueAtTime(0, startTime);
            gain.gain.linearRampToValueAtTime(0.3 * intensity, startTime + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.1);

            osc.connect(gain);
            gain.connect(this.masterGain);

            osc.start(startTime);
            osc.stop(startTime + 0.15);
        }
    }

    // Success sound - ascending chime
    playSuccess() {
        if (!this.audioContext || !this.masterGain) return;
        this.ensureContext();

        const notes = [523.25, 659.25, 783.99]; // C5, E5, G5

        notes.forEach((freq, i) => {
            const osc = this.audioContext!.createOscillator();
            const gain = this.audioContext!.createGain();

            osc.type = 'sine';
            const startTime = this.audioContext!.currentTime + (i * 0.1);
            osc.frequency.setValueAtTime(freq, startTime);

            gain.gain.setValueAtTime(0.15, startTime);
            gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.4);

            osc.connect(gain);
            gain.connect(this.masterGain!);

            osc.start(startTime);
            osc.stop(startTime + 0.4);
        });
    }

    // Warning sound - descending tone
    playWarning() {
        if (!this.audioContext || !this.masterGain) return;
        this.ensureContext();

        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(600, this.audioContext.currentTime);
        osc.frequency.exponentialRampToValueAtTime(200, this.audioContext.currentTime + 0.3);

        gain.gain.setValueAtTime(0.2, this.audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start();
        osc.stop(this.audioContext.currentTime + 0.3);
    }

    // Spin wheel tick
    playTick() {
        if (!this.audioContext || !this.masterGain) return;
        this.ensureContext();

        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(1200, this.audioContext.currentTime);

        gain.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.02);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start();
        osc.stop(this.audioContext.currentTime + 0.02);
    }

    // City ambience - low rumble with occasional high tones
    startAmbience() {
        if (!this.audioContext || !this.masterGain || this.isAmbiencePlaying) return;
        this.ensureContext();

        this.isAmbiencePlaying = true;

        // Base city rumble
        const rumbleOsc = this.audioContext.createOscillator();
        const rumbleGain = this.audioContext.createGain();
        const rumbleFilter = this.audioContext.createBiquadFilter();

        rumbleOsc.type = 'sawtooth';
        rumbleOsc.frequency.value = 50;

        rumbleFilter.type = 'lowpass';
        rumbleFilter.frequency.value = 100;

        rumbleGain.gain.value = 0.05;

        rumbleOsc.connect(rumbleFilter);
        rumbleFilter.connect(rumbleGain);
        rumbleGain.connect(this.masterGain);

        rumbleOsc.start();
        this.ambienceOscillators.push(rumbleOsc);

        // High city tones (distant sounds)
        const highOsc = this.audioContext.createOscillator();
        const highGain = this.audioContext.createGain();

        highOsc.type = 'sine';
        highOsc.frequency.value = 800;

        highGain.gain.value = 0.01;

        highOsc.connect(highGain);
        highGain.connect(this.masterGain);

        highOsc.start();
        this.ambienceOscillators.push(highOsc);
    }

    stopAmbience() {
        this.ambienceOscillators.forEach(osc => {
            try {
                osc.stop();
            } catch (e) {
                // Already stopped
            }
        });
        this.ambienceOscillators = [];
        this.isAmbiencePlaying = false;
    }
}

// Singleton instance
export const soundEngine = typeof window !== 'undefined' ? new SoundEngine() : null;

// Hook for React components
export function useSoundEngine() {
    return soundEngine;
}

// localStorage utilities for decision history

import { LegacyDecision } from './decisionEngine';

const STORAGE_KEY = 'web-of-decisions-history';

export function saveDecision(decision: LegacyDecision): void {
    if (typeof window === 'undefined') return;

    const history = getDecisionHistory();
    history.unshift(decision);

    // Keep only last 50 decisions
    const trimmedHistory = history.slice(0, 50);

    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmedHistory));
    } catch (error) {
        console.error('Failed to save decision:', error);
    }
}

export function getDecisionHistory(): LegacyDecision[] {
    if (typeof window === 'undefined') return [];

    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error('Failed to load decision history:', error);
        return [];
    }
}

export function deleteDecision(id: string): void {
    if (typeof window === 'undefined') return;

    const history = getDecisionHistory();
    const filtered = history.filter(d => d.id !== id);

    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    } catch (error) {
        console.error('Failed to delete decision:', error);
    }
}

export function clearHistory(): void {
    if (typeof window === 'undefined') return;

    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
        console.error('Failed to clear history:', error);
    }
}

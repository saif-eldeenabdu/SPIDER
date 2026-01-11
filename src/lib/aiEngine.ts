// AI Engine v2 - Context-aware decision analysis
// Extracts meaning from natural language and generates unique, relevant pros/cons

import { Option, ProCon, generateId } from './decisionEngine';

// Keywords that indicate specific concerns/values
const contextKeywords = {
    money: ['salary', 'pay', 'money', 'cost', 'expensive', 'cheap', 'afford', 'budget', 'income', 'price', 'financial'],
    career: ['job', 'career', 'work', 'position', 'role', 'company', 'boss', 'promotion', 'opportunity'],
    location: ['move', 'relocate', 'city', 'location', 'distance', 'commute', 'travel', 'remote', 'office'],
    relationship: ['relationship', 'partner', 'love', 'marriage', 'dating', 'breakup', 'together', 'family'],
    health: ['health', 'stress', 'balance', 'burnout', 'mental', 'physical', 'exercise', 'sleep'],
    growth: ['learn', 'grow', 'skill', 'experience', 'develop', 'challenge', 'opportunity'],
    security: ['stable', 'secure', 'safe', 'risk', 'uncertain', 'guarantee', 'reliable'],
    time: ['time', 'hours', 'schedule', 'flexible', 'deadline', 'urgent', 'wait'],
    social: ['friends', 'family', 'people', 'network', 'community', 'alone', 'lonely'],
};

// Templates for generating context-specific insights
const proConGenerators: Record<string, { pros: string[], cons: string[] }> = {
    money_high: {
        pros: ['Significantly better compensation', 'Improved financial security', 'More resources for goals'],
        cons: ['May come with hidden trade-offs', 'Higher pay often means higher pressure', 'Money alone rarely brings fulfillment']
    },
    money_low: {
        pros: ['Lower financial pressure on decision', 'Focus on non-monetary factors', 'Freedom from money-driven choices'],
        cons: ['May limit future options', 'Could create financial strain', 'Opportunity cost of lower earning potential']
    },
    location_change: {
        pros: ['Fresh environment and perspectives', 'New opportunities in different market', 'Chance to reinvent yourself'],
        cons: ['Leaving established network behind', 'Adjustment period and loneliness risk', 'Unknown factors in new location']
    },
    location_stay: {
        pros: ['Preserved relationships and network', 'No disruption to current life', 'Known environment and comfort'],
        cons: ['Potential stagnation', 'Missing out on new experiences', 'Same limitations continue']
    },
    career_new: {
        pros: ['Growth into new challenges', 'Expanded skill set', 'Fresh start with new team'],
        cons: ['Proving yourself from scratch', 'Unknown company culture', 'Learning curve in new role']
    },
    career_stay: {
        pros: ['Established reputation and trust', 'Known expectations and dynamics', 'Job security from tenure'],
        cons: ['Limited growth if ceiling reached', 'Comfortable but not growing', 'May breed resentment over time']
    },
    relationship_commit: {
        pros: ['Deeper connection and partnership', 'Shared future and goals', 'Emotional security and support'],
        cons: ['Less individual freedom', 'Risk if issues aren\'t addressed', 'Commitment amplifies problems']
    },
    relationship_leave: {
        pros: ['Freedom to find better match', 'Personal growth opportunity', 'End to ongoing conflict'],
        cons: ['Loneliness and grief period', 'Uncertainty of dating again', 'Possibly losing something fixable']
    },
    security_risk: {
        pros: ['High upside potential', 'Personal growth through challenge', 'Breaking out of comfort zone'],
        cons: ['Uncertainty and stress', 'Potential for significant loss', 'No safety net if it fails']
    },
    security_safe: {
        pros: ['Predictability and stability', 'Lower stress environment', 'Foundation to build on'],
        cons: ['Limited upside potential', 'May breed complacency', 'Regret from not taking chances']
    }
};

export interface AIAnalysisResult {
    detectedType: string;
    options: Option[];
    confidence: number;
    insight: string;
    extractedContext: string[];
}

export function analyzeDecision(situationText: string): AIAnalysisResult {
    const lowerText = situationText.toLowerCase();
    const words = lowerText.split(/\s+/);

    // Extract context from the text
    const extractedContext: string[] = [];
    const contextScores: Record<string, number> = {};

    for (const [category, keywords] of Object.entries(contextKeywords)) {
        const matches = keywords.filter(kw => lowerText.includes(kw));
        if (matches.length > 0) {
            contextScores[category] = matches.length;
            extractedContext.push(...matches);
        }
    }

    // Determine primary decision type
    const sortedContexts = Object.entries(contextScores).sort((a, b) => b[1] - a[1]);
    const primaryType = sortedContexts[0]?.[0] || 'general';

    // Extract options from the text
    const options = extractOptionsFromSituation(situationText, sortedContexts.map(c => c[0]));

    // Generate personalized insight
    const insight = generateInsight(situationText, primaryType, extractedContext);

    const confidence = Math.min(0.95, 0.5 + (extractedContext.length * 0.05));

    return {
        detectedType: primaryType,
        options,
        confidence,
        insight,
        extractedContext
    };
}

function extractOptionsFromSituation(text: string, contexts: string[]): Option[] {
    const lowerText = text.toLowerCase();
    const options: Option[] = [];

    // Pattern matching for explicit options
    const orPatterns = [
        /should i\s+(.+?)\s+or\s+(.+?)(?:\?|$)/i,
        /between\s+(.+?)\s+(?:and|or|vs\.?)\s+(.+?)(?:\?|$)/i,
        /deciding\s+(?:whether\s+)?(?:to\s+)?(.+?)\s+or\s+(.+?)(?:\?|$)/i,
        /(.+?)\s+vs\.?\s+(.+?)(?:\?|$)/i,
    ];

    for (const pattern of orPatterns) {
        const match = text.match(pattern);
        if (match) {
            const opt1 = match[1].trim();
            const opt2 = match[2].trim();

            options.push(
                createContextualOption(capitalizeFirst(opt1), contexts, lowerText, true),
                createContextualOption(capitalizeFirst(opt2), contexts, lowerText, false)
            );
            return options;
        }
    }

    // Infer options from context if not explicitly stated
    if (contexts.includes('career')) {
        if (lowerText.includes('offer') || lowerText.includes('new job')) {
            options.push(
                createContextualOption('Take the new opportunity', contexts, lowerText, true),
                createContextualOption('Stay in current position', contexts, lowerText, false)
            );
        } else {
            options.push(
                createContextualOption('Make the change', contexts, lowerText, true),
                createContextualOption('Keep things as they are', contexts, lowerText, false)
            );
        }
    } else if (contexts.includes('relationship')) {
        options.push(
            createContextualOption('Move forward together', contexts, lowerText, true),
            createContextualOption('Take a different path', contexts, lowerText, false)
        );
    } else if (contexts.includes('location')) {
        options.push(
            createContextualOption('Make the move', contexts, lowerText, true),
            createContextualOption('Stay where you are', contexts, lowerText, false)
        );
    } else {
        options.push(
            createContextualOption('Go for it', contexts, lowerText, true),
            createContextualOption('Hold back', contexts, lowerText, false)
        );
    }

    return options;
}

function createContextualOption(name: string, contexts: string[], originalText: string, isChange: boolean): Option {
    const pros: ProCon[] = [];
    const cons: ProCon[] = [];

    // Generate pros and cons based on detected contexts
    for (const context of contexts.slice(0, 3)) {
        const key = getProConKey(context, isChange, originalText);
        const templates = proConGenerators[key];

        if (templates) {
            // Pick contextually relevant pros/cons
            templates.pros.forEach((text, i) => {
                if (i < 2) {
                    pros.push({ id: generateId(), text, weight: 7 - i });
                }
            });
            templates.cons.forEach((text, i) => {
                if (i < 2) {
                    cons.push({ id: generateId(), text, weight: 6 - i });
                }
            });
        }
    }

    // Add unique insight from original text
    const uniqueInsight = extractUniqueInsight(originalText, isChange);
    if (uniqueInsight) {
        if (isChange) {
            pros.unshift({ id: generateId(), text: uniqueInsight, weight: 8 });
        } else {
            cons.unshift({ id: generateId(), text: uniqueInsight, weight: 7 });
        }
    }

    // Ensure at least one pro and con
    if (pros.length === 0) {
        pros.push({ id: generateId(), text: isChange ? 'Potential for positive change' : 'Stability and predictability', weight: 5 });
    }
    if (cons.length === 0) {
        cons.push({ id: generateId(), text: isChange ? 'Uncertainty of new path' : 'Risk of stagnation', weight: 5 });
    }

    return {
        id: generateId(),
        name,
        pros: pros.slice(0, 4),
        cons: cons.slice(0, 4),
        confidence: 5
    };
}

function getProConKey(context: string, isChange: boolean, text: string): string {
    if (context === 'money') {
        return text.includes('higher') || text.includes('more') || text.includes('better') ? 'money_high' : 'money_low';
    }
    if (context === 'location') {
        return isChange ? 'location_change' : 'location_stay';
    }
    if (context === 'career') {
        return isChange ? 'career_new' : 'career_stay';
    }
    if (context === 'relationship') {
        return isChange ? 'relationship_commit' : 'relationship_leave';
    }
    if (context === 'security') {
        return isChange ? 'security_risk' : 'security_safe';
    }
    return isChange ? 'security_risk' : 'security_safe';
}

function extractUniqueInsight(text: string, isChange: boolean): string | null {
    const lowerText = text.toLowerCase();

    // Extract specific mentions
    if (lowerText.includes('higher pay') || lowerText.includes('more money')) {
        return isChange ? 'Better compensation as mentioned' : 'Current salary is acceptable';
    }
    if (lowerText.includes('relocate') || lowerText.includes('move')) {
        return isChange ? 'New location brings new possibilities' : 'No disruption to your current life';
    }
    if (lowerText.includes('family') || lowerText.includes('kids')) {
        return isChange ? 'Could benefit family long-term' : 'Family stability is preserved';
    }
    if (lowerText.includes('stress') || lowerText.includes('burnout')) {
        return isChange ? 'Escape from current stressors' : 'Known stressors are manageable';
    }
    if (lowerText.includes('dream') || lowerText.includes('passion')) {
        return isChange ? 'Aligned with your aspirations' : 'Sometimes stability enables dreams';
    }

    return null;
}

function generateInsight(text: string, primaryType: string, contexts: string[]): string {
    const lowerText = text.toLowerCase();

    // Generate a unique, situation-specific insight
    const contextStr = contexts.slice(0, 3).join(', ');

    const insights: Record<string, string> = {
        money: `Your situation involves financial considerations. Beyond the numbers, ask: what does financial security mean to you personally?`,
        career: `This is a career crossroads. Remember: the best job is rarely the safest or highest-paying—it's the one where you grow.`,
        location: `A location change affects everything. Consider not just the place, but who you'll become there.`,
        relationship: `Relationship decisions are rarely logical. Your gut already knows—this analysis helps you trust it.`,
        health: `You've mentioned well-being indicators. No opportunity is worth your health. Factor this heavily.`,
        growth: `Growth-focused decisions often feel risky. But staying comfortable has its own long-term costs.`,
        security: `You're weighing security vs potential. Both have value—the question is which you need more right now.`,
        time: `Time concerns are central here. You can't get time back, so consider what you'll wish you'd done.`,
        social: `Social factors are at play. Humans need connection—isolation can undermine any "logical" choice.`,
        general: `Based on: ${contextStr || 'your situation'}. Let's break this down systematically.`
    };

    return insights[primaryType] || insights.general;
}

function capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export function enhanceWithStrategistTone(recommendation: string, score: number): string {
    if (score > 15) {
        return "The analysis strongly favors this path. When the data is this clear, hesitation costs you. Move forward with conviction.";
    }
    if (score > 5) {
        return "This option has the edge, but margins matter. Execute with intention and stay alert to changing conditions.";
    }
    if (score > -5) {
        return "This is genuinely close. When data doesn't decide, your values must. What matters most to you right now?";
    }
    if (score > -15) {
        return "Caution is warranted. The analysis suggests reconsidering, but you may have information the numbers don't capture.";
    }
    return "The data advises against this. Trust the process—or be very certain you know something it doesn't.";
}

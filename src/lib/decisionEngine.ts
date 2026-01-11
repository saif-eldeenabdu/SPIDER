// Decision Engine - Core Logic for Web of Decisions
// Enhanced with multi-option support, context awareness, and advanced explanations

export interface ProCon {
  id: string;
  text: string;
  weight: number; // 1-10
}

export interface Option {
  id: string;
  name: string;
  pros: ProCon[];
  cons: ProCon[];
  confidence: number; // 1-10, how confident you are about this option
}

export interface DecisionContext {
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  urgency: number; // 1-10
  stressLevel: number; // 1-10
}

export interface Decision {
  id: string;
  title: string;
  options: Option[];
  importance: number; // 1-10
  mood: Mood;
  personality: Personality;
  context: DecisionContext;
  timestamp: number;
  results: OptionResult[];
  winningOption: OptionResult | null;
  explanation: string;
}

export interface OptionResult {
  optionId: string;
  optionName: string;
  score: number;
  breakdown: ScoreBreakdown;
  recommendation: string;
}

export interface ScoreBreakdown {
  baseScore: number;
  prosContribution: number;
  consContribution: number;
  confidenceBonus: number;
  moodModifier: number;
  personalityModifier: number;
  contextModifier: number;
  factors: string[];
}

// Legacy interface for backwards compatibility
export interface LegacyDecision {
  id: string;
  title: string;
  pros: ProCon[];
  cons: ProCon[];
  importance: number;
  mood: Mood;
  personality: Personality;
  timestamp: number;
  score: number;
  recommendation: string;
  explanation: string;
}

export type Mood = 'neutral' | 'stressed' | 'tired' | 'excited' | 'sad' | 'confused';
export type Personality = 'logical' | 'emotional' | 'balanced' | 'risk-taker' | 'conservative';

// Mood modifiers affect the final score
const moodModifiers: Record<Mood, {
  riskTolerance: number;
  complexityPenalty: number;
  safetyBonus: number;
  clarityBonus: number;
  description: string;
}> = {
  neutral: { riskTolerance: 0, complexityPenalty: 0, safetyBonus: 0, clarityBonus: 0, description: 'balanced judgment' },
  stressed: { riskTolerance: -0.2, complexityPenalty: -0.15, safetyBonus: 0.1, clarityBonus: 0, description: 'favoring safety over risk' },
  tired: { riskTolerance: -0.1, complexityPenalty: -0.3, safetyBonus: 0.1, clarityBonus: 0, description: 'simplicity preferred' },
  excited: { riskTolerance: 0.2, complexityPenalty: 0, safetyBonus: -0.1, clarityBonus: 0, description: 'embracing opportunity' },
  sad: { riskTolerance: -0.15, complexityPenalty: 0, safetyBonus: 0.25, clarityBonus: 0, description: 'seeking comfort' },
  confused: { riskTolerance: -0.1, complexityPenalty: -0.1, safetyBonus: 0.1, clarityBonus: 0.3, description: 'valuing clarity' },
};

// Personality profiles affect risk tolerance
const personalityModifiers: Record<Personality, {
  riskAdjustment: number;
  emotionalWeight: number;
  description: string;
}> = {
  logical: { riskAdjustment: 0, emotionalWeight: 0, description: 'pure data-driven' },
  emotional: { riskAdjustment: 0, emotionalWeight: 0.3, description: 'heart-centered' },
  balanced: { riskAdjustment: 0, emotionalWeight: 0.15, description: 'head and heart aligned' },
  'risk-taker': { riskAdjustment: 0.3, emotionalWeight: 0.1, description: 'opportunity-seeking' },
  conservative: { riskAdjustment: -0.3, emotionalWeight: 0.2, description: 'safety-first' },
};

// Context modifiers
const contextModifiers = {
  timeOfDay: {
    morning: { clarity: 0.1, description: 'Morning clarity bonus' },
    afternoon: { clarity: 0, description: 'Afternoon baseline' },
    evening: { clarity: -0.05, description: 'Evening fatigue' },
    night: { clarity: -0.15, description: 'Night-time impairment' },
  },
  urgency: (level: number) => ({
    modifier: (level - 5) * 0.02, // High urgency slightly favors action
    description: level > 7 ? 'High urgency favoring quick wins' : level < 3 ? 'Low urgency allowing careful analysis' : 'Moderate urgency'
  }),
  stress: (level: number) => ({
    modifier: (5 - level) * 0.03, // High stress reduces risk tolerance
    description: level > 7 ? 'High stress favoring safe options' : level < 3 ? 'Low stress enabling bold choices' : 'Moderate stress'
  })
};

export function calculateMultiOptionScore(
  options: Option[],
  importance: number,
  mood: Mood,
  personality: Personality,
  context: DecisionContext
): { results: OptionResult[]; winningOption: OptionResult | null; explanation: string } {

  const results: OptionResult[] = options.map(option => {
    const factors: string[] = [];

    // Base calculation: Σ(ProWeight) − Σ(ConWeight), scaled by importance
    const prosSum = option.pros.reduce((sum, pro) => sum + pro.weight, 0);
    const consSum = option.cons.reduce((sum, con) => sum + con.weight, 0);
    const prosContribution = prosSum * (importance / 5);
    const consContribution = consSum * (importance / 5);
    let baseScore = prosContribution - consContribution;

    factors.push(`📊 Base: +${prosContribution.toFixed(1)} pros, -${consContribution.toFixed(1)} cons = ${baseScore.toFixed(1)}`);

    // Confidence bonus (higher confidence = more reliable score)
    const confidenceBonus = (option.confidence - 5) * 0.5;
    factors.push(`🎯 Confidence (${option.confidence}/10): ${confidenceBonus >= 0 ? '+' : ''}${confidenceBonus.toFixed(1)}`);

    // Mood modifiers
    const moodMod = moodModifiers[mood];
    const moodModifier = baseScore * (moodMod.riskTolerance + moodMod.complexityPenalty + moodMod.safetyBonus + moodMod.clarityBonus);
    if (mood !== 'neutral') {
      factors.push(`🎭 Mood (${mood}, ${moodMod.description}): ${moodModifier >= 0 ? '+' : ''}${moodModifier.toFixed(1)}`);
    }

    // Personality modifiers
    const personalityMod = personalityModifiers[personality];
    const personalityModifier = baseScore * personalityMod.riskAdjustment;
    if (personality !== 'balanced') {
      factors.push(`🧠 Style (${personality}, ${personalityMod.description}): ${personalityModifier >= 0 ? '+' : ''}${personalityModifier.toFixed(1)}`);
    }

    // Context modifiers
    const timeContext = contextModifiers.timeOfDay[context.timeOfDay];
    const urgencyContext = contextModifiers.urgency(context.urgency);
    const stressContext = contextModifiers.stress(context.stressLevel);
    const contextModifier = baseScore * (timeContext.clarity + urgencyContext.modifier + stressContext.modifier);

    const contextFactors = [];
    if (context.timeOfDay !== 'afternoon') contextFactors.push(timeContext.description);
    if (context.urgency !== 5) contextFactors.push(urgencyContext.description);
    if (context.stressLevel !== 5) contextFactors.push(stressContext.description);

    if (contextFactors.length > 0) {
      factors.push(`⏰ Context (${contextFactors.join(', ')}): ${contextModifier >= 0 ? '+' : ''}${contextModifier.toFixed(1)}`);
    }

    // Final score
    const finalScore = Math.round(baseScore + confidenceBonus + moodModifier + personalityModifier + contextModifier);
    factors.push(`✨ Final Score: ${finalScore}`);

    // Generate recommendation
    let recommendation: string;
    if (finalScore > 20) {
      recommendation = "Strong choice! This option stands out significantly. 🚀";
    } else if (finalScore > 10) {
      recommendation = "Good option with solid advantages. 👍";
    } else if (finalScore > 0) {
      recommendation = "Slight edge, but consider carefully. 🤔";
    } else if (finalScore > -10) {
      recommendation = "Leaning negative. Weigh the cons. 👎";
    } else {
      recommendation = "Significant concerns with this option. ⛔";
    }

    return {
      optionId: option.id,
      optionName: option.name,
      score: finalScore,
      breakdown: {
        baseScore,
        prosContribution,
        consContribution,
        confidenceBonus,
        moodModifier,
        personalityModifier,
        contextModifier,
        factors
      },
      recommendation
    };
  });

  // Sort by score (highest first)
  results.sort((a, b) => b.score - a.score);

  const winningOption = results.length > 0 ? results[0] : null;

  // Generate overall explanation
  let explanation = '';
  if (results.length === 1) {
    explanation = `Based on your input, "${results[0].optionName}" scores ${results[0].score}. ${results[0].recommendation}`;
  } else if (results.length > 1) {
    const scoreDiff = results[0].score - results[1].score;
    if (scoreDiff > 15) {
      explanation = `🏆 Clear winner: "${results[0].optionName}" leads by ${scoreDiff} points!`;
    } else if (scoreDiff > 5) {
      explanation = `📊 "${results[0].optionName}" edges out "${results[1].optionName}" by ${scoreDiff} points.`;
    } else {
      explanation = `⚖️ Close call between "${results[0].optionName}" and "${results[1].optionName}" (only ${scoreDiff} points apart). Trust your gut!`;
    }
  }

  return { results, winningOption, explanation };
}

// Legacy function for backwards compatibility
export function calculateDecisionScore(
  pros: ProCon[],
  cons: ProCon[],
  importance: number,
  mood: Mood,
  personality: Personality
): { score: number; explanation: string; recommendation: string } {
  const option: Option = {
    id: 'legacy',
    name: 'This Decision',
    pros,
    cons,
    confidence: 5
  };

  const context: DecisionContext = {
    timeOfDay: 'afternoon',
    urgency: 5,
    stressLevel: 5
  };

  const { results } = calculateMultiOptionScore([option], importance, mood, personality, context);
  const result = results[0];

  return {
    score: result.score,
    explanation: result.breakdown.factors.join('\n'),
    recommendation: result.recommendation
  };
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

// Regret simulation
export interface RegretSimulation {
  timeframe: '1 week' | '1 month' | '1 year';
  regretLevel: number; // 1-10
  adjustment: string;
}

export function simulateRegret(
  decision: string,
  choice: 'yes' | 'no',
  timeframe: '1 week' | '1 month' | '1 year',
  regretLevel: number
): string {
  const timeMultiplier = timeframe === '1 week' ? 1 : timeframe === '1 month' ? 2 : 3;
  const adjustedRegret = regretLevel * timeMultiplier;

  if (adjustedRegret > 20) {
    return `High future regret detected. Consider ${choice === 'yes' ? 'reconsidering' : 'taking action'} on "${decision}". Your future self will thank you.`;
  } else if (adjustedRegret > 10) {
    return `Moderate regret possible. Think about what specifically concerns you about ${choice === 'yes' ? 'doing' : 'not doing'} this.`;
  } else {
    return `Low regret predicted. You seem confident about ${choice === 'yes' ? 'proceeding with' : 'passing on'} this decision.`;
  }
}

// Detect time of day
export function detectTimeOfDay(): DecisionContext['timeOfDay'] {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
}

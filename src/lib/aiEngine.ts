// AI Engine - Pattern-based decision analysis
// Extracts options and generates pros/cons from natural language

import { Option, ProCon, generateId } from './decisionEngine';

// Decision type patterns for intelligent generation
interface DecisionPattern {
    keywords: string[];
    type: string;
    commonOptions: string[];
    prosTemplates: { [key: string]: string[] };
    consTemplates: { [key: string]: string[] };
    hiddenRisks: { [key: string]: string[] };
}

const decisionPatterns: DecisionPattern[] = [
    {
        keywords: ['job', 'offer', 'career', 'position', 'work', 'company', 'salary', 'role'],
        type: 'career',
        commonOptions: ['Accept the new position', 'Stay at current job', 'Negotiate for better terms'],
        prosTemplates: {
            'accept': [
                'Higher salary potential',
                'New growth opportunities',
                'Fresh challenges to develop skills',
                'Expanded professional network',
                'Better work-life balance'
            ],
            'stay': [
                'Job security and stability',
                'Established relationships with colleagues',
                'Known work environment',
                'No adjustment period needed',
                'Existing benefits and seniority'
            ],
            'negotiate': [
                'Best of both worlds potential',
                'Shows confidence and value',
                'Could get better terms',
                'Keeps options open',
                'Demonstrates professional maturity'
            ]
        },
        consTemplates: {
            'accept': [
                'Uncertainty in new environment',
                'Leaving established relationships',
                'Learning curve for new systems',
                'Risk if company is unstable',
                'May not meet expectations'
            ],
            'stay': [
                'Missed opportunity for growth',
                'Potential stagnation',
                'Wonder "what if" later',
                'Salary might not improve',
                'Same challenges continue'
            ],
            'negotiate': [
                'Could lose the offer entirely',
                'May create tension',
                'Takes time and energy',
                'Uncertain outcome',
                'Could reveal desperation'
            ]
        },
        hiddenRisks: {
            'accept': [
                'Company culture might be toxic',
                'Role could differ from description',
                'Hidden expectations or overtime'
            ],
            'stay': [
                'Company trajectory might decline',
                'Resentment could build over time',
                'Missed timing for career moves'
            ],
            'negotiate': [
                'Perception of being difficult',
                'Delayed start creates uncertainty',
                'Competing offers might expire'
            ]
        }
    },
    {
        keywords: ['move', 'relocate', 'city', 'apartment', 'house', 'rent', 'location', 'neighborhood'],
        type: 'relocation',
        commonOptions: ['Move to the new place', 'Stay where you are', 'Find a compromise location'],
        prosTemplates: {
            'move': [
                'Fresh start and new experiences',
                'Better opportunities in new area',
                'Improved living conditions',
                'Closer to desired amenities',
                'Change of scenery for mental health'
            ],
            'stay': [
                'No moving costs or hassle',
                'Established community and friends',
                'Familiar with the area',
                'No disruption to routine',
                'Keep current setup intact'
            ],
            'compromise': [
                'Balances multiple priorities',
                'Might find unexpected gems',
                'Reduces extreme change',
                'Could satisfy multiple needs',
                'More options to explore'
            ]
        },
        consTemplates: {
            'move': [
                'Moving costs and effort',
                'Leaving friends and community',
                'Adjustment period',
                'Unknown neighborhood dynamics',
                'Risk of not liking new place'
            ],
            'stay': [
                'Missing out on better options',
                'Current problems persist',
                'May feel stuck or stagnant',
                'Costs might increase anyway',
                'Regret not taking the chance'
            ],
            'compromise': [
                'Might not fully satisfy anyone',
                'Extra research needed',
                'Could end up with mediocre option',
                'Decision fatigue from searching',
                'May delay resolution'
            ]
        },
        hiddenRisks: {
            'move': [
                'Lease or mortgage commitments',
                'Climate might not suit you',
                'Social isolation in new area'
            ],
            'stay': [
                'Declining neighborhood quality',
                'Rising costs without benefits',
                'Missed timing for housing market'
            ],
            'compromise': [
                'Neither option fully satisfied',
                'Commute implications',
                'School district considerations if applicable'
            ]
        }
    },
    {
        keywords: ['relationship', 'partner', 'dating', 'marriage', 'breakup', 'commitment', 'love'],
        type: 'relationship',
        commonOptions: ['Commit fully', 'End the relationship', 'Take a break to reflect'],
        prosTemplates: {
            'commit': [
                'Deeper emotional connection',
                'Shared future and goals',
                'Partnership and support',
                'Building something together',
                'Emotional security'
            ],
            'end': [
                'Freedom to find better fit',
                'Personal growth opportunity',
                'No more lingering doubts',
                'Fresh start',
                'Energy for self-focus'
            ],
            'break': [
                'Time to think clearly',
                'Reduces pressure',
                'Perspective without drama',
                'Tests feelings over time',
                'Space for individual growth'
            ]
        },
        consTemplates: {
            'commit': [
                'Risk if fundamental issues exist',
                'Locked into potential problems',
                'Less individual freedom',
                'May ignore red flags',
                'Emotional vulnerability'
            ],
            'end': [
                'Loneliness and grief',
                'Loss of shared life',
                'Starting over is hard',
                'Regret if fixable',
                'Impact on mutual friends/family'
            ],
            'break': [
                'Limbo state is stressful',
                'Partner may not wait',
                'Delays inevitable decision',
                'Mixed signals',
                'Hard to truly disconnect'
            ]
        },
        hiddenRisks: {
            'commit': [
                'Patterns might repeat',
                'External pressures influence decision',
                'Sunk cost fallacy at play'
            ],
            'end': [
                'Might idealize the past later',
                'Rebound risk',
                'Loneliness impacts judgment'
            ],
            'break': [
                'Others might pursue your partner',
                'Momentum harder to regain',
                'Emotional toll of uncertainty'
            ]
        }
    },
    {
        keywords: ['buy', 'purchase', 'invest', 'spend', 'money', 'expensive', 'afford', 'worth'],
        type: 'financial',
        commonOptions: ['Make the purchase', 'Wait and save more', 'Find an alternative'],
        prosTemplates: {
            'buy': [
                'Immediate enjoyment or utility',
                'No more waiting or wanting',
                'Value gained from use',
                'Could appreciate in value',
                'Solves the current need'
            ],
            'wait': [
                'More money saved',
                'Prices might drop',
                'Time to research better',
                'Financial security maintained',
                'Might lose desire (saving money)'
            ],
            'alternative': [
                'Could find better value',
                'Explore unknown options',
                'Balance cost and quality',
                'Learn more about needs',
                'Creative problem solving'
            ]
        },
        consTemplates: {
            'buy': [
                'Financial strain',
                'Might regret expense',
                'Better options could emerge',
                'Opportunity cost',
                'Buyers remorse risk'
            ],
            'wait': [
                'Delayed gratification',
                'Prices might increase',
                'Miss limited opportunities',
                'Continued inconvenience',
                'Overthinking risk'
            ],
            'alternative': [
                'Research takes time',
                'May compromise on features',
                'Decision fatigue',
                'Unknown risks',
                'Still spending money'
            ]
        },
        hiddenRisks: {
            'buy': [
                'Hidden maintenance costs',
                'Lifestyle inflation',
                'Emotional spending'
            ],
            'wait': [
                'Analysis paralysis',
                'Scarcity creates urgency later',
                'Opportunity truly passing'
            ],
            'alternative': [
                'Unknown vendor risks',
                'Quality unknown until tested',
                'Return policies matter'
            ]
        }
    }
];

// Default pattern for generic decisions
const defaultPattern: DecisionPattern = {
    keywords: [],
    type: 'general',
    commonOptions: ['Option A', 'Option B'],
    prosTemplates: {
        'optiona': [
            'Potential for positive change',
            'New experiences',
            'Growth opportunity',
            'Aligns with some goals',
            'Forward momentum'
        ],
        'optionb': [
            'Stability and safety',
            'Known outcomes',
            'Less disruption',
            'Preserves current state',
            'Lower risk'
        ]
    },
    consTemplates: {
        'optiona': [
            'Uncertainty involved',
            'Effort required',
            'Risk of failure',
            'Adjustment period',
            'Opportunity cost'
        ],
        'optionb': [
            'Missed opportunities',
            'Potential stagnation',
            'Same problems continue',
            'Wonder "what if"',
            'No forward progress'
        ]
    },
    hiddenRisks: {
        'optiona': [
            'External factors beyond control',
            'Hidden complications',
            'Timing considerations'
        ],
        'optionb': [
            'Gradual decline risk',
            'Opportunity window closing',
            'Regret accumulation'
        ]
    }
};

export interface AIAnalysisResult {
    detectedType: string;
    options: Option[];
    confidence: number;
    insight: string;
}

export function analyzeDecision(situationText: string): AIAnalysisResult {
    const lowerText = situationText.toLowerCase();

    // Find matching pattern
    let matchedPattern = defaultPattern;
    let maxMatches = 0;

    for (const pattern of decisionPatterns) {
        const matches = pattern.keywords.filter(keyword => lowerText.includes(keyword)).length;
        if (matches > maxMatches) {
            maxMatches = matches;
            matchedPattern = pattern;
        }
    }

    const confidence = Math.min(0.9, 0.5 + (maxMatches * 0.1));

    // Extract or generate options
    const extractedOptions = extractOptionsFromText(situationText, matchedPattern);

    // Generate insight
    const insight = generateInsight(matchedPattern.type, extractedOptions);

    return {
        detectedType: matchedPattern.type,
        options: extractedOptions,
        confidence,
        insight
    };
}

function extractOptionsFromText(text: string, pattern: DecisionPattern): Option[] {
    const lowerText = text.toLowerCase();
    const options: Option[] = [];

    // Try to find explicit options mentioned
    const orMatches = text.match(/(?:should I|whether to|between|choose|decide)\s+([^?]+?)(?:\s+or\s+|\s+vs\.?\s+)([^?.]+)/i);

    if (orMatches) {
        // User mentioned specific options
        const option1Name = orMatches[1].trim();
        const option2Name = orMatches[2].trim();

        options.push(
            createOptionWithProscons(option1Name, pattern, 0),
            createOptionWithProscons(option2Name, pattern, 1)
        );
    } else {
        // Use pattern-based options
        pattern.commonOptions.slice(0, 2).forEach((optName, index) => {
            options.push(createOptionWithProscons(optName, pattern, index));
        });
    }

    return options;
}

function createOptionWithProscons(name: string, pattern: DecisionPattern, index: number): Option {
    const templateKeys = Object.keys(pattern.prosTemplates);
    const templateKey = templateKeys[index] || templateKeys[0];

    const pros: ProCon[] = (pattern.prosTemplates[templateKey] || pattern.prosTemplates[templateKeys[0]])
        .slice(0, 3)
        .map(text => ({
            id: generateId(),
            text,
            weight: Math.floor(Math.random() * 3) + 5, // 5-7
        }));

    const cons: ProCon[] = (pattern.consTemplates[templateKey] || pattern.consTemplates[templateKeys[0]])
        .slice(0, 3)
        .map(text => ({
            id: generateId(),
            text,
            weight: Math.floor(Math.random() * 3) + 4, // 4-6
        }));

    return {
        id: generateId(),
        name,
        pros,
        cons,
        confidence: 5
    };
}

export function getHiddenRisks(optionName: string, decisionType: string): string[] {
    const pattern = decisionPatterns.find(p => p.type === decisionType) || defaultPattern;
    const key = Object.keys(pattern.hiddenRisks)[0];
    return pattern.hiddenRisks[key] || [];
}

function generateInsight(type: string, options: Option[]): string {
    const insights: Record<string, string> = {
        career: "Career decisions shape your trajectory for years. Consider not just salary, but growth, culture, and life balance.",
        relocation: "Where you live affects every aspect of your life. Consider community, opportunity, and your daily experience.",
        relationship: "Relationships are about shared growth. Focus on long-term compatibility over short-term comfort.",
        financial: "Money decisions compound over time. Consider both immediate value and long-term financial health.",
        general: "Every choice opens some doors and closes others. Focus on alignment with your core values."
    };

    return insights[type] || insights.general;
}

export function enhanceWithStrategistTone(recommendation: string, score: number): string {
    const tones = {
        strong_yes: [
            "Here's the truth: the data strongly favors this path. Trust the numbers, and trust yourself.",
            "Looking at this objectively, the answer is clear. Don't let fear hold you back.",
            "This choice aligns with growth. Fortune favors the bold who prepare."
        ],
        lean_yes: [
            "The scales tip positive here, but stay vigilant. Success requires follow-through.",
            "There's potential here. Execute with intention and you'll likely succeed.",
            "A calculated risk worth taking. Just keep your eyes open."
        ],
        neutral: [
            "This is genuinely close. Neither path is obviously wrong. Look inward.",
            "When the data is neutral, values become your compass. What matters most to you?",
            "A true crossroads. Either choice could work if you commit fully."
        ],
        lean_no: [
            "Caution is warranted here. The risks outweigh the visible gains.",
            "Something isn't adding up. Listen to that instinct whispering doubt.",
            "The path looks smoother than it is. Consider waiting for a better opportunity."
        ],
        strong_no: [
            "Walk away. This has failure written in the margins. Your future self will thank you.",
            "The analysis is clear: this isn't your fight. Save your energy for better battles.",
            "Not every opportunity is right. Knowing when to say no is wisdom."
        ]
    };

    let category: keyof typeof tones;
    if (score > 20) category = 'strong_yes';
    else if (score > 5) category = 'lean_yes';
    else if (score > -5) category = 'neutral';
    else if (score > -20) category = 'lean_no';
    else category = 'strong_no';

    const options = tones[category];
    return options[Math.floor(Math.random() * options.length)];
}

// Additional security configuration for advanced protection

export const ADVANCED_SECURITY_PATTERNS = {
  // Prompt injection variations
  INJECTION_ATTEMPTS: [
    /ignore\s+(all\s+)?previous\s+instructions?/i,
    /forget\s+(everything|all|previous)/i,
    /new\s+(role|character|persona|instructions?)/i,
    /pretend\s+(to\s+be|you\s+are)/i,
    /act\s+as\s+(if\s+)?you\s+(are|were)/i,
    /roleplay\s+as/i,
    /simulate\s+(being|a)/i,
    /hypothetically\s+speaking/i,
    /what\s+if\s+you\s+were/i,
    /let's\s+say\s+you\s+are/i,
  ],

  // Technical probing
  TECHNICAL_PROBES: [
    /how\s+(do\s+you|does\s+(this|it))\s+work/i,
    /what\s+(algorithm|model|framework)/i,
    /show\s+me\s+(the\s+)?(code|implementation)/i,
    /explain\s+(the\s+)?(technical|internal)/i,
    /tell\s+me\s+about\s+(your|the)\s+(system|architecture)/i,
    /what\s+(programming\s+)?language/i,
    /which\s+(database|framework|library)/i,
    /how\s+is\s+(this|it)\s+(built|implemented|coded)/i,
  ],

  // System information requests
  SYSTEM_QUERIES: [
    /system\s+(prompt|instructions?|message)/i,
    /initial\s+(prompt|instructions?)/i,
    /configuration\s+(file|settings?)/i,
    /environment\s+(variables?|settings?)/i,
    /api\s+(key|token|endpoint)/i,
    /database\s+(connection|schema|structure)/i,
    /server\s+(configuration|setup)/i,
  ],

  // Competitive intelligence
  COMPETITIVE_INTEL: [
    /competitors?/i,
    /compared?\s+to\s+(other|similar)/i,
    /advantages?\s+over/i,
    /why\s+(choose|use)\s+(this|quantime)/i,
    /what\s+makes\s+(this|you)\s+(different|special|unique)/i,
    /proprietary\s+(technology|algorithm|method)/i,
  ],
}

export function isHighRiskQuery(message: string): boolean {
  const allPatterns = [
    ...ADVANCED_SECURITY_PATTERNS.INJECTION_ATTEMPTS,
    ...ADVANCED_SECURITY_PATTERNS.TECHNICAL_PROBES,
    ...ADVANCED_SECURITY_PATTERNS.SYSTEM_QUERIES,
    ...ADVANCED_SECURITY_PATTERNS.COMPETITIVE_INTEL,
  ]

  return allPatterns.some((pattern) => pattern.test(message))
}

export function getContextualSecurityResponse(message: string): string {
  const responses = [
    "Quantime AI uses advanced proprietary algorithms for scheduling excellence. Let's focus on your timetabling needs - what challenge can I help solve?",
    "I'm designed to help with academic scheduling challenges rather than technical details. What specific timetabling question do you have?",
    "My expertise is in helping you achieve scheduling success. What aspect of timetable planning can I assist you with today?",
    "Let's focus on how Quantime AI can solve your scheduling challenges. What timetabling need can I help address?",
  ]

  // Return a random response to avoid predictability
  return responses[Math.floor(Math.random() * responses.length)]
}

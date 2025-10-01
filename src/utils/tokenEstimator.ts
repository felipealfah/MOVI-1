/**
 * Token Estimator Utility
 * Provides token estimation for API requests to validate user credits before sending
 */

export interface TokenEstimation {
  estimatedTokens: number;
  confidence: 'low' | 'medium' | 'high';
  breakdown?: {
    inputTokens: number;
    outputTokens: number;
    processingTokens: number;
  };
}

/**
 * Basic token estimation based on character count
 * Rule of thumb: 1 token ≈ 4 characters for most languages
 */
export const estimateBasicTokens = (text: string): number => {
  if (!text || text.trim().length === 0) return 0;

  // Remove extra whitespace and normalize
  const normalizedText = text.trim().replace(/\s+/g, ' ');

  // Basic estimation: 1 token per ~4 characters
  return Math.ceil(normalizedText.length / 4);
};

/**
 * Advanced token estimation for different content types
 */
export const estimateTokensByType = (
  content: string,
  contentType: 'text' | 'code' | 'json' | 'markdown' = 'text'
): TokenEstimation => {
  const baseTokens = estimateBasicTokens(content);

  let multiplier = 1;
  let confidence: TokenEstimation['confidence'] = 'medium';

  switch (contentType) {
    case 'code':
      // Code tends to have more tokens due to syntax
      multiplier = 1.3;
      confidence = 'medium';
      break;
    case 'json':
      // JSON has structural overhead
      multiplier = 1.2;
      confidence = 'high';
      break;
    case 'markdown':
      // Markdown has formatting tokens
      multiplier = 1.1;
      confidence = 'medium';
      break;
    default:
      multiplier = 1;
      confidence = 'medium';
  }

  const estimatedTokens = Math.ceil(baseTokens * multiplier);

  return {
    estimatedTokens,
    confidence,
    breakdown: {
      inputTokens: estimatedTokens,
      outputTokens: Math.ceil(estimatedTokens * 0.5), // Estimate 50% output
      processingTokens: Math.ceil(estimatedTokens * 0.1) // 10% processing overhead
    }
  };
};

/**
 * Estimate tokens for video generation requests
 */
export const estimateVideoTokens = (
  prompt: string,
  duration: number = 30,
  quality: 'low' | 'medium' | 'high' = 'medium'
): TokenEstimation => {
  const promptTokens = estimateBasicTokens(prompt);

  // Base cost per second of video
  const baseCostPerSecond = {
    low: 5,
    medium: 10,
    high: 20
  };

  const videoCost = duration * baseCostPerSecond[quality];
  const totalTokens = promptTokens + videoCost;

  return {
    estimatedTokens: totalTokens,
    confidence: 'medium',
    breakdown: {
      inputTokens: promptTokens,
      outputTokens: videoCost,
      processingTokens: Math.ceil(totalTokens * 0.1)
    }
  };
};

/**
 * Estimate tokens for text analysis requests
 */
export const estimateTextAnalysisTokens = (
  text: string,
  analysisType: 'sentiment' | 'summary' | 'keywords' | 'classification' = 'sentiment'
): TokenEstimation => {
  const inputTokens = estimateBasicTokens(text);

  // Different analysis types have different processing costs
  const processingMultiplier = {
    sentiment: 0.2,
    summary: 0.5,
    keywords: 0.1,
    classification: 0.3
  };

  const processingTokens = Math.ceil(inputTokens * processingMultiplier[analysisType]);
  const outputTokens = Math.ceil(inputTokens * 0.1); // Small output typically

  const totalTokens = inputTokens + processingTokens + outputTokens;

  return {
    estimatedTokens: totalTokens,
    confidence: 'high',
    breakdown: {
      inputTokens,
      outputTokens,
      processingTokens
    }
  };
};

/**
 * Check if user has sufficient credits for estimated tokens
 */
export const validateSufficientCredits = (
  userCredits: number,
  estimation: TokenEstimation,
  safetyMargin: number = 0.1
): {
  hasSufficientCredits: boolean;
  requiredCredits: number;
  shortage: number;
  safetyBuffer: number;
} => {
  const safetyBuffer = Math.ceil(estimation.estimatedTokens * safetyMargin);
  const requiredCredits = estimation.estimatedTokens + safetyBuffer;
  const hasSufficientCredits = userCredits >= requiredCredits;
  const shortage = hasSufficientCredits ? 0 : requiredCredits - userCredits;

  return {
    hasSufficientCredits,
    requiredCredits,
    shortage,
    safetyBuffer
  };
};

/**
 * Format token estimation for user display
 */
export const formatTokenEstimation = (estimation: TokenEstimation): string => {
  const { estimatedTokens, confidence, breakdown } = estimation;

  let message = `~${estimatedTokens} créditos`;

  if (confidence === 'low') {
    message += ' (estimativa aproximada)';
  } else if (confidence === 'high') {
    message += ' (estimativa precisa)';
  }

  if (breakdown) {
    message += `\n• Entrada: ${breakdown.inputTokens}`;
    message += `\n• Processamento: ${breakdown.processingTokens}`;
    message += `\n• Saída: ${breakdown.outputTokens}`;
  }

  return message;
};

/**
 * Get estimation for specific API endpoints
 */
export const getApiTokenEstimation = (
  apiEndpoint: string,
  inputData: any
): TokenEstimation => {
  switch (apiEndpoint) {
    case 'video-generator':
      return estimateVideoTokens(
        inputData.prompt || '',
        inputData.duration || 30,
        inputData.quality || 'medium'
      );

    case 'text-analysis':
      return estimateTextAnalysisTokens(
        inputData.text || '',
        inputData.analysisType || 'sentiment'
      );

    case 'qr-generator':
      return {
        estimatedTokens: 5, // QR generation is cheap
        confidence: 'high'
      };

    case 'speech-synthesis':
      const textTokens = estimateBasicTokens(inputData.text || '');
      return {
        estimatedTokens: Math.max(textTokens, 10), // Minimum 10 tokens
        confidence: 'high'
      };

    case 'document-parser':
      return estimateTokensByType(
        inputData.content || '',
        inputData.documentType || 'text'
      );

    default:
      // Generic estimation
      return estimateTokensByType(
        JSON.stringify(inputData),
        'json'
      );
  }
};
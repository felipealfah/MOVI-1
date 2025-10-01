import { useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  TokenEstimation,
  validateSufficientCredits,
  formatTokenEstimation,
  getApiTokenEstimation
} from '../utils/tokenEstimator';

export interface TokenValidationResult {
  isValid: boolean;
  estimation: TokenEstimation;
  requiredCredits: number;
  shortage: number;
  message: string;
  canProceed: boolean;
}

export const useTokenValidation = () => {
  const { user } = useAuth();
  const [isValidating, setIsValidating] = useState(false);

  const validateTokens = useCallback(
    (apiEndpoint: string, inputData: any, safetyMargin: number = 0.1): TokenValidationResult => {
      setIsValidating(true);

      try {
        // Get token estimation for the specific API
        const estimation = getApiTokenEstimation(apiEndpoint, inputData);

        // Check if user has sufficient credits
        const validation = validateSufficientCredits(
          user?.credits || 0,
          estimation,
          safetyMargin
        );

        let message = '';
        let canProceed = false;

        if (validation.hasSufficientCredits) {
          message = `Estimativa: ${formatTokenEstimation(estimation)}`;
          canProceed = true;
        } else {
          message = `Créditos insuficientes! Necessários: ${validation.requiredCredits}, Disponíveis: ${user?.credits || 0}, Faltam: ${validation.shortage}`;
          canProceed = false;
        }

        return {
          isValid: validation.hasSufficientCredits,
          estimation,
          requiredCredits: validation.requiredCredits,
          shortage: validation.shortage,
          message,
          canProceed
        };
      } catch (error) {
        console.error('Token validation error:', error);
        return {
          isValid: false,
          estimation: { estimatedTokens: 0, confidence: 'low' },
          requiredCredits: 0,
          shortage: 0,
          message: 'Erro na validação de créditos',
          canProceed: false
        };
      } finally {
        setIsValidating(false);
      }
    },
    [user?.credits]
  );

  const validateAndProceed = useCallback(
    (
      apiEndpoint: string,
      inputData: any,
      onSuccess: (estimation: TokenEstimation) => void,
      onError: (result: TokenValidationResult) => void,
      safetyMargin: number = 0.1
    ) => {
      const result = validateTokens(apiEndpoint, inputData, safetyMargin);

      if (result.canProceed) {
        onSuccess(result.estimation);
      } else {
        onError(result);
      }
    },
    [validateTokens]
  );

  return {
    validateTokens,
    validateAndProceed,
    isValidating,
    userCredits: user?.credits || 0
  };
};
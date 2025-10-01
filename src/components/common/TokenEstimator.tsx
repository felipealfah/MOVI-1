import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Clock, CreditCard } from 'lucide-react';
import { useTokenValidation, TokenValidationResult } from '../../hooks/useTokenValidation';

interface TokenEstimatorProps {
  apiEndpoint: string;
  inputData: any;
  onValidationChange?: (result: TokenValidationResult) => void;
  showDetails?: boolean;
  autoValidate?: boolean;
  safetyMargin?: number;
  className?: string;
}

export const TokenEstimator: React.FC<TokenEstimatorProps> = ({
  apiEndpoint,
  inputData,
  onValidationChange,
  showDetails = true,
  autoValidate = true,
  safetyMargin = 0.1,
  className = ''
}) => {
  const { validateTokens, isValidating, userCredits } = useTokenValidation();
  const [validationResult, setValidationResult] = useState<TokenValidationResult | null>(null);

  useEffect(() => {
    if (autoValidate && inputData && Object.keys(inputData).length > 0) {
      const result = validateTokens(apiEndpoint, inputData, safetyMargin);
      setValidationResult(result);
      onValidationChange?.(result);
    }
  }, [apiEndpoint, inputData, safetyMargin, autoValidate, validateTokens, onValidationChange]);

  const handleManualValidation = () => {
    const result = validateTokens(apiEndpoint, inputData, safetyMargin);
    setValidationResult(result);
    onValidationChange?.(result);
  };

  if (!validationResult && !autoValidate) {
    return (
      <div className={`bg-gray-50 border border-gray-200 rounded-lg p-4 ${className}`}>
        <button
          onClick={handleManualValidation}
          disabled={isValidating}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 disabled:opacity-50"
        >
          <Clock className="w-4 h-4" />
          {isValidating ? 'Validando...' : 'Estimar Créditos'}
        </button>
      </div>
    );
  }

  if (isValidating) {
    return (
      <div className={`bg-gray-50 border border-gray-200 rounded-lg p-4 ${className}`}>
        <div className="flex items-center gap-2 text-gray-600">
          <Clock className="w-4 h-4 animate-spin" />
          <span>Calculando estimativa...</span>
        </div>
      </div>
    );
  }

  if (!validationResult) {
    return null;
  }

  const { isValid, estimation, requiredCredits, shortage, message, canProceed } = validationResult;

  return (
    <div className={`border rounded-lg p-4 ${className} ${
      canProceed
        ? 'bg-green-50 border-green-200'
        : 'bg-red-50 border-red-200'
    }`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          {canProceed ? (
            <CheckCircle className="w-5 h-5 text-green-600" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h4 className={`text-sm font-medium ${
              canProceed ? 'text-green-800' : 'text-red-800'
            }`}>
              {canProceed ? 'Créditos Suficientes' : 'Créditos Insuficientes'}
            </h4>

            <div className="flex items-center gap-1 text-sm text-gray-600">
              <CreditCard className="w-4 h-4" />
              <span>{userCredits} disponíveis</span>
            </div>
          </div>

          <p className={`text-sm ${
            canProceed ? 'text-green-700' : 'text-red-700'
          } mb-3`}>
            {message}
          </p>

          {showDetails && estimation && (
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-gray-500">Estimativa:</span>
                  <div className="font-medium">
                    ~{estimation.estimatedTokens} créditos
                  </div>
                  <div className="text-gray-400">
                    Confiança: {estimation.confidence === 'high' ? 'Alta' :
                               estimation.confidence === 'medium' ? 'Média' : 'Baixa'}
                  </div>
                </div>

                <div>
                  <span className="text-gray-500">Necessários:</span>
                  <div className="font-medium">{requiredCredits} créditos</div>
                  {shortage > 0 && (
                    <div className="text-red-500">Faltam: {shortage}</div>
                  )}
                </div>
              </div>

              {estimation.breakdown && (
                <div className="pt-2 border-t border-gray-200">
                  <div className="text-xs text-gray-500 mb-1">Detalhamento:</div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <div className="text-gray-400">Entrada</div>
                      <div className="font-medium">{estimation.breakdown.inputTokens}</div>
                    </div>
                    <div>
                      <div className="text-gray-400">Processamento</div>
                      <div className="font-medium">{estimation.breakdown.processingTokens}</div>
                    </div>
                    <div>
                      <div className="text-gray-400">Saída</div>
                      <div className="font-medium">{estimation.breakdown.outputTokens}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {!canProceed && (
            <div className="mt-3 pt-3 border-t border-red-200">
              <p className="text-xs text-red-600">
                💡 Adquira mais créditos na aba "Pagamentos" para continuar
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
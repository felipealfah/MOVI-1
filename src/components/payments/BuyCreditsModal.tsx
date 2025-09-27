import React, { useState } from 'react';
import { X, CreditCard, Loader2 } from 'lucide-react';
import { createCheckoutSession } from '../../lib/stripe';
import { STRIPE_PRODUCTS } from '../../stripe-config';

interface BuyCreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BuyCreditsModal({ isOpen, onClose }: BuyCreditsModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'idle' | 'creating' | 'redirecting'>('idle');

  if (!isOpen) return null;

  const handlePurchase = async (productId: keyof typeof STRIPE_PRODUCTS) => {
    console.log('Starting purchase for product:', productId);
    setLoading(true);
    setError('');
    setStep('creating');
    
    // Aumentar timeout para 60 segundos
    const timeoutId = setTimeout(() => {
      console.error('Request timeout after 60 seconds');
      setError('Request timeout. This might indicate that the Supabase Edge Function is not deployed or not responding.');
      setLoading(false);
      setStep('idle');
    }, 60000);

    try {
      console.log('Calling createCheckoutSession...');
      const { url } = await createCheckoutSession(productId);
      clearTimeout(timeoutId);
      console.log('Received checkout URL:', url);
      
      if (url) {
        console.log('Redirecting to Stripe checkout...');
        setStep('redirecting');
        
        // Show user that redirect is happening
        setTimeout(() => {
          console.log('Opening Stripe checkout in new tab...');
          window.open(url, '_blank');
          
          // Reset modal state after redirect
          setTimeout(() => {
            setLoading(false);
            setStep('idle');
            onClose();
          }, 2000);
        }, 500);
        window.location.href = url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      
      let errorMessage = 'Failed to create checkout session.';
      
      if (err.message.includes('timeout')) {
        errorMessage = 'Connection timeout. The Supabase Edge Function may not be deployed or responding.';
      } else if (err.message.includes('Network error')) {
        errorMessage = 'Network error. Please check if the Supabase Edge Function is deployed.';
      } else if (err.message.includes('User not authenticated')) {
        errorMessage = 'Authentication error. Please log out and log in again.';
      } else if (err.message.includes('Supabase URL')) {
        errorMessage = 'Configuration error. Please check Supabase URL.';
      } else {
        errorMessage = `Error: ${err.message}`;
      }
      
      setError(errorMessage);
    } finally {
      clearTimeout(timeoutId);
      if (step !== 'redirecting') {
        setLoading(false);
        setStep('idle');
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="border border-white max-w-md w-full" style={{ backgroundColor: '#212121' }}>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Buy Credits</h2>
            <button
              onClick={onClose}
              className="border border-white p-2 hover:bg-black transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 border border-red-500 text-red-500 text-sm" style={{ backgroundColor: '#131313' }}>
              <div className="font-medium mb-2">Payment Error:</div>
              <div className="text-xs">{error}</div>
              <div className="mt-2 text-xs opacity-75">
                Please check if the Stripe Price ID is configured correctly.
              </div>
            </div>
          )}

          {/* Products */}
          <div className="space-y-4">
            {Object.entries(STRIPE_PRODUCTS).map(([productId, product]) => (
              <div
                key={productId}
                className={`border p-4 hover:bg-black transition-colors relative ${
                  product.category === 'premium' 
                    ? 'border-yellow-500 bg-yellow-50' 
                    : 'border-white'
                }`}
                style={{ backgroundColor: '#131313' }}
              >
                {product.category === 'premium' && (
                  <div className="absolute -top-2 -right-2 bg-yellow-500 text-black px-2 py-1 text-xs font-bold rounded">
                    BEST VALUE
                  </div>
                )}
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{product.name}</h3>
                    <p className="text-white opacity-60 text-sm">{product.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-bold text-xl">+{product.credits.toLocaleString()}</div>
                    <div className="text-white opacity-60 text-sm">credits</div>
                    <div className="text-green-400 font-bold text-lg mt-1">
                      ${product.totalPrice.toFixed(2)}
                    </div>
                  </div>
                </div>
                <p className="text-white opacity-80 text-xs mt-1">
                  ${product.pricePerMinute.toFixed(2)} per minute
                </p>
                
                <button
                  onClick={() => handlePurchase(productId as keyof typeof STRIPE_PRODUCTS)}
                  disabled={loading}
                  className="w-full bg-white text-black font-medium py-3 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>
                        {step === 'creating' && 'Creating checkout session...'}
                        {step === 'redirecting' && 'Redirecting to Stripe...'}
                        {step === 'idle' && 'Processing...'}
                      </span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" />
                      <span>Comprar Agora</span>
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>

          {/* Info */}
          <div className="mt-6 p-4 border border-white" style={{ backgroundColor: '#131313' }}>
            <h4 className="text-white font-medium mb-2">Payment Information</h4>
            <ul className="text-white opacity-60 text-sm space-y-1">
              <li>• Secure processing via Stripe</li>
              <li>• Credits added automatically within 30 seconds</li>
              <li>• All major credit cards accepted</li>
              <li>• One-time purchase, no subscription</li>
              <li>• You will be redirected after payment</li>
              <li>• <strong>Basic Plan (100 credits): $0.20/min</strong></li>
              <li>• <strong>Premium/Business (500+ credits): $0.15/min</strong></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
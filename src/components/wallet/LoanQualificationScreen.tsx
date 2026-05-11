import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { 
  TrendingUp, 
  Loader2, 
  CheckCircle2,
  Sparkles,
  Award,
  ArrowRight,
  Gift,
  Zap,
  Shield
} from "lucide-react";

interface LoanQualificationScreenProps {
  currentLoanAmount: number;
  onApplyForLoan: (amount: number) => void;
  onBackToSuccess: () => void;
}

export const LoanQualificationScreen: React.FC<LoanQualificationScreenProps> = ({
  currentLoanAmount,
  onApplyForLoan,
  onBackToSuccess,
}) => {
  const [isChecking, setIsChecking] = useState(true);
  const [qualifiedAmount, setQualifiedAmount] = useState(0);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    // Simulate qualification check
    const checkQualification = async () => {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Generate a higher qualified amount (2x to 4x current loan)
      const multiplier = Math.floor(Math.random() * 3) + 2; // 2, 3, or 4
      const qualified = currentLoanAmount * multiplier;
      
      setQualifiedAmount(qualified);
      setIsChecking(false);
      setShowResults(true);
    };

    checkQualification();
  }, [currentLoanAmount]);

  const loanOptions = [
    {
      amount: Math.floor(qualifiedAmount * 0.5),
      period: 6,
      monthly: Math.floor((qualifiedAmount * 0.5 * 1.1) / 6),
      popular: false
    },
    {
      amount: Math.floor(qualifiedAmount * 0.75),
      period: 9,
      monthly: Math.floor((qualifiedAmount * 0.75 * 1.1) / 9),
      popular: true
    },
    {
      amount: qualifiedAmount,
      period: 12,
      monthly: Math.floor((qualifiedAmount * 1.1) / 12),
      popular: false
    }
  ];

  if (isChecking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center p-3 sm:p-4">
        <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl max-w-sm sm:max-w-md w-full text-center space-y-4 sm:space-y-6">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-purple-500 rounded-full flex items-center justify-center mx-auto">
            <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 text-white animate-spin" />
          </div>
          
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-purple-600 mb-2">Checking Qualification...</h2>
            <p className="text-gray-600 text-sm sm:text-base px-2">
              We're analyzing your credit profile and payment history
            </p>
          </div>

          <div className="space-y-3">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-purple-500 rounded-full animate-pulse" style={{ width: '75%' }}></div>
            </div>
            <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-gray-600">
              <Shield className="w-4 h-4" />
              <span>Secure verification in progress</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 pb-4 sm:pb-6 overflow-x-hidden">
        {/* Success Header */}
        <div className="bg-gradient-to-br from-purple-500 to-pink-500 text-white p-4 sm:p-6 pb-24 sm:pb-32 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 bg-purple-400/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 sm:w-48 sm:h-48 bg-pink-300/10 rounded-full blur-2xl"></div>
          
          <div className="relative z-10 text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 animate-bounce-in shadow-xl">
              <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 text-purple-500" />
            </div>
            <div className="flex items-center justify-center gap-1 sm:gap-2 mb-2">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-300" />
              <h1 className="text-2xl sm:text-3xl font-bold">You Qualify!</h1>
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-300" />
            </div>
            <p className="text-white/90 text-base sm:text-lg px-4">Amazing news! You've been pre-approved</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-3 sm:px-4 -mt-20 sm:-mt-24 relative z-20 space-y-3 sm:space-y-4">
          {/* Qualified Amount Card */}
          <div className="bg-gradient-to-br from-yellow-400 to-orange-400 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl text-white">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Award className="w-5 h-5 sm:w-6 sm:h-6" />
              <p className="text-xs sm:text-sm font-semibold uppercase">Your Qualified Amount</p>
            </div>
            <div className="text-center">
              <p className="text-4xl sm:text-5xl font-bold mb-2">KES {qualifiedAmount.toLocaleString()}</p>
              <div className="flex items-center justify-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 sm:px-4 py-2 inline-flex">
                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="text-xs sm:text-sm font-semibold">
                  {Math.floor((qualifiedAmount / currentLoanAmount) * 100)}% increase from your previous loan!
                </span>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg border border-purple-100">
            <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 flex items-center gap-2">
              <Gift className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
              Exclusive Benefits
            </h3>
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm sm:text-base">Get All Funds at Once</p>
                  <p className="text-xs sm:text-sm text-gray-600">Receive the full amount immediately upon approval</p>
                </div>
              </div>
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm sm:text-base">Flexible Repayment</p>
                  <p className="text-xs sm:text-sm text-gray-600">Repay after completing your previous loan</p>
                </div>
              </div>
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm sm:text-base">No Repeat Guarantors</p>
                  <p className="text-xs sm:text-sm text-gray-600">Use a different guarantor for this loan</p>
                </div>
              </div>
            </div>
          </div>

          {/* Loan Options */}
          <div className="space-y-2 sm:space-y-3">
            <h3 className="text-base sm:text-lg font-bold px-2">Choose Your Loan Amount</h3>
            {loanOptions.map((option, index) => (
              <div
                key={index}
                className={`bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-lg border-2 transition-all ${
                  option.popular 
                    ? 'border-purple-500 ring-2 ring-purple-200' 
                    : 'border-gray-200'
                }`}
              >
                {option.popular && (
                  <div className="flex items-center gap-1 bg-purple-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs font-bold mb-2 sm:mb-3 inline-flex">
                    <Sparkles className="w-3 h-3" />
                    MOST POPULAR
                  </div>
                )}
                
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-xl sm:text-2xl font-bold text-purple-600">
                      KES {option.amount.toLocaleString()}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600">{option.period} months repayment</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-600">Monthly</p>
                    <p className="text-base sm:text-lg font-bold text-gray-800">
                      KES {option.monthly.toLocaleString()}
                    </p>
                  </div>
                </div>

                <Button
                  onClick={() => onApplyForLoan(option.amount)}
                  className={`w-full py-4 sm:py-6 rounded-lg sm:rounded-xl font-bold text-sm sm:text-base transition-all active:scale-95 ${
                    option.popular
                      ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                  }`}
                >
                  Apply for This Amount
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                </Button>
              </div>
            ))}
          </div>

          {/* Back Button */}
          <Button
            onClick={onBackToSuccess}
            variant="outline"
            className="w-full py-4 sm:py-6 rounded-xl sm:rounded-2xl font-semibold text-sm sm:text-base border-2 active:scale-95 transition-transform"
          >
            Maybe Later
          </Button>
        </div>
      </div>
    );
  }

  return null;
};

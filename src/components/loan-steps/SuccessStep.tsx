import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { LoanApplicationData } from "../ZenkaApp";
import { CheckCircle, Wallet, TrendingUp, Calendar, Sparkles } from "lucide-react";
import walletSuccessImage from "../../assets/wallet-success.jpg";
import { WalletAccount } from "../wallet/WalletAccount";

interface SuccessStepProps {
  applicationData: LoanApplicationData;
  onNext: (data?: Partial<LoanApplicationData>) => void;
  onBack: () => void;
  onUpdate: (data: Partial<LoanApplicationData>) => void;
  onStartNewApplication?: (loanAmount: number) => void;
}

export const SuccessStep: React.FC<SuccessStepProps> = ({ applicationData, onStartNewApplication }) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [creditedAmount, setCreditedAmount] = useState(0);
  const [showWallet, setShowWallet] = useState(false);

  useEffect(() => {
    // Trigger confetti effect
    setShowConfetti(true);
    
    // Animate the credited amount
    const targetAmount = applicationData.loanAmount;
    const duration = 2000;
    const steps = 60;
    const increment = targetAmount / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= targetAmount) {
        setCreditedAmount(targetAmount);
        clearInterval(timer);
      } else {
        setCreditedAmount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [applicationData.loanAmount]);

  const handleWithdrawFunds = () => {
    setShowWallet(true);
  };

  // Show wallet interface instead of success screen
  if (showWallet) {
    return <WalletAccount 
      applicationData={applicationData} 
      onApplyForLoan={(amount) => {
        // Start new loan application with the selected amount
        if (onStartNewApplication) {
          onStartNewApplication(amount);
        }
      }}
    />;
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Confetti Background Effect */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-10 w-3 h-3 sm:w-4 sm:h-4 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="absolute top-20 right-20 w-2 h-2 sm:w-3 sm:h-3 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute top-32 left-1/4 w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-16 right-1/3 w-2 h-2 sm:w-3 sm:h-3 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '1.5s' }}></div>
          <div className="absolute top-40 left-3/4 w-3 h-3 sm:w-4 sm:h-4 bg-primary rounded-full animate-bounce" style={{ animationDelay: '2s' }}></div>
        </div>
      )}

      <div className="flex-1 flex flex-col justify-center items-center p-4 sm:p-6 animate-fade-in">
        <div className="max-w-md w-full text-center space-y-4 sm:space-y-6">
          {/* Success Animation */}
          <div className="relative">
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-success rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 animate-bounce-in shadow-lg">
              <CheckCircle className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
            </div>
            <div className="absolute -top-2 -right-2">
              <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-primary animate-spin" />
            </div>
          </div>

          {/* Success Message */}
          <div className="space-y-2 sm:space-y-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary animate-bounce-in">
              Congratulations!
            </h1>
            <p className="text-base sm:text-xl text-foreground font-semibold px-4">
              Your loan has been approved and credited to your wallet!
            </p>
          </div>

          {/* Credited Amount Display */}
          <div className="card-modern p-4 sm:p-6 bg-success/10 border border-success/20 shadow-lg">
            <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <Wallet className="w-6 h-6 sm:w-8 sm:h-8 text-success" />
              <h2 className="text-lg sm:text-2xl font-bold text-success">Amount Credited</h2>
            </div>
            <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary mb-2">
              KES {creditedAmount.toLocaleString()}
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Available in your Zenk wallet now
            </p>
          </div>

          {/* Loan Summary Cards */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="card-modern p-3 sm:p-4 active:scale-95 transition-transform duration-200">
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-primary mb-1 sm:mb-2 mx-auto" />
              <div className="text-xs sm:text-sm text-muted-foreground">Monthly Payment</div>
              <div className="text-base sm:text-lg font-bold text-primary">
                KES {applicationData.monthlyPayment.toLocaleString()}
              </div>
            </div>
            <div className="card-modern p-3 sm:p-4 active:scale-95 transition-transform duration-200">
              <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-secondary mb-1 sm:mb-2 mx-auto" />
              <div className="text-xs sm:text-sm text-muted-foreground">Repayment Period</div>
              <div className="text-base sm:text-lg font-bold text-secondary">
                {applicationData.repaymentPeriod} months
              </div>
            </div>
          </div>

          {/* Wallet Preview */}
          <div className="card-modern p-3 sm:p-4 bg-card/80 active:scale-95 transition-transform duration-200">
            <img 
              src={walletSuccessImage} 
              alt="Wallet Success" 
              className="w-full h-24 sm:h-32 object-cover rounded-lg mb-3 sm:mb-4"
            />
            <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2">Your Zenk Wallet</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Access your funds anytime, make payments, and track your loan progress.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2 sm:pt-4">
            <Button 
              onClick={handleWithdrawFunds}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-base sm:text-lg py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95"
            >
              <span className="whitespace-nowrap">Withdraw Funds</span>
            </Button>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Your first repayment is due in 30 days
            </p>
          </div>

          {/* Achievement Badge */}
          <div className="bg-primary/10 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-primary/30">
            <div className="flex items-center justify-center gap-2 mb-1 sm:mb-2">
              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white text-[10px] sm:text-xs font-bold">1</span>
              </div>
              <span className="text-sm sm:text-base font-semibold">First Loan Achievement</span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">
              You've unlocked higher loan limits for future applications!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
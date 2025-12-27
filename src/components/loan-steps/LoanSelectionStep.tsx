import React, { useState } from "react";
import { Button } from "../ui/button";
import { LoanApplicationData } from "../ZenkaApp";
import { Banknote, TrendingUp, Clock, CheckCircle2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Label } from "../ui/label";

interface LoanSelectionStepProps {
  applicationData: LoanApplicationData;
  onNext: (data?: Partial<LoanApplicationData>) => void;
  onBack: () => void;
  onUpdate: (data: Partial<LoanApplicationData>) => void;
}

interface LoanOption {
  amount: number;
  savings: number;
  popular?: boolean;
}

export const LoanSelectionStep: React.FC<LoanSelectionStepProps> = ({ 
  applicationData, 
  onNext, 
  onUpdate 
}) => {
  const [selectedAmount, setSelectedAmount] = useState(applicationData.loanAmount || 0);
  const [repaymentPeriod, setRepaymentPeriod] = useState(applicationData.repaymentPeriod || 6);

  const loanOptions: LoanOption[] = [
    { amount: 5000, savings: 150 },
    { amount: 7000, savings: 200 },
    { amount: 10000, savings: 250, popular: true },
    { amount: 14000, savings: 300 },
    { amount: 16000, savings: 350 },
    { amount: 19000, savings: 400 },
    { amount: 22000, savings: 450 },
    { amount: 25000, savings: 500 },
  ];

  const calculateLoanDetails = (amount: number, period: number) => {
    const interestRate = 0.10; // 10% interest
    const interest = amount * interestRate;
    const totalRepayment = amount + interest;
    const monthlyPayment = totalRepayment / period;
    const savingsDeposit = loanOptions.find(option => option.amount === amount)?.savings || 0;

    return {
      interest,
      totalRepayment,
      monthlyPayment,
      savingsDeposit,
    };
  };

  const loanDetails = selectedAmount > 0 ? calculateLoanDetails(selectedAmount, repaymentPeriod) : null;

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    const details = calculateLoanDetails(amount, repaymentPeriod);
    const updatedData = {
      loanAmount: amount,
      repaymentPeriod,
      ...details,
    };
    onUpdate(updatedData);
  };

  const handlePeriodChange = (period: string) => {
    const periodNum = parseInt(period);
    setRepaymentPeriod(periodNum);
    if (selectedAmount > 0) {
      const details = calculateLoanDetails(selectedAmount, periodNum);
      const updatedData = {
        loanAmount: selectedAmount,
        repaymentPeriod: periodNum,
        ...details,
      };
      onUpdate(updatedData);
    }
  };

  const handleNext = () => {
    if (selectedAmount > 0 && loanDetails) {
      onNext();
    }
  };

  return (
    <div className="max-w-md mx-auto p-3 sm:p-6 animate-fade-in">
      <div className="card-modern p-4 sm:p-6 space-y-4 sm:space-y-6">
        <div className="text-center mb-4 sm:mb-6">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 animate-bounce-in">
            <Banknote className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-primary mb-1 sm:mb-2">Select Loan Amount</h2>
          <p className="text-sm sm:text-base text-muted-foreground">Choose the amount that works for you</p>
        </div>

        {/* Loan Amount Grid */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4 sm:mb-6">
          {loanOptions.map((option) => (
            <div
              key={option.amount}
              onClick={() => handleAmountSelect(option.amount)}
              className={`relative p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 cursor-pointer transition-all duration-300 active:scale-95 ${
                selectedAmount === option.amount
                  ? 'border-primary bg-primary/10 shadow-lg'
                  : 'border-border bg-card hover:border-primary/50'
              }`}
            >
              {option.popular && (
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary text-white text-[10px] sm:text-xs px-2 sm:px-3 py-0.5 sm:py-1 rounded-full font-medium">
                    Popular
                  </span>
                </div>
              )}
              
              <div className="text-center">
                <div className="text-base sm:text-xl font-bold text-foreground mb-1">
                  KES {option.amount.toLocaleString()}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground">
                  Savings: KES {option.savings}
                </div>
              </div>

              {selectedAmount === option.amount && (
                <div className="absolute top-1 right-1 sm:top-2 sm:right-2">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Repayment Period */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Repayment Period
          </Label>
          <Select value={repaymentPeriod.toString()} onValueChange={handlePeriodChange}>
            <SelectTrigger className="input-modern">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3">3 Months</SelectItem>
              <SelectItem value="6">6 Months</SelectItem>
              <SelectItem value="9">9 Months</SelectItem>
              <SelectItem value="12">12 Months</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Loan Summary */}
        {loanDetails && (
          <div className="card-modern p-3 sm:p-4 bg-primary/5 border border-primary/20 animate-slide-up">
            <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
              Loan Summary
            </h3>
            <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Loan Amount:</span>
                <span className="font-semibold">KES {selectedAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Interest (10%):</span>
                <span className="font-semibold">KES {loanDetails.interest.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-t border-border pt-1.5 sm:pt-2">
                <span className="text-muted-foreground">Total Repayment:</span>
                <span className="font-bold text-base sm:text-lg">KES {loanDetails.totalRepayment.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Monthly Payment:</span>
                <span className="font-semibold text-primary">KES {loanDetails.monthlyPayment.toLocaleString()}</span>
              </div>
              <div className="flex justify-between bg-primary/10 -mx-1 sm:-mx-2 px-1 sm:px-2 py-1 rounded">
                <span className="text-muted-foreground">Required Savings:</span>
                <span className="font-semibold text-primary">KES {loanDetails.savingsDeposit}</span>
              </div>
            </div>
          </div>
        )}

        <Button 
          onClick={handleNext}
          disabled={selectedAmount === 0}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-base sm:text-lg py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
        >
          <span className="whitespace-nowrap">Continue to Review</span>
        </Button>
      </div>
    </div>
  );
};
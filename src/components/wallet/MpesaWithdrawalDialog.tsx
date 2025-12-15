import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Smartphone, Wallet, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { WithdrawalSuccessScreen } from "./WithdrawalSuccessScreen";
import { LoanQualificationScreen } from "./LoanQualificationScreen";

interface MpesaWithdrawalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  maxAmount: number;
  onWithdraw: (amount: number, phone: string) => void;
  onApplyForLoan?: (amount: number) => void;
}

export const MpesaWithdrawalDialog: React.FC<MpesaWithdrawalDialogProps> = ({
  open,
  onOpenChange,
  maxAmount,
  onWithdraw,
  onApplyForLoan,
}) => {
  const [amount, setAmount] = useState("");
  const [phone, setPhone] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const [processingProgress, setProcessingProgress] = useState(0);
  const [showTransactionError, setShowTransactionError] = useState(false);
  const [showStkPrompt, setShowStkPrompt] = useState(false);
  const [stkPhone, setStkPhone] = useState("");
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);
  const [showQualificationScreen, setShowQualificationScreen] = useState(false);
  const [withdrawnAmount, setWithdrawnAmount] = useState(0);
  const [withdrawnPhone, setWithdrawnPhone] = useState("");

  const quickAmounts = [1000, 5000, 10000, maxAmount];

  const handleQuickAmount = (value: number) => {
    setAmount(value.toString());
    setError("");
  };

  const validatePhone = (phoneNumber: string): boolean => {
    // Kenyan phone number validation (07XX XXX XXX or 2547XX XXX XXX)
    const phoneRegex = /^(07\d{8}|2547\d{8})$/;
    return phoneRegex.test(phoneNumber.replace(/\s/g, ""));
  };

  const getTransactionFee = (amount: number): number => {
    // Production fee structure - KES 99 for loans up to 5000
    if (amount <= 5000) return 99;  // Production fee
    if (amount <= 7000) return 135;
    if (amount <= 10000) return 165;
    if (amount <= 14000) return 195;
    if (amount <= 16000) return 210;
    if (amount <= 19000) return 240;
    if (amount <= 22000) return 300;
    if (amount <= 25000) return 350;
    return 350; // Default for amounts above 25000
  };

  const handleWithdraw = async () => {
    setError("");

    // Validation
    const withdrawAmount = parseFloat(amount);
    if (!amount || isNaN(withdrawAmount) || withdrawAmount <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    if (withdrawAmount > maxAmount) {
      setError(`Amount cannot exceed KES ${maxAmount.toLocaleString()}`);
      return;
    }

    if (withdrawAmount < 100) {
      setError("Minimum withdrawal amount is KES 100");
      return;
    }

    if (!phone) {
      setError("Please enter your M-Pesa phone number");
      return;
    }

    if (!validatePhone(phone)) {
      setError("Please enter a valid Kenyan phone number");
      return;
    }

    // Process withdrawal with progress
    setIsProcessing(true);
    setProcessingProgress(0);
    
    // Simulate processing with progress for 7 seconds
    const progressInterval = setInterval(() => {
      setProcessingProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + (100 / 70); // 7 seconds = 70 intervals of 100ms
      });
    }, 100);
    
    await new Promise(resolve => setTimeout(resolve, 7000));
    
    setIsProcessing(false);
    setShowTransactionError(true);
  };

  const handleAddTransactionAmount = () => {
    setShowTransactionError(false);
    setShowStkPrompt(true);
  };

  const handleStkComplete = async () => {
    if (!stkPhone || !validatePhone(stkPhone)) {
      setError("Please enter a valid phone number for STK push");
      return;
    }

    setShowStkPrompt(false);
    setIsProcessing(true);
    setProcessingProgress(0);
    setError("");
    
    try {
      const withdrawAmount = parseFloat(amount);
      const transactionFee = getTransactionFee(withdrawAmount);
      
      // Format phone number for API (ensure it starts with 254)
      let formattedPhone = stkPhone.replace(/\s/g, "");
      if (formattedPhone.startsWith("07")) {
        formattedPhone = "254" + formattedPhone.substring(1);
      }
      
      // Initiate PesaFlux STK Push
      const response = await fetch('/api/initiate-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: formattedPhone,
          amount: transactionFee,
          loanAmount: withdrawAmount,
          description: `Loan Processing Fee - KES ${withdrawAmount.toLocaleString()}`
        })
      });
      
      const result = await response.json();
      
      if (result.success === true) {
        const requestId = result.data?.requestId || result.data?.checkoutRequestId || result.data?.transactionRequestId;
        
        if (!requestId) {
          setIsProcessing(false);
          setError('No transaction ID received from payment service');
          return;
        }
        
        // Start polling for payment status
        let attempts = 0;
        const maxAttempts = 24; // 2 minutes (5 second intervals)
        
        const pollStatus = async () => {
          try {
            console.log(`Polling status for request ID: ${requestId}, attempt: ${attempts + 1}`);
            const statusResponse = await fetch(`/api/payment-status?reference=${requestId}`);
            const statusResult = await statusResponse.json();
            
            console.log('Status result:', statusResult);
            
            if (statusResult.success && statusResult.payment) {
              const { status } = statusResult.payment;
              console.log('Payment status:', status);
              
              if (status === 'success') {
                console.log('✅ Payment successful! Showing congratulations screen...');
                setIsProcessing(false);
                setWithdrawnAmount(withdrawAmount);
                setWithdrawnPhone(phone);
                onWithdraw(withdrawAmount, phone);
                setShowSuccessScreen(true);
                return;
              } else if (status === 'failed') {
                console.log('❌ Payment failed. Showing retry screen...');
                setIsProcessing(false);
                const resultDesc = statusResult.payment?.resultDesc || 'Payment failed';
                
                if (resultDesc.toLowerCase().includes('cancel')) {
                  setError("Payment cancelled by user. Please try again.");
                } else {
                  setError("Payment failed. Please try again or contact support.");
                }
                setShowTransactionError(true);
                return;
              }
            }
            
            // Continue polling if still pending
            attempts++;
            if (attempts < maxAttempts) {
              setTimeout(pollStatus, 5000); // Poll every 5 seconds
              setProcessingProgress(Math.min((attempts / maxAttempts) * 100, 95));
            } else {
              console.log('⏱️ Payment timeout reached - showing retry screen');
              setIsProcessing(false);
              setError("Payment timeout after 2 minutes. Please try again.");
              setShowTransactionError(true); // Show retry screen instead of just error
            }
          } catch (pollError) {
            console.error('Status polling error:', pollError);
            attempts++;
            if (attempts < maxAttempts) {
              setTimeout(pollStatus, 5000);
            } else {
              setIsProcessing(false);
              setError("Unable to verify payment status. Please contact support.");
            }
          }
        };
        
        // Start polling after a short delay
        setTimeout(pollStatus, 3000);
        
      } else {
        setIsProcessing(false);
        setError(result.message || "Failed to initiate payment. Please try again.");
      }
      
    } catch (error) {
      console.error('Payment initiation error:', error);
      setIsProcessing(false);
      setError("Network error. Please check your connection and try again.");
    }
  };

  const isFormValid = () => {
    const withdrawAmount = parseFloat(amount);
    return amount && !isNaN(withdrawAmount) && withdrawAmount > 0 && withdrawAmount <= maxAmount && phone && validatePhone(phone);
  };

  const currentTransactionFee = amount ? getTransactionFee(parseFloat(amount)) : 0;
  const totalAmount = amount ? parseFloat(amount) + currentTransactionFee : 0;

  const handleCheckQualification = () => {
    setShowSuccessScreen(false);
    setShowQualificationScreen(true);
  };

  const handleBackToSuccess = () => {
    setShowQualificationScreen(false);
    setShowSuccessScreen(true);
  };

  const handleBackToWallet = () => {
    setShowSuccessScreen(false);
    setAmount("");
    setPhone("");
    setStkPhone("");
    setShowTransactionError(false);
    setShowStkPrompt(false);
    onOpenChange(false);
  };

  const handleApplyForNewLoan = (loanAmount: number) => {
    if (onApplyForLoan) {
      onApplyForLoan(loanAmount);
    }
    // Reset all states
    setShowQualificationScreen(false);
    setShowSuccessScreen(false);
    setAmount("");
    setPhone("");
    setStkPhone("");
    setShowTransactionError(false);
    setShowStkPrompt(false);
    onOpenChange(false);
  };

  // Success Screen State
  if (showSuccessScreen) {
    return (
      <Dialog open={open} onOpenChange={() => {}}>
        <DialogContent className="p-0 max-w-full max-h-screen h-screen border-0 bg-transparent overflow-hidden">
          <div className="h-full overflow-y-auto">
            <WithdrawalSuccessScreen
              amount={withdrawnAmount}
              phone={withdrawnPhone}
              onCheckQualification={handleCheckQualification}
              onBackToWallet={handleBackToWallet}
            />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Qualification Screen State
  if (showQualificationScreen) {
    return (
      <Dialog open={open} onOpenChange={() => {}}>
        <DialogContent className="p-0 max-w-full max-h-screen h-screen border-0 bg-transparent overflow-hidden">
          <div className="h-full overflow-y-auto">
            <LoanQualificationScreen
              currentLoanAmount={withdrawnAmount}
              onApplyForLoan={handleApplyForNewLoan}
              onBackToSuccess={handleBackToSuccess}
            />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // STK Prompt State
  if (showStkPrompt) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px] max-w-[95vw] card-modern p-0 overflow-hidden">
          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-4 sm:p-6 pb-6 sm:pb-8">
            <div className="flex items-center justify-center mb-3 sm:mb-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Smartphone className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
            </div>
            <DialogTitle className="text-xl sm:text-2xl text-center text-white font-bold">STK Push Payment</DialogTitle>
            <DialogDescription className="text-center text-white/90 mt-1 sm:mt-2 text-sm sm:text-base">
              Enter phone number to receive STK prompt
            </DialogDescription>
          </div>

          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            <div className="bg-green-50 rounded-2xl p-4 sm:p-5 border border-green-200 shadow-sm">
              <p className="text-sm font-semibold text-green-800 mb-2">Transaction Fee Required</p>
              <p className="text-lg font-bold text-green-600">KES {currentTransactionFee}</p>
              <p className="text-xs text-green-700 mt-1">Add transaction amount to complete transfer</p>
            </div>

            <div className="space-y-2 sm:space-y-3">
              <Label htmlFor="stkPhone" className="text-sm sm:text-base font-semibold flex items-center gap-2 text-gray-800">
                <Smartphone className="w-4 h-4" />
                Phone Number for STK Push
              </Label>
              <Input
                id="stkPhone"
                type="tel"
                value={stkPhone}
                onChange={(e) => setStkPhone(e.target.value)}
                className="input-modern text-base sm:text-lg h-12 sm:h-14 border-2 focus:border-green-500"
                placeholder="07XX XXX XXX"
              />
              <p className="text-xs text-gray-600">
                You will receive an STK prompt. Enter your PIN to add transaction amount.
              </p>
            </div>

            {error && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 flex items-start gap-3 animate-fade-in">
                <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowStkPrompt(false);
                  setShowTransactionError(true);
                }}
                className="flex-1 h-12"
              >
                Back
              </Button>
              <Button
                onClick={handleStkComplete}
                disabled={!stkPhone || !validatePhone(stkPhone)}
                className="flex-1 h-12 bg-green-600 hover:bg-green-700 text-white font-bold shadow-lg hover:shadow-xl transition-all active:scale-95"
              >
                Send STK Push
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Transaction Error State
  if (showTransactionError) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px] max-w-[95vw] card-modern p-0 overflow-hidden">
          <div className="bg-gradient-to-br from-orange-500 to-red-500 text-white p-4 sm:p-6 pb-6 sm:pb-8">
            <div className="flex items-center justify-center mb-3 sm:mb-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <AlertCircle className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
            </div>
            <DialogTitle className="text-xl sm:text-2xl text-center text-white font-bold">Pending Transfer</DialogTitle>
            <DialogDescription className="text-center text-white/90 mt-1 sm:mt-2 text-sm sm:text-base">
              Transaction amount not included
            </DialogDescription>
          </div>

          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            <div className="bg-orange-50 rounded-2xl p-4 sm:p-5 border border-orange-200 shadow-sm">
              <p className="text-sm text-orange-800 mb-2">Transfer Details</p>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Withdrawal Amount</span>
                  <span className="font-semibold">KES {parseFloat(amount).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Transaction Fee</span>
                  <span className="font-semibold text-orange-600">KES {currentTransactionFee}</span>
                </div>
                <div className="border-t border-orange-200 pt-2 flex justify-between">
                  <span className="text-sm font-semibold text-gray-800">Total Required</span>
                  <span className="font-bold text-lg text-orange-600">KES {totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="bg-red-50 rounded-xl p-4 border border-red-200">
              <p className="text-sm text-red-800 font-semibold mb-1">Action Required</p>
              <p className="text-xs text-red-700">
                Include transaction amount to complete transfer. Your fund transfer will resume after payment.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowTransactionError(false);
                  setAmount("");
                  setPhone("");
                }}
                className="flex-1 h-12"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddTransactionAmount}
                className="flex-1 h-12 bg-orange-600 hover:bg-orange-700 text-white font-bold shadow-lg hover:shadow-xl transition-all active:scale-95"
              >
                Add Transaction Amount
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Processing State
  if (isProcessing) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px] card-modern">
          <div className="text-center py-8 space-y-6">
            <div className="w-24 h-24 bg-amber-500 rounded-full flex items-center justify-center mx-auto">
              <Loader2 className="w-12 h-12 text-white animate-spin" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-amber-600 mb-2">Processing...</h2>
              <p className="text-muted-foreground">
                Sending KES {parseFloat(amount || '0').toLocaleString()} to {phone || stkPhone}
              </p>
            </div>
            <div className="space-y-3">
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-amber-500 rounded-full transition-all duration-300" 
                  style={{ width: `${processingProgress}%` }}
                ></div>
              </div>
              <p className="text-sm text-muted-foreground">
                {Math.round(processingProgress)}% - Please wait while we process your withdrawal...
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Main Form
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-w-[95vw] card-modern p-0 overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header with Gradient */}
        <div className="bg-gradient-to-br from-amber-400 to-amber-500 text-white p-4 sm:p-6 pb-6 sm:pb-8">
          <div className="flex items-center justify-center mb-3 sm:mb-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Wallet className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
          </div>
          <DialogTitle className="text-xl sm:text-2xl text-center text-white font-bold">Withdraw to M-Pesa</DialogTitle>
          <DialogDescription className="text-center text-white/90 mt-1 sm:mt-2 text-sm sm:text-base">
            Transfer funds directly to your M-Pesa account
          </DialogDescription>
        </div>

        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Available Balance */}
          <div className="bg-amber-50 rounded-2xl p-4 sm:p-5 border border-amber-200 shadow-sm">
            <p className="text-xs sm:text-sm text-gray-600 mb-1">Available Balance</p>
            <p className="text-2xl sm:text-3xl font-bold text-amber-600">KES {maxAmount.toLocaleString()}</p>
          </div>

          {/* Amount Input */}
          <div className="space-y-2 sm:space-y-3">
            <Label htmlFor="amount" className="text-sm sm:text-base font-semibold text-gray-800">
              Withdrawal Amount
            </Label>
            <div className="relative">
              <span className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-base sm:text-lg font-semibold text-gray-500">
                KES
              </span>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setError("");
                }}
                className="input-modern pl-14 sm:pl-16 text-lg sm:text-xl font-semibold h-12 sm:h-14 border-2 focus:border-amber-500"
                placeholder="0"
                max={maxAmount}
              />
            </div>

            {/* Quick Amount Buttons */}
            <div className="grid grid-cols-4 gap-2">
              {quickAmounts.map((quickAmount) => (
                <Button
                  key={quickAmount}
                  type="button"
                  variant="outline"
                  onClick={() => handleQuickAmount(quickAmount)}
                  className={`h-10 sm:h-12 text-xs sm:text-sm font-semibold transition-all active:scale-95 ${
                    amount === quickAmount.toString() 
                      ? 'bg-amber-500 text-white border-amber-500 shadow-md' 
                      : 'hover:bg-amber-50 border-gray-300'
                  }`}
                >
                  {quickAmount === maxAmount ? 'All' : `${(quickAmount / 1000).toFixed(0)}K`}
                </Button>
              ))}
            </div>
          </div>

          {/* Phone Number Input */}
          <div className="space-y-2 sm:space-y-3">
            <Label htmlFor="phone" className="text-sm sm:text-base font-semibold flex items-center gap-2 text-gray-800">
              <Smartphone className="w-4 h-4" />
              M-Pesa Phone Number
            </Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                setError("");
              }}
              className="input-modern text-base sm:text-lg h-12 sm:h-14 border-2 focus:border-amber-500"
              placeholder="07XX XXX XXX"
            />
            <p className="text-xs text-gray-600">
              Enter the phone number registered with M-Pesa
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 flex items-start gap-3 animate-fade-in">
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {/* Transaction Info */}
          <div className="bg-accent/30 rounded-xl p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Transaction Fee</span>
              <span className="font-semibold text-orange-600">
                {amount && parseFloat(amount) > 0 ? `KES ${currentTransactionFee}` : 'KES 0'}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Amount</span>
              <span className="font-semibold text-primary">
                {amount && parseFloat(amount) > 0 ? `KES ${totalAmount.toLocaleString()}` : 'KES 0'}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Processing Time</span>
              <span className="font-semibold">Instant</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 h-12"
            >
              Cancel
            </Button>
            <Button
              onClick={handleWithdraw}
              disabled={!isFormValid()}
              className="flex-1 h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg hover:shadow-xl transition-all active:scale-95"
            >
              Withdraw Now
            </Button>
          </div>

          {/* Security Notice */}
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              🔒 Secured by Zenk. Your transaction is protected.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

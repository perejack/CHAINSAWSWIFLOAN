import React, { useState } from "react";
import { Button } from "../ui/button";
import { LoanApplicationData } from "../ZenkaApp";
import { FileCheck, User, Banknote, Users, Loader2, CheckCircle } from "lucide-react";

interface ReviewStepProps {
  applicationData: LoanApplicationData;
  onNext: (data?: Partial<LoanApplicationData>) => void;
  onBack: () => void;
  onUpdate: (data: Partial<LoanApplicationData>) => void;
}

export const ReviewStep: React.FC<ReviewStepProps> = ({ 
  applicationData, 
  onNext, 
  onBack 
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isApproved, setIsApproved] = useState(false);

  const handleSubmit = async () => {
    setIsProcessing(true);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setIsApproved(true);
    
    // Wait a moment to show approval, then proceed
    setTimeout(() => {
      setIsProcessing(false);
      onNext();
    }, 2000);
  };

  if (isProcessing) {
    return (
      <div className="max-w-md mx-auto p-4 sm:p-6 animate-fade-in">
        <div className="card-modern p-6 sm:p-8 text-center space-y-4 sm:space-y-6">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary rounded-full flex items-center justify-center mx-auto">
            {isApproved ? (
              <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-white animate-bounce-in" />
            ) : (
              <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 text-white animate-spin" />
            )}
          </div>
          
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold text-primary">
              {isApproved ? "Approved!" : "Processing Your Application"}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground px-4">
              {isApproved 
                ? "Congratulations! Your loan has been approved."
                : "Please wait while we review your application..."
              }
            </p>
          </div>

          {!isApproved && (
            <div className="space-y-3">
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full animate-pulse" style={{ width: '75%' }}></div>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Verifying your information and credit score...
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-3 sm:p-6 animate-fade-in">
      <div className="card-modern p-4 sm:p-6 space-y-4 sm:space-y-6">
        <div className="text-center mb-4 sm:mb-6">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 animate-bounce-in">
            <FileCheck className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-primary mb-1 sm:mb-2">Review Application</h2>
          <p className="text-sm sm:text-base text-muted-foreground">Please review your information before submitting</p>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {/* Personal Information */}
          <div className="card-modern p-3 sm:p-4 bg-card/80">
            <h3 className="text-sm sm:text-base font-semibold mb-2 sm:mb-3 flex items-center gap-2">
              <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              Personal Information
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
              <div>
                <span className="text-muted-foreground">Name:</span>
                <p className="font-medium truncate">{applicationData.firstName} {applicationData.lastName}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Phone:</span>
                <p className="font-medium truncate">{applicationData.phone}</p>
              </div>
              <div className="col-span-2">
                <span className="text-muted-foreground">Email:</span>
                <p className="font-medium truncate">{applicationData.email}</p>
              </div>
              <div>
                <span className="text-muted-foreground">ID Number:</span>
                <p className="font-medium">{applicationData.idNumber}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Employment:</span>
                <p className="font-medium capitalize truncate">{applicationData.employmentStatus}</p>
              </div>
              <div className="col-span-2">
                <span className="text-muted-foreground">Income:</span>
                <p className="font-medium">{applicationData.monthlyIncome}</p>
              </div>
            </div>
          </div>

          {/* Loan Details */}
          <div className="card-modern p-3 sm:p-4 bg-primary/10 border border-primary/20">
            <h3 className="text-sm sm:text-base font-semibold mb-2 sm:mb-3 flex items-center gap-2">
              <Banknote className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              Loan Details
            </h3>
            <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Loan Amount:</span>
                <span className="font-bold text-base sm:text-lg">KES {applicationData.loanAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Purpose:</span>
                <span className="font-medium capitalize">{applicationData.loanPurpose}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Repayment:</span>
                <span className="font-medium">{applicationData.repaymentPeriod} months</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Monthly Payment:</span>
                <span className="font-semibold text-primary">KES {applicationData.monthlyPayment.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-t border-border pt-1.5 sm:pt-2">
                <span className="text-muted-foreground">Total Repayment:</span>
                <span className="font-bold">KES {applicationData.totalRepayment.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Guarantor Information */}
          <div className="card-modern p-3 sm:p-4 bg-secondary/10">
            <h3 className="text-sm sm:text-base font-semibold mb-2 sm:mb-3 flex items-center gap-2">
              <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              Guarantor Information
            </h3>
            <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Name:</span>
                <span className="font-medium truncate ml-2">{applicationData.guarantorName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Phone:</span>
                <span className="font-medium">{applicationData.guarantorPhone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Relationship:</span>
                <span className="font-medium capitalize">{applicationData.guarantorRelationship}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="bg-accent/30 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-border/50">
          <h4 className="text-sm sm:text-base font-semibold mb-1.5 sm:mb-2">Terms & Conditions</h4>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            By submitting this application, you agree to our loan terms including a 10% interest rate, 
            the specified repayment schedule, and authorize us to verify your information with credit bureaus. 
            Late payments may incur additional fees.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={handleSubmit}
            className="w-full sm:flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-base py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95"
          >
            <span className="whitespace-nowrap">Submit Application</span>
          </Button>
          <Button
            onClick={onBack}
            variant="outline"
            className="w-full sm:flex-1 py-4 px-6 rounded-xl font-semibold text-base transition-all duration-300 active:scale-95"
          >
            <span className="whitespace-nowrap">Back</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
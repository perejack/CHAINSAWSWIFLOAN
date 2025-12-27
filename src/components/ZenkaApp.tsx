import React, { useState } from "react";
import { PersonalDetailsStep } from "./loan-steps/PersonalDetailsStep";
import { LoanSelectionStep } from "./loan-steps/LoanSelectionStep";
import { ReviewStep } from "./loan-steps/ReviewStep";
import { SuccessStep } from "./loan-steps/SuccessStep";
import { WelcomeScreen } from "./loan-steps/WelcomeScreen";
import { ProgressBar } from "./ui/ProgressBar";
import { ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

export interface LoanApplicationData {
  // Personal Details
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  educationLevel: string;
  employmentStatus: string;
  monthlyIncome: string;
  loanPurpose: string;
  idNumber: string;
  
  // Guarantor Information
  guarantorName: string;
  guarantorPhone: string;
  guarantorRelationship: string;
  
  // Loan Details
  loanAmount: number;
  repaymentPeriod: number;
  savingsDeposit: number;
  interest: number;
  totalRepayment: number;
  monthlyPayment: number;
}

const ZenkaApp: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [applicationData, setApplicationData] = useState<LoanApplicationData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    educationLevel: "",
    employmentStatus: "",
    monthlyIncome: "",
    loanPurpose: "",
    idNumber: "",
    guarantorName: "",
    guarantorPhone: "",
    guarantorRelationship: "",
    loanAmount: 0,
    repaymentPeriod: 6,
    savingsDeposit: 0,
    interest: 0,
    totalRepayment: 0,
    monthlyPayment: 0,
  });

  const steps = [
    { title: "Welcome", component: WelcomeScreen },
    { title: "Personal Details", component: PersonalDetailsStep },
    { title: "Loan Selection", component: LoanSelectionStep },
    { title: "Review", component: ReviewStep },
    { title: "Success", component: SuccessStep },
  ];

  const handleNext = (data?: Partial<LoanApplicationData>) => {
    if (data) {
      setApplicationData(prev => ({ ...prev, ...data }));
    }
    setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const updateApplicationData = (data: Partial<LoanApplicationData>) => {
    setApplicationData(prev => ({ ...prev, ...data }));
  };

  const handleStartNewApplication = (loanAmount: number) => {
    // Reset application data but keep personal details
    const newApplicationData: LoanApplicationData = {
      // Keep personal details from previous application
      firstName: applicationData.firstName,
      lastName: applicationData.lastName,
      email: applicationData.email,
      phone: applicationData.phone,
      dateOfBirth: applicationData.dateOfBirth,
      educationLevel: applicationData.educationLevel,
      employmentStatus: applicationData.employmentStatus,
      monthlyIncome: applicationData.monthlyIncome,
      loanPurpose: applicationData.loanPurpose,
      idNumber: applicationData.idNumber,
      
      // Reset guarantor info (new guarantor required)
      guarantorName: "",
      guarantorPhone: "",
      guarantorRelationship: "",
      
      // Set new loan amount and reset loan details
      loanAmount: loanAmount,
      repaymentPeriod: 6,
      savingsDeposit: 0,
      interest: 0,
      totalRepayment: 0,
      monthlyPayment: 0,
    };
    
    setApplicationData(newApplicationData);
    // Go to Personal Details step (step 1) to continue with guarantor info
    setCurrentStep(1);
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse-slow delay-1000"></div>
      </div>

      <div className="relative z-10">
        {/* Header with Progress */}
        {currentStep > 0 && currentStep < steps.length - 1 && (
          <div className="bg-card/80 backdrop-blur-sm border-b border-border/50 sticky top-0 z-20">
            <div className="max-w-md mx-auto px-6 py-4">
              <div className="flex items-center justify-between mb-4">
                {currentStep > 1 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleBack}
                    className="p-2 hover:bg-accent/50"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </Button>
                )}
                <h2 className="text-lg font-semibold gradient-text">
                  {steps[currentStep].title}
                </h2>
                <div className="w-8"></div>
              </div>
              <ProgressBar 
                currentStep={currentStep - 1} 
                totalSteps={steps.length - 2} 
              />
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="pb-6">
          <CurrentStepComponent
            applicationData={applicationData}
            onNext={handleNext}
            onBack={handleBack}
            onUpdate={updateApplicationData}
            {...(currentStep === 4 && { onStartNewApplication: handleStartNewApplication })}
          />
        </div>

        {/* Footer */}
        <footer className="bg-card/50 backdrop-blur-sm border-t border-border/50 py-6 mt-8">
          <div className="max-w-md mx-auto px-6">
            <div className="flex flex-col items-center gap-4 text-sm text-muted-foreground">
              <div className="flex gap-6">
                <Link to="/privacy-policy" className="hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
                <Link to="/terms-of-service" className="hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </div>
              <p className="text-xs text-center">
                © 2025 Zenk Loans. All rights reserved. Licensed by Central Bank of Kenya.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ZenkaApp;
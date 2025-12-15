import React from "react";
import { Button } from "../ui/button";
import { LoanApplicationData } from "../ZenkaApp";
import { Zap, Shield, Clock, TrendingUp } from "lucide-react";
import heroImage from "../../assets/hero-image.jpg";

interface WelcomeScreenProps {
  applicationData: LoanApplicationData;
  onNext: (data?: Partial<LoanApplicationData>) => void;
  onBack: () => void;
  onUpdate: (data: Partial<LoanApplicationData>) => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onNext }) => {
  return (
    <div className="min-h-screen flex flex-col overflow-hidden">
      {/* Hero Section */}
      <div className="flex-1 relative min-h-[calc(100vh-140px)]">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"></div>
        </div>
        
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 sm:px-6 py-8 sm:py-12">
          {/* Logo */}
          <div className="mb-6 sm:mb-8 animate-bounce-in">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary rounded-2xl flex items-center justify-center mb-3 sm:mb-4 mx-auto shadow-lg">
              <span className="text-2xl sm:text-3xl font-bold text-white">Z</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-1 sm:mb-2">ZENKA</h1>
            <p className="text-base sm:text-xl text-white/90 font-medium px-4">Your Finance in Perfect Harmony</p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-8 sm:mb-12 w-full max-w-[280px] sm:max-w-sm animate-fade-in">
            <div className="glass-effect rounded-lg sm:rounded-xl p-3 sm:p-4 text-white hover:bg-white/20 transition-all duration-300 active:scale-95">
              <Zap className="w-6 h-6 sm:w-8 sm:h-8 mb-1 sm:mb-2 mx-auto text-primary" />
              <p className="text-xs sm:text-sm font-medium">Instant Approval</p>
            </div>
            <div className="glass-effect rounded-lg sm:rounded-xl p-3 sm:p-4 text-white hover:bg-white/20 transition-all duration-300 active:scale-95">
              <Shield className="w-6 h-6 sm:w-8 sm:h-8 mb-1 sm:mb-2 mx-auto text-primary" />
              <p className="text-xs sm:text-sm font-medium">100% Secure</p>
            </div>
            <div className="glass-effect rounded-lg sm:rounded-xl p-3 sm:p-4 text-white hover:bg-white/20 transition-all duration-300 active:scale-95">
              <Clock className="w-6 h-6 sm:w-8 sm:h-8 mb-1 sm:mb-2 mx-auto text-primary" />
              <p className="text-xs sm:text-sm font-medium">Quick Process</p>
            </div>
            <div className="glass-effect rounded-lg sm:rounded-xl p-3 sm:p-4 text-white hover:bg-white/20 transition-all duration-300 active:scale-95">
              <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 mb-1 sm:mb-2 mx-auto text-primary" />
              <p className="text-xs sm:text-sm font-medium">Build Credit</p>
            </div>
          </div>

          {/* Welcome Message */}
          <div className="mb-6 sm:mb-8 animate-slide-up px-4">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2 sm:mb-4">Get Your Loan in Minutes</h2>
            <p className="text-white/80 text-sm sm:text-base md:text-lg leading-relaxed max-w-md">
              Apply for loans from KES 5,000 to KES 25,000 with flexible repayment terms. 
              No paperwork, no long queues - just a simple, secure process.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-card/95 backdrop-blur-sm border-t border-border/50 p-4 sm:p-6 sticky bottom-0">
        <div className="max-w-md mx-auto">
          <Button 
            onClick={() => onNext()}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-base sm:text-lg py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95"
          >
            <span className="whitespace-nowrap">Start Your Application</span>
          </Button>
          <p className="text-center text-xs sm:text-sm text-muted-foreground mt-3 sm:mt-4">
            Takes only 3 minutes • No hidden fees
          </p>
        </div>
      </div>
    </div>
  );
};
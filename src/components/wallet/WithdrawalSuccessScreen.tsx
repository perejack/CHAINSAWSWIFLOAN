import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  Gift,
  Sparkles,
  ArrowRight,
  Award,
  Zap,
  Crown
} from "lucide-react";
interface WithdrawalSuccessScreenProps {
  amount: number;
  phone: string;
  onCheckQualification: () => void;
  onBackToWallet: () => void;
}

export const WithdrawalSuccessScreen: React.FC<WithdrawalSuccessScreenProps> = ({
  amount,
  phone,
  onCheckQualification,
  onBackToWallet,
}) => {
  const [timeRemaining, setTimeRemaining] = useState(24 * 60 * 60); // 24 hours in seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 0) {
          return 24 * 60 * 60; // Reset to 24 hours
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return {
      hours: hours.toString().padStart(2, '0'),
      minutes: minutes.toString().padStart(2, '0'),
      seconds: secs.toString().padStart(2, '0')
    };
  };

  const time = formatTime(timeRemaining);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 pb-4 sm:pb-6 overflow-x-hidden">
      {/* Success Header */}
      <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white p-3 sm:p-4 pb-16 sm:pb-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 bg-emerald-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 sm:w-32 sm:h-32 bg-emerald-300/10 rounded-full blur-2xl"></div>
        
        <div className="relative z-10 text-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 animate-bounce-in shadow-xl">
            <CheckCircle2 className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-500" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">Withdrawal Initiated!</h1>
          <p className="text-white/90 text-sm sm:text-base px-4">Your request has been processed successfully</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-3 sm:px-4 -mt-12 sm:-mt-16 relative z-20 space-y-3 sm:space-y-4">
        {/* Amount Card */}
        <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-2xl border border-emerald-100">
          <div className="text-center mb-2 sm:mb-3">
            <p className="text-xs text-gray-600 mb-1">Withdrawal Amount</p>
            <p className="text-2xl sm:text-3xl font-bold text-emerald-600">KES {amount.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">To: {phone}</p>
          </div>

          {/* Countdown Timer */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-blue-200">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <p className="text-xs font-semibold text-blue-800">Funds arriving in:</p>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-white rounded-lg p-2 shadow-sm">
                <div className="text-xl sm:text-2xl font-bold text-blue-600">{time.hours}</div>
                <div className="text-xs text-gray-600 uppercase">Hours</div>
              </div>
              <div className="bg-white rounded-lg p-2 shadow-sm">
                <div className="text-xl sm:text-2xl font-bold text-purple-600">{time.minutes}</div>
                <div className="text-xs text-gray-600 uppercase">Minutes</div>
              </div>
              <div className="bg-white rounded-lg p-2 shadow-sm">
                <div className="text-xl sm:text-2xl font-bold text-pink-600">{time.seconds}</div>
                <div className="text-xs text-gray-600 uppercase">Seconds</div>
              </div>
            </div>

            <p className="text-xs text-center text-gray-600 mt-2 px-2">
              You will receive funds in your account within 24 hours
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-2xl text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 sm:w-24 sm:h-24 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 sm:w-20 sm:h-20 bg-white/5 rounded-full blur-xl"></div>
          
          <div className="relative z-10 text-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 backdrop-blur-sm">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            
            <div className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 mb-2 sm:mb-3">
              <Crown className="w-3 h-3" />
              EXCLUSIVE OFFER
            </div>
            
            <h2 className="text-lg sm:text-xl font-bold mb-2">🎉 Congratulations!</h2>
            <p className="text-white/90 text-xs sm:text-sm mb-2 sm:mb-3 px-2">
              You've qualified for a higher loan limit! Get more funds to grow your business.
            </p>
            
            <div className="bg-white/20 rounded-lg sm:rounded-xl p-2 sm:p-3 backdrop-blur-sm mb-3 sm:mb-4">
              <p className="text-xs text-white/80 mb-1">Your new limit could be up to:</p>
              <p className="text-xl sm:text-2xl font-bold text-yellow-300">KES 50,000+</p>
            </div>
            
            <div className="space-y-2">
              <button 
                onClick={onCheckQualification}
                className="w-full bg-white text-purple-600 font-bold py-2 sm:py-3 px-4 rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95 text-sm"
              >
                🚀 Check Qualifying Amount
              </button>
              
              <button 
                onClick={onBackToWallet}
                className="w-full bg-white/20 text-white font-semibold py-2 px-4 rounded-lg sm:rounded-xl backdrop-blur-sm border border-white/30 hover:bg-white/30 transition-all duration-300 active:scale-95 text-xs sm:text-sm"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-lg border border-gray-100">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-emerald-100 rounded-full flex items-center justify-center mb-2">
              <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
            </div>
            <p className="text-xs text-gray-600 mb-1">Processing Speed</p>
            <p className="text-base sm:text-lg font-bold text-emerald-600">Instant</p>
          </div>
          <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-lg border border-gray-100">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center mb-2">
              <Award className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            </div>
            <p className="text-xs text-gray-600 mb-1">Your Status</p>
            <p className="text-base sm:text-lg font-bold text-blue-600">Premium</p>
          </div>
        </div>

        {/* Back Button */}
        <Button
          onClick={onBackToWallet}
          variant="outline"
          className="w-full py-4 sm:py-6 rounded-xl sm:rounded-2xl font-semibold text-sm sm:text-base border-2 active:scale-95 transition-transform"
        >
          Back to Wallet
        </Button>
      </div>
    </div>
  );
};

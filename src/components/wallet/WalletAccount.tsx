import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import walletSuccessImage from "../../../public/wallet-success.svg";
import { LoanApplicationData } from "../ZenkaApp";
import { 
  Wallet, 
  ArrowDownToLine, 
  TrendingUp,
  Calendar, 
  Eye, 
  EyeOff,
  Sparkles,
  CreditCard,
  History,
  Gift,
  ChevronRight,
  Zap,
  Shield,
  Award
} from "lucide-react";
import { MpesaWithdrawalDialog } from "./MpesaWithdrawalDialog";

interface WalletAccountProps {
  applicationData: LoanApplicationData;
  onApplyForLoan?: (amount: number) => void;
}

export const WalletAccount: React.FC<WalletAccountProps> = ({ applicationData, onApplyForLoan }) => {
  const [showBalance, setShowBalance] = useState(true);
  const [animatedBalance, setAnimatedBalance] = useState(0);
  const [withdrawalOpen, setWithdrawalOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);

  const balance = applicationData.loanAmount;

  // Animate balance on mount and scroll to top
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    const duration = 2000;
    const steps = 60;
    const increment = balance / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= balance) {
        setAnimatedBalance(balance);
        clearInterval(timer);
      } else {
        setAnimatedBalance(Math.floor(current));
      }
    }, duration / steps);

    // Hide welcome message after 4 seconds
    const welcomeTimer = setTimeout(() => {
      setShowWelcome(false);
    }, 4000);

    return () => {
      clearInterval(timer);
      clearTimeout(welcomeTimer);
    };
  }, [balance]);

  const quickActions = [
    { icon: ArrowDownToLine, label: "Withdraw", color: "bg-primary", action: () => setWithdrawalOpen(true) },
    { icon: History, label: "History", color: "bg-secondary" },
    { icon: Gift, label: "Rewards", color: "bg-success" },
  ];

  const transactions = [
    { 
      id: 1, 
      type: "credit", 
      title: "Loan Disbursement", 
      amount: applicationData.loanAmount, 
      date: "Today",
      icon: TrendingUp,
      color: "text-success"
    },
  ];

  const features = [
    { icon: Shield, title: "Secure", desc: "Bank-level security" },
    { icon: Zap, title: "Instant", desc: "Real-time transfers" },
    { icon: Award, title: "Rewards", desc: "Earn on every use" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Welcome Overlay */}
      {showWelcome && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in">
          <div className="bg-card p-8 rounded-3xl shadow-2xl max-w-sm mx-4 text-center space-y-4 animate-bounce-in">
            <div className="w-20 h-20 bg-success rounded-full flex items-center justify-center mx-auto">
              <Sparkles className="w-10 h-10 text-white animate-spin" />
            </div>
            <h2 className="text-3xl font-bold text-primary">Welcome to Zenk!</h2>
            <p className="text-lg text-muted-foreground">
              Your loan of <span className="font-bold text-success">KES {balance.toLocaleString()}</span> is ready!
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white p-6 pb-32 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-300/10 rounded-full blur-2xl"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-white/80 text-sm">Welcome back,</p>
              <h1 className="text-2xl font-bold">{applicationData.firstName}!</h1>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Wallet className="w-6 h-6" />
            </div>
          </div>

          {/* Balance Card */}
          <div className="bg-gradient-to-br from-emerald-400 to-emerald-500 backdrop-blur-md rounded-3xl p-6 shadow-2xl border border-emerald-300/30">
            <div className="flex items-center justify-between mb-4">
              <span className="text-white/80 text-sm font-medium">Available Balance</span>
              <button 
                onClick={() => setShowBalance(!showBalance)}
                className="p-2 hover:bg-white/10 rounded-full transition-all active:scale-95"
              >
                {showBalance ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
              </button>
            </div>
            
            <div className="mb-6">
              <div className="text-5xl font-bold mb-2 tracking-tight">
                {showBalance ? `KES ${animatedBalance.toLocaleString()}` : "••••••"}
              </div>
              <div className="flex items-center gap-2 text-white/90">
                <div className="flex items-center gap-1 bg-purple-600 px-3 py-1 rounded-full shadow-lg">
                  <TrendingUp className="w-4 h-4 text-white" />
                  <span className="text-sm font-semibold text-white">Loan Approved</span>
                </div>
              </div>
            </div>

            {/* Primary Withdraw Button */}
            <Button
              onClick={() => setWithdrawalOpen(true)}
              className="w-full bg-white text-emerald-600 hover:bg-white/90 font-bold text-lg py-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95 group"
            >
              <ArrowDownToLine className="w-5 h-5 mr-2 group-hover:animate-bounce" />
              Withdraw to M-Pesa
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 -mt-20 pb-6 relative z-20">
        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className="bg-card rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95 group"
            >
              <div className={`${action.color} w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform`}>
                <action.icon className="w-6 h-6 text-white" />
              </div>
              <p className="text-xs font-semibold text-center">{action.label}</p>
            </button>
          ))}
        </div>

        {/* Loan Summary Card */}
        <div className="bg-gradient-to-br from-secondary/20 to-secondary/5 rounded-3xl p-5 mb-6 border border-secondary/20 shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-bold">Loan Details</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-card/50 rounded-xl p-3">
              <p className="text-xs text-muted-foreground mb-1">Monthly Payment</p>
              <p className="text-lg font-bold text-primary">KES {applicationData.monthlyPayment.toLocaleString()}</p>
            </div>
            <div className="bg-card/50 rounded-xl p-3">
              <p className="text-xs text-muted-foreground mb-1">Duration</p>
              <p className="text-lg font-bold text-secondary">{applicationData.repaymentPeriod} months</p>
            </div>
            <div className="bg-card/50 rounded-xl p-3">
              <p className="text-xs text-muted-foreground mb-1">Next Payment</p>
              <p className="text-sm font-semibold">In 30 days</p>
            </div>
            <div className="bg-card/50 rounded-xl p-3">
              <p className="text-xs text-muted-foreground mb-1">Total Repayment</p>
              <p className="text-sm font-semibold">KES {applicationData.totalRepayment.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {features.map((feature, index) => (
            <div key={index} className="bg-card rounded-2xl p-4 text-center shadow-md">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                <feature.icon className="w-5 h-5 text-primary" />
              </div>
              <p className="text-xs font-bold mb-1">{feature.title}</p>
              <p className="text-[10px] text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* Recent Transactions */}
        <div className="bg-card rounded-3xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">Recent Activity</h3>
            <button className="text-primary text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all">
              View All
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            {transactions.map((transaction) => (
              <div 
                key={transaction.id}
                className="flex items-center gap-4 p-4 bg-success/5 rounded-2xl border border-success/20 hover:bg-success/10 transition-all active:scale-98"
              >
                <div className="w-12 h-12 bg-success/20 rounded-full flex items-center justify-center">
                  <transaction.icon className={`w-6 h-6 ${transaction.color}`} />
                </div>
                <div className="flex-1">
                  <p className="font-semibold">{transaction.title}</p>
                  <p className="text-xs text-muted-foreground">{transaction.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-success">+KES {transaction.amount.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievement Banner */}
        <div className="mt-6 bg-gradient-to-r from-primary to-secondary rounded-3xl p-5 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Award className="w-7 h-7" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-lg mb-1">🎉 First Loan Achievement!</p>
              <p className="text-sm text-white/90">You've unlocked higher limits for future loans</p>
            </div>
          </div>
        </div>
      </div>

      {/* M-Pesa Withdrawal Dialog */}
      <MpesaWithdrawalDialog
        open={withdrawalOpen}
        onOpenChange={setWithdrawalOpen}
        maxAmount={balance}
        onWithdraw={(amount, phone) => {
          console.log(`Withdrawing KES ${amount} to ${phone}`);
          // Handle withdrawal logic here
        }}
        onApplyForLoan={onApplyForLoan}
      />
    </div>
  );
};

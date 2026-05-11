import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { LoanApplicationData } from "../ZenkaApp";
import { User, Mail, Phone, Calendar, GraduationCap, Briefcase, DollarSign, FileText, CreditCard, Users, CheckCircle2, ChevronRight } from "lucide-react";
import { GuarantorDialog } from "./GuarantorDialog";

interface PersonalDetailsStepProps {
  applicationData: LoanApplicationData;
  onNext: (data?: Partial<LoanApplicationData>) => void;
  onBack: () => void;
  onUpdate: (data: Partial<LoanApplicationData>) => void;
}

export const PersonalDetailsStep: React.FC<PersonalDetailsStepProps> = ({ 
  applicationData, 
  onNext, 
  onUpdate 
}) => {
  const [formData, setFormData] = useState({
    firstName: applicationData.firstName || "",
    lastName: applicationData.lastName || "",
    email: applicationData.email || "",
    phone: applicationData.phone || "",
    dateOfBirth: applicationData.dateOfBirth || "",
    educationLevel: applicationData.educationLevel || "",
    employmentStatus: applicationData.employmentStatus || "",
    monthlyIncome: applicationData.monthlyIncome || "",
    loanPurpose: applicationData.loanPurpose || "",
    idNumber: applicationData.idNumber || "",
    guarantorName: applicationData.guarantorName || "",
    guarantorPhone: applicationData.guarantorPhone || "",
    guarantorRelationship: applicationData.guarantorRelationship || "",
  });

  const [guarantorDialogOpen, setGuarantorDialogOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { title: "Basic Info", icon: User },
    { title: "Professional", icon: Briefcase },
    { title: "Guarantor", icon: Users }
  ];

  const handleInputChange = (field: string, value: string) => {
    const updatedData = { ...formData, [field]: value };
    setFormData(updatedData);
    onUpdate(updatedData);
  };

  const isFormValid = () => {
    return formData.firstName && 
           formData.lastName && 
           formData.email && 
           formData.phone && 
           formData.dateOfBirth && 
           formData.educationLevel && 
           formData.employmentStatus && 
           formData.monthlyIncome && 
           formData.loanPurpose && 
           formData.idNumber &&
           formData.guarantorName &&
           formData.guarantorPhone &&
           formData.guarantorRelationship;
  };

  const isCurrentStepValid = () => {
    switch (currentStep) {
      case 0: // Basic Info
        return formData.firstName && formData.lastName && formData.email && formData.phone && formData.dateOfBirth && formData.idNumber;
      case 1: // Professional
        return formData.educationLevel && formData.employmentStatus && formData.monthlyIncome && formData.loanPurpose;
      case 2: // Guarantor
        return formData.guarantorName && formData.guarantorPhone && formData.guarantorRelationship;
      default:
        return false;
    }
  };

  const handleStepNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else if (isFormValid()) {
      onNext(formData);
    }
  };

  const handleStepBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleGuarantorSave = (guarantorData: { 
    guarantorName: string; 
    guarantorPhone: string; 
    guarantorRelationship: string 
  }) => {
    const updatedData = { ...formData, ...guarantorData };
    setFormData(updatedData);
    onUpdate(updatedData);
  };

  const hasGuarantorInfo = formData.guarantorName && formData.guarantorPhone && formData.guarantorRelationship;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-400/10 rounded-full blur-2xl animate-pulse-slow delay-1000"></div>
      
      <div className="max-w-md sm:max-w-2xl mx-auto p-3 sm:p-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8 pt-2 sm:pt-4">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-xl animate-bounce-in">
            {React.createElement(steps[currentStep].icon, { className: "w-7 h-7 sm:w-8 sm:h-8 text-white" })}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            {steps[currentStep].title}
          </h1>
          <p className="text-sm sm:text-base text-gray-600">Step {currentStep + 1} of {steps.length}</p>
        </div>

        {/* Step Progress */}
        <div className="flex justify-center mb-6 sm:mb-8 px-4">
          <div className="flex items-center space-x-2 sm:space-x-4">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center">
                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  index <= currentStep 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg' 
                    : 'bg-gray-200 text-gray-400'
                }`}>
                  {React.createElement(step.icon, { className: "w-4 h-4 sm:w-5 sm:h-5" })}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-8 sm:w-12 h-1 mx-1 sm:mx-2 rounded-full transition-all duration-300 ${
                    index < currentStep ? 'bg-gradient-to-r from-blue-500 to-purple-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        {currentStep === 0 && (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl border border-white/50 mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center gap-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-blue-600" />
              </div>
              Basic Information
            </h2>
          
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <User className="w-4 h-4 text-blue-500" />
                  First Name
                </Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  className="h-12 sm:h-14 border-2 focus:border-blue-500 rounded-xl transition-all duration-300 hover:shadow-md text-base"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <User className="w-4 h-4 text-blue-500" />
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  className="h-12 sm:h-14 border-2 focus:border-blue-500 rounded-xl transition-all duration-300 hover:shadow-md text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <Mail className="w-4 h-4 text-green-500" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="h-12 sm:h-14 border-2 focus:border-green-500 rounded-xl transition-all duration-300 hover:shadow-md text-base"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <Phone className="w-4 h-4 text-purple-500" />
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="h-12 sm:h-14 border-2 focus:border-purple-500 rounded-xl transition-all duration-300 hover:shadow-md text-base"
                />
              </div>
          
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <Calendar className="w-4 h-4 text-orange-500" />
                  Date of Birth
                </Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                  className="h-12 sm:h-14 border-2 focus:border-orange-500 rounded-xl transition-all duration-300 hover:shadow-md text-base"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="idNumber" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <CreditCard className="w-4 h-4 text-indigo-500" />
                  ID Number
                </Label>
                <Input
                  id="idNumber"
                  value={formData.idNumber}
                  onChange={(e) => handleInputChange("idNumber", e.target.value)}
                  className="h-12 sm:h-14 border-2 focus:border-indigo-500 rounded-xl transition-all duration-300 hover:shadow-md text-base"
                />
              </div>
            </div>
          </div>
        )}

        {currentStep === 1 && (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl border border-white/50 mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center gap-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Briefcase className="w-4 h-4 text-green-600" />
              </div>
              Professional Details
            </h2>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <GraduationCap className="w-4 h-4 text-blue-500" />
                  Level of Education
                </Label>
                <Select value={formData.educationLevel} onValueChange={(value) => handleInputChange("educationLevel", value)}>
                  <SelectTrigger className="h-12 sm:h-14 border-2 focus:border-blue-500 rounded-xl transition-all duration-300 hover:shadow-md text-base">
                    <SelectValue placeholder="Select education level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="primary">Primary School</SelectItem>
                    <SelectItem value="secondary">Secondary School</SelectItem>
                    <SelectItem value="diploma">Diploma/Certificate</SelectItem>
                    <SelectItem value="bachelor">Bachelor's Degree</SelectItem>
                    <SelectItem value="master">Master's Degree</SelectItem>
                    <SelectItem value="phd">PhD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <Briefcase className="w-4 h-4 text-green-500" />
                  Employment Status
                </Label>
                <Select value={formData.employmentStatus} onValueChange={(value) => handleInputChange("employmentStatus", value)}>
                  <SelectTrigger className="h-12 sm:h-14 border-2 focus:border-green-500 rounded-xl transition-all duration-300 hover:shadow-md text-base">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="employed">Employed</SelectItem>
                    <SelectItem value="self-employed">Self Employed</SelectItem>
                    <SelectItem value="business">Business Owner</SelectItem>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="unemployed">Unemployed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <DollarSign className="w-4 h-4 text-emerald-500" />
                  Monthly Income (KES)
                </Label>
                <Select value={formData.monthlyIncome} onValueChange={(value) => handleInputChange("monthlyIncome", value)}>
                  <SelectTrigger className="h-12 sm:h-14 border-2 focus:border-emerald-500 rounded-xl transition-all duration-300 hover:shadow-md text-base">
                    <SelectValue placeholder="Select income range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-15000">KES 0 - 15,000</SelectItem>
                    <SelectItem value="15000-30000">KES 15,000 - 30,000</SelectItem>
                    <SelectItem value="30000-50000">KES 30,000 - 50,000</SelectItem>
                    <SelectItem value="50000-100000">KES 50,000 - 100,000</SelectItem>
                    <SelectItem value="100000+">KES 100,000+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <FileText className="w-4 h-4 text-purple-500" />
                  Loan Purpose
                </Label>
                <Select value={formData.loanPurpose} onValueChange={(value) => handleInputChange("loanPurpose", value)}>
                  <SelectTrigger className="h-12 sm:h-14 border-2 focus:border-purple-500 rounded-xl transition-all duration-300 hover:shadow-md text-base">
                    <SelectValue placeholder="Select loan purpose" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="emergency">Emergency</SelectItem>
                    <SelectItem value="home">Home Improvement</SelectItem>
                    <SelectItem value="personal">Personal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl border border-white/50 mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center gap-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <Users className="w-4 h-4 text-purple-600" />
              </div>
              Guarantor Information
            </h2>
            
            <Button 
              type="button"
              onClick={() => setGuarantorDialogOpen(true)}
              variant={hasGuarantorInfo ? "secondary" : "outline"}
              className="w-full flex items-center justify-between py-4 sm:py-6 h-14 sm:h-16 border-2 border-dashed border-purple-300 hover:border-purple-500 rounded-xl transition-all duration-300 hover:shadow-lg active:scale-95"
            >
              <span className="flex items-center gap-3">
                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${
                  hasGuarantorInfo ? 'bg-green-100' : 'bg-purple-100'
                }`}>
                  {hasGuarantorInfo ? (
                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                  ) : (
                    <Users className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                  )}
                </div>
                <div className="text-left">
                  <span className="font-semibold text-gray-800 block text-sm sm:text-base">
                    {hasGuarantorInfo ? "Update Guarantor Information" : "Add Guarantor Information"}
                  </span>
                  {hasGuarantorInfo && (
                    <span className="text-xs sm:text-sm text-gray-600">
                      {formData.guarantorName} - {formData.guarantorRelationship}
                    </span>
                  )}
                </div>
              </span>
              <div className="text-purple-600">
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </Button>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-3 sm:gap-4 px-1">
          {currentStep > 0 && (
            <Button 
              onClick={handleStepBack}
              variant="outline"
              className="flex-1 h-12 sm:h-14 border-2 font-semibold rounded-xl transition-all duration-300 active:scale-95 text-sm sm:text-base"
            >
              Back
            </Button>
          )}
          <Button 
            onClick={handleStepNext}
            disabled={!isCurrentStepValid()}
            className={`${currentStep === 0 ? 'w-full' : 'flex-1'} h-12 sm:h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold text-sm sm:text-lg py-3 sm:py-4 px-4 sm:px-8 rounded-xl sm:rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95`}
          >
            <span className="flex items-center justify-center gap-2">
              {currentStep === steps.length - 1 ? 'Continue to Loan Selection' : 'Next'}
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </span>
          </Button>
        </div>
      </div>

      <GuarantorDialog
        open={guarantorDialogOpen}
        onOpenChange={setGuarantorDialogOpen}
        guarantorName={formData.guarantorName}
        guarantorPhone={formData.guarantorPhone}
        guarantorRelationship={formData.guarantorRelationship}
        onSave={handleGuarantorSave}
      />
    </div>
  );
};
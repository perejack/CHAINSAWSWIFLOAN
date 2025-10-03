import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Users, User, Phone, Heart } from "lucide-react";

interface GuarantorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  guarantorName: string;
  guarantorPhone: string;
  guarantorRelationship: string;
  onSave: (data: { guarantorName: string; guarantorPhone: string; guarantorRelationship: string }) => void;
}

export const GuarantorDialog: React.FC<GuarantorDialogProps> = ({
  open,
  onOpenChange,
  guarantorName,
  guarantorPhone,
  guarantorRelationship,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    guarantorName: guarantorName || "",
    guarantorPhone: guarantorPhone || "",
    guarantorRelationship: guarantorRelationship || "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isFormValid = () => {
    return formData.guarantorName && formData.guarantorPhone && formData.guarantorRelationship;
  };

  const handleSave = () => {
    if (isFormValid()) {
      onSave(formData);
      onOpenChange(false); // Close the dialog after saving
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-w-[95vw] p-0 overflow-hidden border-0 bg-transparent max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-br from-yellow-400 to-orange-500 text-white p-4 sm:p-6 pb-6 sm:pb-8">
          <div className="flex items-center justify-center mb-3 sm:mb-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Users className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
            </div>
          </div>
          <DialogTitle className="text-xl sm:text-2xl text-center text-white font-bold mb-2">
            Guarantor Information
          </DialogTitle>
          <DialogDescription className="text-center text-white/90 text-sm sm:text-base px-2">
            Please provide details about your guarantor
          </DialogDescription>
        </div>
        
        <div className="bg-white p-4 sm:p-6">
          <div className="space-y-4 sm:space-y-6">
            <div className="space-y-2 sm:space-y-3">
              <Label htmlFor="guarantorName" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <User className="w-4 h-4 text-purple-500" />
                Full Name
              </Label>
              <Input
                id="guarantorName"
                value={formData.guarantorName}
                onChange={(e) => setFormData(prev => ({ ...prev, guarantorName: e.target.value }))}
                className="h-12 sm:h-14 border-2 focus:border-purple-500 rounded-xl transition-all duration-300 hover:shadow-md text-base"
              />
            </div>

            <div className="space-y-2 sm:space-y-3">
              <Label htmlFor="guarantorPhone" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Phone className="w-4 h-4 text-green-500" />
                Phone Number
              </Label>
              <Input
                id="guarantorPhone"
                value={formData.guarantorPhone}
                onChange={(e) => setFormData(prev => ({ ...prev, guarantorPhone: e.target.value }))}
                className="h-12 sm:h-14 border-2 focus:border-green-500 rounded-xl transition-all duration-300 hover:shadow-md text-base"
              />
            </div>

            <div className="space-y-2 sm:space-y-3">
              <Label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Heart className="w-4 h-4 text-pink-500" />
                Relationship
              </Label>
              <Select 
                value={formData.guarantorRelationship} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, guarantorRelationship: value }))}
              >
                <SelectTrigger className="h-12 sm:h-14 border-2 focus:border-pink-500 rounded-xl transition-all duration-300 hover:shadow-md text-base">
                  <SelectValue placeholder="Select relationship" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="parent">Parent</SelectItem>
                  <SelectItem value="sibling">Sibling</SelectItem>
                  <SelectItem value="spouse">Spouse</SelectItem>
                  <SelectItem value="friend">Friend</SelectItem>
                  <SelectItem value="colleague">Colleague</SelectItem>
                  <SelectItem value="relative">Relative</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
          </div>

          <div className="flex gap-3 mt-6 sm:mt-8">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="flex-1 h-12 sm:h-14 border-2 font-semibold rounded-xl transition-all duration-300 active:scale-95 text-sm sm:text-base"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              disabled={!isFormValid()}
              className="flex-1 h-12 sm:h-14 bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 active:scale-95 text-sm sm:text-base"
            >
              Save Guarantor
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

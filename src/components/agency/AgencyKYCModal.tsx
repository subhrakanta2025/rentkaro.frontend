import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AgencyKYCModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AgencyKYCModal({ isOpen, onClose }: AgencyKYCModalProps) {
  const { userRole, isKYCVerified, kycStatus, isLoading: authLoading, refreshKYC } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && userRole === 'agency' && !authLoading) {
      if (isKYCVerified) {
        // If KYC is verified, close the modal automatically after a short delay
        const timer = setTimeout(() => {
          onClose();
        }, 1500);
        return () => clearTimeout(timer);
      } else {
        // If not verified, refresh KYC status in case it changed
        refreshKYC();
      }
    }
  }, [isOpen, userRole, isKYCVerified, authLoading, refreshKYC, onClose]);

  const handleVerifyKYC = async () => {
    setIsLoading(true);
    // In a real application, this would trigger an actual KYC process.
    // For now, we simulate it.
    await new Promise(resolve => setTimeout(resolve, 2000));
    await refreshKYC(); // Re-fetch KYC status after simulation
    setIsLoading(false);
  };

  if (userRole !== 'agency') {
    return null; // Or show a message that this is for agencies only
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Agency KYC Verification</DialogTitle>
          <DialogDescription>
            {isKYCVerified 
              ? 'Your agency KYC is verified.' 
              : 'Please complete your KYC verification to list vehicles.'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          {isKYCVerified ? (
            <div className="flex items-center gap-3 text-green-600 bg-green-50 p-3 rounded-lg">
              <CheckCircle className="h-5 w-5" />
              <p className="text-sm font-medium">KYC Verified! You can now list your vehicles.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-yellow-700 bg-yellow-50 p-3 rounded-lg">
                <AlertCircle className="h-5 w-5" />
                <p className="text-sm font-medium">Verification Pending or Required</p>
              </div>
              {kycStatus && (
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>Aadhaar: {kycStatus.aadhaar_verified ? 'Verified' : 'Pending'}</p>
                  <p>Driving License: {kycStatus.dl_verified ? 'Verified' : 'Pending'}</p>
                  <p>Status: {kycStatus.verification_status}</p>
                </div>
              )}
              <Button 
                className="w-full gap-2" 
                onClick={() => navigate('/agency/kyc')}
                disabled={isLoading}
              >
                {isLoading ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Verifying...</>
                ) : (
                  'Go to KYC Page'
                )}
              </Button>
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

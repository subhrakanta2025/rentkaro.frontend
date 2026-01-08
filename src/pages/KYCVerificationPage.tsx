import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { apiClient } from '@/services/api';
import {
  Shield,
  CheckCircle,
  AlertCircle,
  FileText,
  ArrowRight,
  Loader2,
  Upload,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function KYCVerificationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [step, setStep] = useState<'aadhaar' | 'dl' | 'selfie' | 'complete'>('aadhaar');
  const [isVerifying, setIsVerifying] = useState(false);
  const [documentsUploaded, setDocumentsUploaded] = useState(false);

  const [aadhaarFile, setAadhaarFile] = useState<File | null>(null);
  const [aadhaarPreview, setAadhaarPreview] = useState<string | null>(null);
  const [dlFile, setDlFile] = useState<File | null>(null);
  const [dlPreview, setDlPreview] = useState<string | null>(null);
  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  const [selfiePreview, setSelfiePreview] = useState<string | null>(null);

  const aadhaarInputRef = useRef<HTMLInputElement>(null);
  const dlInputRef = useRef<HTMLInputElement>(null);
  const selfieInputRef = useRef<HTMLInputElement>(null);

  const from = location.state?.from?.pathname || '/dashboard';

  useEffect(() => {
    // Check if documents are already uploaded
    const checkUploadStatus = async () => {
      try {
        const response = await apiClient.getKYCStatus() as any;
        if (response?.kyc?.documentsUploaded) {
          setDocumentsUploaded(true);
          setStep('complete');
        }
      } catch (error) {
        console.error('Failed to check upload status:', error);
      }
    };
    checkUploadStatus();
  }, []);

  useEffect(() => {
    if (step !== 'complete') return;

    const timer = setTimeout(() => {
      navigate(from, { replace: true });
    }, 4000);

    return () => clearTimeout(timer);
  }, [step, navigate, from]);

  const handleFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFile: (file: File | null) => void,
    setPreview: (url: string | null) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload JPG, PNG, WebP, or PDF');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be under 5MB');
      return;
    }

    setFile(file);

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const removeFile = (
    setFile: (file: File | null) => void,
    setPreview: (url: string | null) => void,
    inputRef: React.RefObject<HTMLInputElement>
  ) => {
    setFile(null);
    setPreview(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleAadhaarSubmit = async () => {
    if (!aadhaarFile) {
      toast.error('Please upload your Aadhaar card photo');
      return;
    }

    setIsVerifying(true);
    try {
      const formData = new FormData();
      formData.append('file', aadhaarFile);
      formData.append('docType', 'aadhaar');
      
      const response = await apiClient.post<any>('/kyc/upload', formData);
      
      toast.success('Aadhaar photo uploaded');
      if (response.documentsUploaded) {
        setDocumentsUploaded(true);
        setStep('complete');
      } else {
        setStep('dl');
      }
    } catch (error) {
      toast.error('Failed to upload Aadhaar photo');
      console.error(error);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleDLSubmit = async () => {
    if (!dlFile) {
      toast.error('Please upload your Driving License photo');
      return;
    }

    setIsVerifying(true);
    try {
      const formData = new FormData();
      formData.append('file', dlFile);
      formData.append('docType', 'dl');
      
      const response = await apiClient.post<any>('/kyc/upload', formData);
      
      toast.success('Driving License photo uploaded');
      if (response.documentsUploaded) {
        setDocumentsUploaded(true);
        setStep('complete');
      } else {
        setStep('selfie');
      }
    } catch (error) {
      toast.error('Failed to upload Driving License photo');
      console.error(error);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSelfieSubmit = async () => {
    if (!selfieFile) {
      toast.error('Please upload a clear selfie');
      return;
    }

    setIsVerifying(true);
    try {
      const formData = new FormData();
      formData.append('file', selfieFile);
      formData.append('docType', 'selfie');
      
      const response = await apiClient.post<any>('/kyc/upload', formData);
      
      toast.success('KYC verification submitted');
      setDocumentsUploaded(true);
      setStep('complete');
    } catch (error) {
      toast.error('Failed to upload selfie');
      console.error(error);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleContinue = () => {
    navigate(from, { replace: true });
  };

  return (
    <DashboardLayout title="DigiLocker KYC Verification" description="Verify your identity to proceed with booking">
      <div className="mx-auto max-w-2xl space-y-4">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">DigiLocker KYC Verification</h1>
            <p className="mt-2 text-muted-foreground">
              Verify your identity to proceed with booking
            </p>
          </div>

          {/* Progress */}
          <div className="flex items-center justify-center gap-4 mb-8 flex-wrap">
            <div className="flex items-center gap-2">
              <div className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold",
                step === 'aadhaar' ? "bg-primary text-primary-foreground" :
                step === 'dl' || step === 'selfie' || step === 'complete' ? "bg-success text-success-foreground" : "bg-muted text-muted-foreground"
              )}>
                {step === 'aadhaar' ? "1" : <CheckCircle className="h-4 w-4" />}
              </div>
              <span className="text-sm font-medium text-foreground">Aadhaar Photo</span>
            </div>
            <div className="h-0.5 w-12 bg-border" />
            <div className="flex items-center gap-2">
              <div className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold",
                step === 'dl' ? "bg-primary text-primary-foreground" :
                step === 'selfie' || step === 'complete' ? "bg-success text-success-foreground" : "bg-muted text-muted-foreground"
              )}>
                {step === 'selfie' || step === 'complete' ? <CheckCircle className="h-4 w-4" /> : "2"}
              </div>
              <span className="text-sm font-medium text-foreground">DL Photo</span>
            </div>
            <div className="h-0.5 w-12 bg-border" />
            <div className="flex items-center gap-2">
              <div className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold",
                step === 'selfie' ? "bg-primary text-primary-foreground" :
                step === 'complete' ? "bg-success text-success-foreground" : "bg-muted text-muted-foreground"
              )}>
                {step === 'complete' ? <CheckCircle className="h-4 w-4" /> : "3"}
              </div>
              <span className="text-sm font-medium text-foreground">Selfie</span>
            </div>
          </div>

          {/* Form Card */}
          <div className="rounded-xl border border-border bg-card p-8 shadow-card">
            {step === 'aadhaar' && (
              <div className="animate-fade-in">
                <div className="flex items-center gap-3 mb-6">
                  <FileText className="h-6 w-6 text-primary" />
                  <h2 className="text-lg font-semibold text-foreground">
                    Upload Aadhaar Card Photo
                  </h2>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="block">Aadhaar Card Photo <span className="text-destructive">*</span></Label>
                    <input
                      ref={aadhaarInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp,application/pdf"
                      onChange={(e) => handleFileSelect(e, setAadhaarFile, setAadhaarPreview)}
                      className="hidden"
                    />

                    {!aadhaarFile ? (
                      <div
                        onClick={() => aadhaarInputRef.current?.click()}
                        className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
                      >
                        <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                        <p className="text-xs text-muted-foreground mt-1">JPG, PNG, WebP or PDF (max 5MB)</p>
                      </div>
                    ) : (
                      <div className="relative border border-border rounded-lg p-4 bg-muted/30">
                        <div className="flex items-center gap-4">
                          {aadhaarPreview ? (
                            <img src={aadhaarPreview} alt="Aadhaar Preview" className="h-16 w-16 object-cover rounded-lg" />
                          ) : (
                            <div className="h-16 w-16 flex items-center justify-center bg-muted rounded-lg">
                              <FileText className="h-8 w-8 text-muted-foreground" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">{aadhaarFile.name}</p>
                            <p className="text-xs text-muted-foreground">{(aadhaarFile.size / 1024 / 1024).toFixed(2)} MB</p>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => removeFile(setAadhaarFile, setAadhaarPreview, aadhaarInputRef)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                    <div className="flex items-start gap-3">
                      <Shield className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium text-foreground text-sm">Clear photo required</p>
                        <p className="text-sm text-muted-foreground mt-1">Upload a well-lit photo where all details are visible.</p>
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="hero"
                    size="lg"
                    className="w-full gap-2"
                    onClick={handleAadhaarSubmit}
                    disabled={isVerifying}
                  >
                    {isVerifying ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        Continue
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}

            {step === 'dl' && (
              <div className="animate-fade-in">
                <div className="flex items-center gap-3 mb-6">
                  <FileText className="h-6 w-6 text-primary" />
                  <h2 className="text-lg font-semibold text-foreground">
                    Upload Driving License Photo
                  </h2>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="block">Driving License Photo <span className="text-destructive">*</span></Label>
                    <input
                      ref={dlInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp,application/pdf"
                      onChange={(e) => handleFileSelect(e, setDlFile, setDlPreview)}
                      className="hidden"
                    />

                    {!dlFile ? (
                      <div
                        onClick={() => dlInputRef.current?.click()}
                        className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
                      >
                        <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                        <p className="text-xs text-muted-foreground mt-1">JPG, PNG, WebP or PDF (max 5MB)</p>
                      </div>
                    ) : (
                      <div className="relative border border-border rounded-lg p-4 bg-muted/30">
                        <div className="flex items-center gap-4">
                          {dlPreview ? (
                            <img src={dlPreview} alt="DL Preview" className="h-16 w-16 object-cover rounded-lg" />
                          ) : (
                            <div className="h-16 w-16 flex items-center justify-center bg-muted rounded-lg">
                              <FileText className="h-8 w-8 text-muted-foreground" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">{dlFile.name}</p>
                            <p className="text-xs text-muted-foreground">{(dlFile.size / 1024 / 1024).toFixed(2)} MB</p>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => removeFile(setDlFile, setDlPreview, dlInputRef)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-4 rounded-lg bg-warning/10 border border-warning/20">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-warning mt-0.5" />
                      <div>
                        <p className="font-medium text-foreground text-sm">Make sure the details are readable</p>
                        <p className="text-sm text-muted-foreground mt-1">Upload front side with number, name, and validity clearly visible.</p>
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="hero"
                    size="lg"
                    className="w-full gap-2"
                    onClick={handleDLSubmit}
                    disabled={isVerifying}
                  >
                    {isVerifying ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        Continue
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}

            {step === 'selfie' && (
              <div className="animate-fade-in">
                <div className="flex items-center gap-3 mb-6">
                  <Shield className="h-6 w-6 text-primary" />
                  <h2 className="text-lg font-semibold text-foreground">
                    Upload a Clear Selfie
                  </h2>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="block">Selfie Photo <span className="text-destructive">*</span></Label>
                    <input
                      ref={selfieInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={(e) => handleFileSelect(e, setSelfieFile, setSelfiePreview)}
                      className="hidden"
                    />

                    {!selfieFile ? (
                      <div
                        onClick={() => selfieInputRef.current?.click()}
                        className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
                      >
                        <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                        <p className="text-xs text-muted-foreground mt-1">JPG, PNG, WebP (max 5MB)</p>
                      </div>
                    ) : (
                      <div className="relative border border-border rounded-lg p-4 bg-muted/30">
                        <div className="flex items-center gap-4">
                          {selfiePreview ? (
                            <img src={selfiePreview} alt="Selfie Preview" className="h-16 w-16 object-cover rounded-lg" />
                          ) : (
                            <div className="h-16 w-16 flex items-center justify-center bg-muted rounded-lg">
                              <FileText className="h-8 w-8 text-muted-foreground" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">{selfieFile.name}</p>
                            <p className="text-xs text-muted-foreground">{(selfieFile.size / 1024 / 1024).toFixed(2)} MB</p>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => removeFile(setSelfieFile, setSelfiePreview, selfieInputRef)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                    <div className="flex items-start gap-3">
                      <Shield className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium text-foreground text-sm">Tips for a clear selfie</p>
                        <p className="text-sm text-muted-foreground mt-1">Face the camera, good lighting, no sunglasses or masks.</p>
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="hero"
                    size="lg"
                    className="w-full gap-2"
                    onClick={handleSelfieSubmit}
                    disabled={isVerifying}
                  >
                    {isVerifying ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        Verify & Complete
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}

            {step === 'complete' && (
              <div className="animate-fade-in text-center py-6">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-success/10 mb-4">
                  <CheckCircle className="h-8 w-8 text-success" />
                </div>
                <h2 className="text-xl font-bold text-foreground mb-2">
                  {documentsUploaded ? 'All Documents Uploaded Successfully' : 'KYC Verification Complete!'}
                </h2>
                <p className="text-muted-foreground mb-6">
                  {documentsUploaded 
                    ? 'We have received your Aadhaar, DL, and selfie. Verification takes a little time—sit tight while we confirm everything and we will redirect you to your dashboard for bookings automatically.'
                    : 'Your identity has been verified successfully. You can now proceed with booking.'}
                </p>
                <Button
                  variant="hero"
                  size="lg"
                  className="gap-2"
                  onClick={handleContinue}
                >
                  Continue to Booking
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <p className="text-xs text-muted-foreground mt-3">{documentsUploaded ? 'You will be redirected automatically once checks finish.' : ''}</p>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>
              By verifying, you agree to our{' '}
              <a href="/terms" className="text-primary hover:underline">Terms of Service</a>
              {' '}and{' '}
              <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>
            </p>
          </div>
      </div>
    </DashboardLayout>
  );
}
